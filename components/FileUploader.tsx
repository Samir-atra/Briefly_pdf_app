import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import { fileToBase64 } from '../utils';
import { PdfFile, FileSource } from '../types';

interface FileUploaderProps {
  onFileSelect: (file: PdfFile) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    if (file && file.type === 'application/pdf') {
      try {
        const base64 = await fileToBase64(file);
        onFileSelect({
          name: file.name,
          data: base64,
          source: FileSource.UPLOAD
        });
      } catch (error) {
        console.error("Error reading file", error);
        alert("Failed to read file.");
      }
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
    }
  };

  return (
    <div
      className={`relative group border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-50' 
          : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf"
        onChange={handleFileInput}
      />
      
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`p-4 rounded-full bg-slate-100 group-hover:bg-white transition-colors`}>
          <UploadCloud className={`w-8 h-8 ${isDragging ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`} />
        </div>
        <div>
          <p className="text-lg font-medium text-slate-700">
            Click to upload or drag and drop
          </p>
          <p className="text-sm text-slate-500 mt-1">
            PDF files only (max 20MB)
          </p>
        </div>
      </div>
    </div>
  );
};
