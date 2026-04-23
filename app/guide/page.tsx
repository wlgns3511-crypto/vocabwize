import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllGuides } from '@/lib/guides';

export const metadata: Metadata = {
  title: 'Vocabulary Guides — Evidence-Based Learning Methods',
  description: 'In-depth guides on how to learn English vocabulary fast — spaced repetition, reading strategies, active vs passive recall, and which words to study first.',
  alternates: { canonical: '/guide/' },
  openGraph: { url: '/guide/' },
};

export default function GuidesIndex() {
  const guides = getAllGuides();
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Vocabulary Learning Guides</h1>
        <p className="text-slate-600 max-w-3xl">
          Long-form, research-backed guides on how to build English vocabulary efficiently — memory
          science, proven study methods, and practical daily routines. Every guide links to our
          word database and quiz tools so you can apply what you read immediately.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/guide/${g.slug}/`}
            className="block rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 p-5 transition-colors"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">{g.category}</div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">{g.title}</h2>
            <p className="text-sm text-slate-600">{g.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
