"""Build vocabulary SQLite database from ECDICT data."""
import csv
import os
import re
import sqlite3

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
DB_PATH = os.path.join(DATA_DIR, 'vocab.db')
CSV_PATH = '/tmp/ecdict-test.csv'


def slugify(word):
    return re.sub(r'[^a-z0-9]+', '-', word.lower().strip()).strip('-')


def clean_definition(d):
    """Remove Chinese translations, keep only English definitions."""
    if not d:
        return None
    # Split by newline, keep lines that look English
    lines = d.split('\\n') if '\\n' in d else d.split('\n')
    english_lines = []
    for line in lines:
        line = line.strip()
        # Skip lines that are mostly non-ASCII (Chinese)
        ascii_ratio = sum(1 for c in line if ord(c) < 128) / max(len(line), 1)
        if ascii_ratio > 0.7 and len(line) > 3:
            english_lines.append(line)
    return '; '.join(english_lines) if english_lines else None


def extract_synonyms(exchange_field):
    """Parse exchange field for related words."""
    if not exchange_field:
        return []
    related = []
    for part in exchange_field.split('/'):
        if ':' in part:
            _, words = part.split(':', 1)
            related.extend(w.strip() for w in words.split(',') if w.strip())
    return related[:5]


def main():
    os.makedirs(DATA_DIR, exist_ok=True)
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.executescript('''
        CREATE TABLE words (
            slug TEXT PRIMARY KEY,
            word TEXT NOT NULL,
            phonetic TEXT,
            definition TEXT,
            pos TEXT,
            frequency INTEGER,
            exchange TEXT
        );
        CREATE INDEX idx_words_word ON words(word);
        CREATE INDEX idx_words_freq ON words(frequency);
    ''')

    print('Parsing ECDICT data...')
    count = 0
    slugs_seen = set()

    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            word = row.get('word', '').strip()
            if not word or len(word) < 2 or len(word) > 40:
                continue

            # Skip words with special characters
            if not re.match(r'^[a-zA-Z][a-zA-Z\s\-\']*$', word):
                continue

            definition = clean_definition(row.get('definition', ''))
            if not definition:
                continue

            slug = slugify(word)
            if not slug or slug in slugs_seen:
                continue
            slugs_seen.add(slug)

            phonetic = row.get('phonetic', '').strip() or None
            pos = row.get('pos', '').strip() or None
            frq = int(row.get('frq', '0') or '0')
            bnc = int(row.get('bnc', '0') or '0')
            freq = max(frq, bnc)
            exchange = row.get('exchange', '').strip() or None

            c.execute('INSERT OR IGNORE INTO words VALUES (?,?,?,?,?,?,?)',
                      (slug, word, phonetic, definition, pos, freq, exchange))
            count += 1

            if count % 10000 == 0:
                print(f'  {count} words...')
                conn.commit()

    conn.commit()

    # Summary
    total = c.execute('SELECT COUNT(*) FROM words').fetchone()[0]
    with_phonetic = c.execute('SELECT COUNT(*) FROM words WHERE phonetic IS NOT NULL').fetchone()[0]
    high_freq = c.execute('SELECT COUNT(*) FROM words WHERE frequency > 0').fetchone()[0]

    print(f'\n=== Database Summary ===')
    print(f'  Words: {total}')
    print(f'  With phonetic: {with_phonetic}')
    print(f'  With frequency data: {high_freq}')
    print(f'  DB size: {os.path.getsize(DB_PATH) / 1024:.0f} KB')

    conn.close()
    print('\nDone!')


if __name__ == '__main__':
    main()
