#!/usr/bin/env python3
"""VocabWize DB Enrichment: AI로 예문/어원/유의어 등 추가"""

import json
import os
import sqlite3
import sys
import time

import requests
from dotenv import load_dotenv

# orchestrator의 .env에서 API 키 로드
load_dotenv(os.path.join(os.path.dirname(__file__), "../../orchestrator/.env"))

DB_PATH = os.path.join(os.path.dirname(__file__), "../data/vocab.db")
API_KEY = os.getenv("OPENAI_API_KEY", "")
MODEL = "gpt-4.1-mini"
BATCH_SIZE = 10
MAX_RETRIES = 3
TARGET_COUNT = 5000


def ensure_columns(conn: sqlite3.Connection):
    """새 컬럼이 없으면 추가"""
    cursor = conn.execute("PRAGMA table_info(words)")
    existing = {row[1] for row in cursor.fetchall()}

    new_cols = ["examples", "etymology", "synonyms", "antonyms", "level", "usage_note"]
    for col in new_cols:
        if col not in existing:
            conn.execute(f"ALTER TABLE words ADD COLUMN {col} TEXT")
            print(f"  ✅ Added column: {col}")

    conn.commit()


def get_unenriched_words(conn: sqlite3.Connection, limit: int) -> list[dict]:
    """아직 enrich 안 된 상위 frequency 단어 가져오기"""
    rows = conn.execute(
        """SELECT slug, word, definition, pos
           FROM words
           WHERE frequency > 0 AND examples IS NULL
           ORDER BY frequency DESC
           LIMIT ?""",
        (limit,),
    ).fetchall()
    return [
        {"slug": r[0], "word": r[1], "definition": r[2] or "", "pos": r[3] or ""}
        for r in rows
    ]


def build_prompt(words: list[dict]) -> str:
    """배치 프롬프트 생성"""
    word_list = "\n".join(
        f'{i+1}. "{w["word"]}" ({w["pos"]}) — {w["definition"][:80]}'
        for i, w in enumerate(words)
    )

    return f"""For each word below, provide enrichment data. Return ONLY a JSON array with no markdown formatting.

Each object must have these exact keys:
- "word": the word (string)
- "examples": exactly 3 natural English example sentences (array of strings)
- "etymology": 1-2 sentence origin/history (string)
- "synonyms": up to 5 common synonyms (array of strings, empty if none)
- "antonyms": up to 5 antonyms (array of strings, empty if none)
- "level": one of "basic", "intermediate", "advanced", "academic" (string)
- "usage_note": 2-3 sentences about common mistakes or usage tips (string)

Words:
{word_list}

Return ONLY a valid JSON array. No explanation, no markdown."""


def call_api(prompt: str) -> list[dict]:
    """OpenAI API 호출"""
    resp = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7,
            "max_tokens": 4096,
        },
        timeout=120,
    )
    resp.raise_for_status()
    content = resp.json()["choices"][0]["message"]["content"].strip()

    # JSON 파싱 (코드블록 제거)
    if "```" in content:
        import re
        match = re.search(r"```(?:json)?\s*\n?(.*?)\n?```", content, re.DOTALL)
        if match:
            content = match.group(1).strip()

    return json.loads(content)


def save_batch(conn: sqlite3.Connection, words: list[dict], results: list[dict]):
    """결과를 DB에 저장"""
    # word 이름으로 매칭
    result_map = {r["word"].lower(): r for r in results}

    for w in words:
        r = result_map.get(w["word"].lower())
        if not r:
            continue

        conn.execute(
            """UPDATE words SET
                examples = ?, etymology = ?, synonyms = ?,
                antonyms = ?, level = ?, usage_note = ?
               WHERE slug = ?""",
            (
                json.dumps(r.get("examples", []), ensure_ascii=False),
                r.get("etymology", ""),
                json.dumps(r.get("synonyms", []), ensure_ascii=False),
                json.dumps(r.get("antonyms", []), ensure_ascii=False),
                r.get("level", "intermediate"),
                r.get("usage_note", ""),
                w["slug"],
            ),
        )

    conn.commit()


def main():
    if not API_KEY:
        print("❌ OPENAI_API_KEY not found in orchestrator/.env")
        sys.exit(1)

    conn = sqlite3.connect(DB_PATH)

    # Phase 1-A: 스키마 확장
    print("📦 Phase 1-A: DB 스키마 확장...")
    ensure_columns(conn)

    # Phase 1-B: AI enrichment
    print(f"\n🤖 Phase 1-B: AI enrichment (상위 {TARGET_COUNT}개 단어)...")
    words = get_unenriched_words(conn, TARGET_COUNT)
    total = len(words)

    if total == 0:
        print("  ✅ 모든 대상 단어가 이미 enriched 됨!")
        conn.close()
        return

    print(f"  📝 Enrich 대상: {total}개 단어")
    print(f"  📦 배치 수: {(total + BATCH_SIZE - 1) // BATCH_SIZE}개\n")

    enriched = 0
    errors = 0

    for i in range(0, total, BATCH_SIZE):
        batch = words[i : i + BATCH_SIZE]
        batch_num = i // BATCH_SIZE + 1
        total_batches = (total + BATCH_SIZE - 1) // BATCH_SIZE
        batch_words = ", ".join(w["word"] for w in batch)

        print(f"  [{batch_num}/{total_batches}] {batch_words}...", end=" ", flush=True)

        for attempt in range(MAX_RETRIES):
            try:
                prompt = build_prompt(batch)
                results = call_api(prompt)
                save_batch(conn, batch, results)
                enriched += len(batch)
                print(f"✅ ({enriched}/{total})")
                break
            except Exception as e:
                if attempt < MAX_RETRIES - 1:
                    print(f"⚠️ retry {attempt + 1}...", end=" ", flush=True)
                    time.sleep(2)
                else:
                    print(f"❌ {e}")
                    errors += 1

        # Rate limit 방지
        time.sleep(0.5)

    conn.close()

    print(f"\n🎉 완료! enriched: {enriched}, errors: {errors}")


if __name__ == "__main__":
    main()
