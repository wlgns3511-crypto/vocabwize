#!/usr/bin/env python3
"""Generate word comparison pairs for vocabwize"""
import sqlite3, os, json, time

DB_PATH = os.path.join(os.path.dirname(__file__), "../data/vocab.db")

# Commonly confused word pairs
CONFUSED_PAIRS = [
    ("affect", "effect"), ("their", "there"), ("your", "you're"),
    ("then", "than"), ("its", "it's"), ("who's", "whose"),
    ("accept", "except"), ("advice", "advise"), ("loose", "lose"),
    ("principal", "principle"), ("stationary", "stationery"),
    ("complement", "compliment"), ("desert", "dessert"),
    ("emigrate", "immigrate"), ("farther", "further"),
    ("fewer", "less"), ("imply", "infer"), ("lie", "lay"),
    ("precede", "proceed"), ("weather", "whether"),
    ("assure", "ensure"), ("beside", "besides"),
    ("continual", "continuous"), ("discreet", "discrete"),
    ("elicit", "illicit"), ("eminent", "imminent"),
    ("historic", "historical"), ("moral", "morale"),
    ("personal", "personnel"), ("practice", "practise"),
]

def main():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS comparisons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            slugA TEXT NOT NULL, slugB TEXT NOT NULL,
            wordA TEXT NOT NULL, wordB TEXT NOT NULL,
            popularity_score REAL DEFAULT 0,
            UNIQUE(slugA, slugB)
        )
    """)
    
    existing = conn.execute("SELECT COUNT(*) FROM comparisons").fetchone()[0]
    if existing > 3000:
        print(f"Already have {existing} comparisons")
        return

    # 1. Add confused pairs
    count = 0
    for a, b in CONFUSED_PAIRS:
        rowA = conn.execute("SELECT slug, word FROM words WHERE word = ?", (a,)).fetchone()
        rowB = conn.execute("SELECT slug, word FROM words WHERE word = ?", (b,)).fetchone()
        if rowA and rowB:
            slugs = sorted([(rowA[0], rowA[1]), (rowB[0], rowB[1])])
            try:
                conn.execute("INSERT OR IGNORE INTO comparisons (slugA, slugB, wordA, wordB, popularity_score) VALUES (?,?,?,?,?)",
                    (slugs[0][0], slugs[1][0], slugs[0][1], slugs[1][1], 1000))
                count += 1
            except: pass
    print(f"Confused pairs: {count}")

    # 2. Synonym pairs from enriched words
    words_with_syns = conn.execute(
        "SELECT slug, word, synonyms FROM words WHERE synonyms IS NOT NULL AND synonyms != '[]' AND frequency > 0 ORDER BY frequency DESC LIMIT 500"
    ).fetchall()
    
    syn_count = 0
    for slug, word, syns_json in words_with_syns:
        try:
            syns = json.loads(syns_json)
        except: continue
        for syn in syns[:3]:
            syn_row = conn.execute("SELECT slug, word FROM words WHERE word = ?", (syn.lower(),)).fetchone()
            if syn_row:
                slugs = sorted([(slug, word), (syn_row[0], syn_row[1])])
                try:
                    conn.execute("INSERT OR IGNORE INTO comparisons (slugA, slugB, wordA, wordB, popularity_score) VALUES (?,?,?,?,?)",
                        (slugs[0][0], slugs[1][0], slugs[0][1], slugs[1][1], 500))
                    syn_count += 1
                except: pass
    print(f"Synonym pairs: {syn_count}")

    # 3. Top frequency word pairs (adjacent in frequency)
    top_words = conn.execute(
        "SELECT slug, word FROM words WHERE frequency > 0 ORDER BY frequency DESC LIMIT 2000"
    ).fetchall()
    
    freq_count = 0
    for i in range(0, len(top_words) - 1, 2):
        slugA, wordA = top_words[i]
        slugB, wordB = top_words[i + 1]
        slugs = sorted([(slugA, wordA), (slugB, wordB)])
        try:
            conn.execute("INSERT OR IGNORE INTO comparisons (slugA, slugB, wordA, wordB, popularity_score) VALUES (?,?,?,?,?)",
                (slugs[0][0], slugs[1][0], slugs[0][1], slugs[1][1], 100))
            freq_count += 1
        except: pass
    print(f"Frequency pairs: {freq_count}")

    conn.commit()
    final = conn.execute("SELECT COUNT(*) FROM comparisons").fetchone()[0]
    print(f"\nTotal: {final} comparisons")
    conn.close()

if __name__ == "__main__":
    main()
