'use client';

import { FileText, Download, Eye } from 'lucide-react';

interface PDFPreviewProps {
  isLoading?: boolean;
  fileName?: string;
  showPreview?: boolean;
}

export default function PDFPreview({ isLoading = false, fileName, showPreview = true }: PDFPreviewProps) {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-8 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">PDF Preview</h3>
        <div className="flex gap-2">
          {fileName && (
            <>
              <button className="p-2 hover:bg-[var(--background)] rounded-lg transition-colors text-[var(--accent-primary)] hover:text-white">
                <Eye size={20} />
              </button>
              <button className="p-2 hover:bg-[var(--background)] rounded-lg transition-colors text-[var(--accent-secondary)] hover:text-white">
                <Download size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-2 bg-[var(--card-bg)] rounded-full flex items-center justify-center">
              <FileText size={24} className="text-[var(--accent-primary)]" />
            </div>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">Generating preview...</p>
        </div>
      ) : fileName && showPreview ? (
        <div className="flex-1 bg-[var(--background)] rounded-lg border border-[var(--border-color)] flex items-center justify-center">
          <div className="text-center">
            <div className="bg-[var(--accent-primary)] bg-opacity-10 w-20 h-20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText size={40} className="text-[var(--accent-primary)]" />
            </div>
            <p className="text-sm text-white font-medium mb-1">Sample Certificate</p>
            <p className="text-xs text-[var(--text-secondary)]">{fileName}</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-[var(--background)] rounded-lg border-2 border-dashed border-[var(--border-color)] flex flex-col items-center justify-center gap-3">
          <FileText size={40} className="text-[var(--text-secondary)] opacity-50" />
          <p className="text-sm text-[var(--text-secondary)]">Upload CSV and template to generate preview</p>
        </div>
      )}
    </div>
  );
}
