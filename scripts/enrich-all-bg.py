#!/usr/bin/env python3
"""VocabWize 전체 단어 백그라운드 enrichment + 완료 시 자동 push"""

import json
import os
import re
import sqlite3
import subprocess
import sys
import time

import requests
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "../../orchestrator/.env"))

DB_PATH = os.path.join(os.path.dirname(__file__), "../data/vocab.db")
REPO_PATH = os.path.join(os.path.dirname(__file__), "..")
API_KEY = os.getenv("OPENAI_API_KEY", "")
MODEL = "gpt-4.1-mini"
BATCH_SIZE = 10
MAX_RETRIES = 3
PUSH_EVERY = 500  # 500개마다 중간 push
SLEEP_BETWEEN = 0.3  # API rate limit


def get_unenriched_words(conn, limit):
    rows = conn.execute(
        """SELECT slug, word, definition, pos
           FROM words
           WHERE examples IS NULL
           ORDER BY frequency DESC NULLS LAST, slug
           LIMIT ?""",
        (limit,),
    ).fetchall()
    return [
        {"slug": r[0], "word": r[1], "definition": r[2] or "", "pos": r[3] or ""}
        for r in rows
    ]


def build_prompt(words):
    word_list = "\n".join(
        f'{i+1}. "{w["word"]}" ({w["pos"]}) — {w["definition"][:80]}'
        for i, w in enumerate(words)
    )
    return f"""For each word below, provide enrichment data. Return ONLY a JSON array.

Each object must have:
- "word": the word (string)
- "examples": exactly 3 example sentences (array of strings)
- "etymology": 1-2 sentence origin (string)
- "synonyms": up to 5 synonyms (array, empty if none)
- "antonyms": up to 5 antonyms (array, empty if none)
- "level": "basic"|"intermediate"|"advanced"|"academic"
- "usage_note": 1-2 sentences usage tips (string)

Words:
{word_list}

Return ONLY valid JSON array. No markdown."""


def call_api(prompt):
    resp = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
        json={"model": MODEL, "messages": [{"role": "user", "content": prompt}], "temperature": 0.7, "max_tokens": 4096},
        timeout=120,
    )
    resp.raise_for_status()
    content = resp.json()["choices"][0]["message"]["content"].strip()
    if "```" in content:
        match = re.search(r"```(?:json)?\s*\n?(.*?)\n?```", content, re.DOTALL)
        if match:
            content = match.group(1).strip()
    return json.loads(content)


def save_batch(conn, words, results):
    result_map = {r["word"].lower(): r for r in results}
    for w in words:
        r = result_map.get(w["word"].lower())
        if not r:
            continue
        conn.execute(
            """UPDATE words SET examples=?, etymology=?, synonyms=?, antonyms=?, level=?, usage_note=? WHERE slug=?""",
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


def git_push(enriched_count):
    try:
        subprocess.run(["git", "add", "data/vocab.db"], cwd=REPO_PATH, check=True, capture_output=True)
        subprocess.run(
            ["git", "commit", "-m", f"Enrich {enriched_count} words (background)\n\nCo-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"],
            cwd=REPO_PATH, check=True, capture_output=True,
        )
        subprocess.run(["git", "push"], cwd=REPO_PATH, check=True, capture_output=True)
        print(f"  📤 Git push 완료 ({enriched_count}개)")
    except subprocess.CalledProcessError as e:
        print(f"  ⚠️ Git push 실패: {e}")


def main():
    if not API_KEY:
        print("❌ OPENAI_API_KEY not found")
        sys.exit(1)

    conn = sqlite3.connect(DB_PATH)

    # 현재 상태 확인
    total_words = conn.execute("SELECT COUNT(*) FROM words").fetchone()[0]
    already_done = conn.execute("SELECT COUNT(*) FROM words WHERE examples IS NOT NULL").fetchone()[0]
    remaining = total_words - already_done

    print(f"📊 전체: {total_words}, 완료: {already_done}, 남은: {remaining}")
    print(f"⏰ 시작: {time.strftime('%Y-%m-%d %H:%M')}")
    print(f"📦 {PUSH_EVERY}개마다 자동 push\n")

    if remaining == 0:
        print("✅ 모든 단어 enriched!")
        conn.close()
        return

    enriched_session = 0
    errors = 0
    last_push = 0

    while True:
        words = get_unenriched_words(conn, BATCH_SIZE)
        if not words:
            break

        batch_words = ", ".join(w["word"] for w in words[:3]) + ("..." if len(words) > 3 else "")
        total_done = already_done + enriched_session
        print(f"  [{total_done}/{total_words}] {batch_words}", end=" ", flush=True)

        for attempt in range(MAX_RETRIES):
            try:
                results = call_api(build_prompt(words))
                save_batch(conn, words, results)
                enriched_session += len(words)
                print(f"✅")
                break
            except Exception as e:
                if attempt < MAX_RETRIES - 1:
                    print(f"⚠️", end=" ", flush=True)
                    time.sleep(5)
                else:
                    print(f"❌ {e}")
                    errors += 1
                    # 연속 에러 시 대기
                    if errors > 5:
                        print("  ⏸️ 연속 에러. 60초 대기...")
                        time.sleep(60)
                        errors = 0

        # 중간 push
        if enriched_session - last_push >= PUSH_EVERY:
            git_push(already_done + enriched_session)
            last_push = enriched_session

        time.sleep(SLEEP_BETWEEN)

    conn.close()

    # 최종 push
    git_push(already_done + enriched_session)

    print(f"\n🎉 완료! 총 enriched: {already_done + enriched_session}/{total_words}")
    print(f"⏰ 종료: {time.strftime('%Y-%m-%d %H:%M')}")


if __name__ == "__main__":
    main()
