import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ExternalLink, BookCheck } from 'lucide-react';
import { ResearchCitation } from '../../types';

interface MarkdownRendererProps {
  content: string;
  citations?: ResearchCitation[];
  onSelectCitation?: (docId: string) => void;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  citations = [],
  onSelectCitation
}) => {
  return (
    <div className="prose prose-invert prose-sm max-w-none text-slate-200 leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-lg font-bold text-cyan-300 mt-3 mb-2 pb-1 border-b border-slate-800 flex items-center gap-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-semibold text-slate-100 mt-3 mb-1.5 flex items-center gap-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-semibold text-cyan-400 mt-2 mb-1">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mt-2 mb-1">
              {children}
            </h4>
          ),
          p: ({ children }) => <p className="mb-2 text-slate-300 text-xs sm:text-sm leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1 text-slate-300 text-xs sm:text-sm pl-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1 text-slate-300 text-xs sm:text-sm pl-1">{children}</ol>,
          li: ({ children }) => <li className="text-slate-300 text-xs sm:text-sm">{children}</li>,
          blockquote: ({ children }) => (
            <div className="bg-slate-900/80 border-l-4 border-cyan-500/70 px-3 py-2 my-2 rounded-r text-slate-300 text-xs italic">
              {children}
            </div>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 border border-slate-800 rounded-lg">
              <table className="min-w-full text-left text-xs divide-y divide-slate-800">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-slate-900 text-slate-300 font-semibold">{children}</thead>,
          tbody: ({ children }) => <tbody className="divide-y divide-slate-850 bg-slate-950/40">{children}</tbody>,
          tr: ({ children }) => <tr className="hover:bg-slate-900/50 transition-colors">{children}</tr>,
          th: ({ children }) => <th className="px-3 py-2 text-slate-300 font-mono text-[11px] uppercase tracking-wider">{children}</th>,
          td: ({ children }) => <td className="px-3 py-2 text-slate-300">{children}</td>,
          code: ({ children, className }) => {
            const isBlock = className && className.includes('language-');
            if (isBlock) {
              return (
                <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto my-2">
                  <code>{children}</code>
                </pre>
              );
            }
            return (
              <code className="bg-slate-900 text-cyan-300 px-1.5 py-0.5 rounded text-[11px] font-mono border border-slate-800">
                {children}
              </code>
            );
          },
          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 underline inline-flex items-center gap-0.5"
            >
              {children}
              <ExternalLink className="w-2.5 h-2.5 ml-0.5 inline" />
            </a>
          )
        }}
      >
        {content}
      </ReactMarkdown>

      {/* Render Citation Chips at bottom of message */}
      {citations && citations.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <BookCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified NASA Research References</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {citations.map((c, idx) => (
              <button
                key={`${c.docId}-${idx}`}
                onClick={() => onSelectCitation && onSelectCitation(c.docId)}
                className="group flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/30 hover:border-emerald-500/60 rounded px-2.5 py-1 text-left transition-all cursor-pointer"
                title={c.title}
              >
                <span className="font-mono text-[10px] text-emerald-400 font-bold">
                  [{c.ntrsId || `REF-${idx + 1}`}]
                </span>
                <span className="text-xs text-slate-300 group-hover:text-white truncate max-w-[240px]">
                  {c.title}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">({c.year})</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
