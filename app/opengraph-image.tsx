import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'VocabWize - English Word Definitions and Usage';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: '#4f46e5', color: 'white', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', fontSize: 72, fontWeight: 800, marginBottom: 16 }}>VocabWize</div>
        <div style={{ display: 'flex', fontSize: 32, opacity: 0.9 }}>English Word Definitions and Usage</div>
      </div>
    ),
    { ...size }
  );
}
