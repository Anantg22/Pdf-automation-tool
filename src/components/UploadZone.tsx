'use client';

import { Upload, X } from 'lucide-react';
import { useState, useRef } from 'react';

interface UploadZoneProps {
  title: string;
  description: string;
  acceptedFormats?: string;
  onFileSelect?: (file: File) => void;
  fileName?: string;
}

export default function UploadZone({
  title,
  description,
  acceptedFormats = '.csv,.xlsx,.xls',
  onFileSelect,
  fileName
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(fileName || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setUploadedFile(file.name);
      onFileSelect?.(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedFile(file.name);
      onFileSelect?.(file);
    }
  };

  const handleClear = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-8">
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] mb-6">{description}</p>

      {uploadedFile ? (
        <div className="bg-[var(--background)] border border-[var(--accent-secondary)] rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[var(--accent-secondary)] bg-opacity-20 p-2 rounded">
              <Upload size={20} className="text-[var(--accent-secondary)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{uploadedFile}</p>
              <p className="text-xs text-[var(--text-secondary)]">Ready for processing</p>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] bg-opacity-5'
              : 'border-[var(--border-color)] hover:border-[var(--accent-primary)]'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload
            size={32}
            className={`mx-auto mb-4 ${isDragging ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'}`}
          />
          <p className="text-white font-medium mb-1">Drag and drop your file here</p>
          <p className="text-xs text-[var(--text-secondary)] mb-4">or click to browse</p>
          <p className="text-xs text-[var(--text-secondary)]">Supported formats: {acceptedFormats}</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept={acceptedFormats}
        onChange={handleFileInput}
      />
    </div>
  );
}
