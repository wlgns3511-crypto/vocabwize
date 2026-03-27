import { ImageResponse } from 'next/og';
import { getWordBySlug, getTopWords } from '@/lib/db';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return getTopWords(1000).map((w) => ({ slug: w.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = getWordBySlug(slug);

  if (!w) {
    return new ImageResponse(
      <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#0d9488', color: 'white', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ fontSize: 48 }}>VOCABWIZE</div>
      </div>,
      { ...size }
    );
  }

  const levelColors: Record<string, { bg: string; text: string }> = {
    basic: { bg: '#dcfce7', text: '#16a34a' },
    intermediate: { bg: '#dbeafe', text: '#2563eb' },
    advanced: { bg: '#ffedd5', text: '#ea580c' },
    academic: { bg: '#f3e8ff', text: '#9333ea' },
  };
  const levelStyle = w.level ? (levelColors[w.level] || { bg: '#f1f5f9', text: '#475569' }) : null;

  const shortDef = w.definition.split(';')[0].trim();
  const displayDef = shortDef.length > 160 ? shortDef.substring(0, 157) + '...' : shortDef;

  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', backgroundColor: '#f0fdfa', fontFamily: 'sans-serif', padding: '48px 56px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 18, color: '#0d9488', fontWeight: 700, letterSpacing: 2 }}>VOCABWIZE</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 8 }}>
            <div style={{ fontSize: 64, fontWeight: 900, color: '#0c1a2e', lineHeight: 1 }}>
              {w.word}
            </div>
            {w.phonetic && (
              <div style={{ fontSize: 24, color: '#94a3b8', fontStyle: 'italic' }}>/{w.phonetic}/</div>
            )}
          </div>
          {w.pos && (
            <div style={{ fontSize: 20, color: '#0d9488', marginTop: 6, fontStyle: 'italic' }}>{w.pos}</div>
          )}
        </div>
        {levelStyle && w.level && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: levelStyle.bg, borderRadius: 16, padding: '16px 28px' }}>
            <div style={{ fontSize: 13, color: levelStyle.text, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>Level</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: levelStyle.text, marginTop: 4 }}>
              {w.level.charAt(0).toUpperCase() + w.level.slice(1)}
            </div>
          </div>
        )}
      </div>

      {/* Definition box */}
      <div style={{ display: 'flex', backgroundColor: 'white', borderRadius: 12, padding: '24px 28px', border: '2px solid #99f6e4', marginTop: 8 }}>
        <div style={{ fontSize: 22, color: '#1e293b', lineHeight: 1.5 }}>
          {displayDef}
        </div>
      </div>

      {/* Accent bar */}
      <div style={{ display: 'flex', height: 8, borderRadius: 4, backgroundColor: '#0d9488', marginTop: 'auto', marginBottom: 16 }} />

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#94a3b8' }}>
        <div style={{ color: '#0d9488', fontWeight: 600 }}>vocabwize.com</div>
        <div>English Vocabulary · Definitions · Examples · Etymology</div>
      </div>
    </div>,
    { ...size }
  );
}
