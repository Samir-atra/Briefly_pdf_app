import React, { useState } from 'react';
import { Link, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { fetchPdfFromUrl } from '../utils';
import { PdfFile, FileSource } from '../types';

interface UrlInputProps {
  onFileSelect: (file: PdfFile) => void;
}

export const UrlInput: React.FC<UrlInputProps> = ({ onFileSelect }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setError(null);

    try {
      const { name, data } = await fetchPdfFromUrl(url);
      onFileSelect({
        name,
        data,
        source: FileSource.URL
      });
      setUrl('');
    } catch (err: any) {
      setError(err.message || "Failed to fetch PDF from URL");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Link className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a link to a PDF..."
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <Button 
          type="submit" 
          disabled={!url || isLoading}
          variant="secondary"
          isLoading={isLoading}
        >
          Fetch
        </Button>
      </form>
      {error && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
