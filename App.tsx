import React, { useState } from 'react';
import { FileUploader } from './components/FileUploader';
import { UrlInput } from './components/UrlInput';
import { SummaryResult } from './components/SummaryResult';
import { Button } from './components/Button';
import { summarizePdf } from './services/gemini';
import { PdfFile } from './types';
import { FileText, Sparkles, Sliders, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<PdfFile | null>(null);
  const [percentage, setPercentage] = useState<number>(30);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: PdfFile) => {
    setSelectedFile(file);
    setSummary(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await summarizePdf(selectedFile.data, percentage);
      setSummary(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while generating the summary.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSummary(null);
    setError(null);
    setPercentage(30);
  };

  const getLengthLabel = (val: number) => {
    if (val <= 25) return "Concise";
    if (val <= 50) return "Balanced";
    if (val <= 75) return "Detailed";
    return "Comprehensive";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Briefly PDF
            </h1>
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Powered by Gemini
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Controls & Input */}
          <div className={`lg:col-span-5 flex flex-col gap-8 transition-all ${summary ? 'lg:col-span-4' : 'lg:col-start-4 lg:col-span-6'}`}>
            
            {/* Step 1: Input */}
            {!summary && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">1</span>
                  Upload Document
                </h2>
                
                {!selectedFile ? (
                  <div className="space-y-6">
                    <FileUploader onFileSelect={handleFileSelect} />
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-slate-500">Or import via URL</span>
                      </div>
                    </div>
                    <UrlInput onFileSelect={handleFileSelect} />
                  </div>
                ) : (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start justify-between animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <FileText className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 truncate pr-2">{selectedFile.name}</p>
                        <p className="text-xs text-slate-500">{selectedFile.source === 'URL' ? 'Imported from URL' : 'Uploaded locally'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedFile(null)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <span className="sr-only">Remove</span>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Configuration (Only shown if file selected) */}
            {selectedFile && !summary && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">2</span>
                  Summary Length
                </h2>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-end mb-2">
                     <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      {getLengthLabel(percentage)}
                     </span>
                     <span className="text-2xl font-bold text-slate-800">{percentage}%</span>
                  </div>
                  
                  <div className="relative h-6 flex items-center">
                    <input
                      type="range"
                      min="10"
                      max="90"
                      step="10"
                      value={percentage}
                      onChange={(e) => setPercentage(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
                    <span>Short (10%)</span>
                    <span>Full (90%)</span>
                  </div>

                  <div className="pt-4">
                    <Button 
                      onClick={handleGenerate} 
                      isLoading={isLoading} 
                      className="w-full py-3 text-lg shadow-lg shadow-indigo-200"
                    >
                      Summarize PDF
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 text-red-700 animate-in fade-in slide-in-from-bottom-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Sidebar Controls if Summary exists */}
            {summary && (
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                 <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Source File</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <FileText className="w-4 h-4" />
                      <span className="truncate">{selectedFile?.name}</span>
                    </div>
                 </div>

                 <div>
                    <label className="text-sm font-semibold text-slate-900 mb-2 block">
                      Adjust Length & Regenerate
                    </label>
                    <div className="flex items-center gap-4 mb-4">
                       <input
                        type="range"
                        min="10"
                        max="90"
                        step="10"
                        value={percentage}
                        onChange={(e) => setPercentage(Number(e.target.value))}
                        className="flex-grow h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <span className="text-sm font-bold text-slate-700 w-8">{percentage}%</span>
                    </div>
                    <Button 
                      onClick={handleGenerate} 
                      isLoading={isLoading}
                      variant="secondary" 
                      className="w-full"
                    >
                      Regenerate
                    </Button>
                 </div>

                 <div className="border-t border-slate-100 pt-4">
                   <button 
                    onClick={handleReset}
                    className="w-full text-center text-sm text-slate-500 hover:text-slate-800 transition-colors"
                   >
                     Upload different file
                   </button>
                 </div>
               </div>
            )}

          </div>

          {/* Right Column: Output */}
          {summary && (
            <div className="lg:col-span-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <SummaryResult 
                markdown={summary} 
                percentage={percentage} 
                onReset={handleReset} 
              />
            </div>
          )}

          {/* Empty State / Welcome (Only visible when no summary and user might be confused, or filling space) */}
          {!summary && !selectedFile && (
             <div className="lg:col-start-4 lg:col-span-6 mt-12 text-center text-slate-400">
                <p className="text-sm">
                  Supported formats: PDF (Text-based). <br/>
                  Ensure your document contains selectable text for best results.
                </p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
