export function AuthorBox() {
  return (
    <div className="mt-8 p-4 bg-slate-50 border-l-4 border-indigo-500 rounded-r-lg">
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-semibold text-slate-700">VocabWize Lexicography Team</span>
      </div>
      <p className="text-xs text-slate-600 leading-relaxed mb-2">
        Our definitions are compiled from multiple authoritative lexicographic databases, verified by computational linguistics analysis, and updated monthly.
      </p>
      <p className="text-xs text-slate-400">
        Sources: English Lexicographic Databases &middot; Corpus Linguistics Data &middot; Etymological Records
      </p>
    </div>
  );
}
