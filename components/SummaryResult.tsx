import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, Copy, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface SummaryResultProps {
  markdown: string;
  percentage: number;
  onReset: () => void;
}

export const SummaryResult: React.FC<SummaryResultProps> = ({ markdown, percentage, onReset }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary-${percentage}percent.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full max-h-[800px]">
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h2 className="font-semibold text-slate-800">Generated Summary (~{percentage}%)</h2>
        <div className="flex gap-2">
           <button 
            onClick={handleCopy}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
            title="Copy to clipboard"
          >
            <Copy size={18} />
          </button>
          <button 
            onClick={handleDownload}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
            title="Download Markdown"
          >
            <Download size={18} />
          </button>
          <button 
            onClick={onReset}
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
            title="Start Over"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>
      
      <div className="p-8 overflow-y-auto markdown-content prose prose-slate max-w-none">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
};
