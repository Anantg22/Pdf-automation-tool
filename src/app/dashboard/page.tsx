'use client';

import { useState } from 'react';
import StatCard from '@/components/StatCard';
import UploadZone from '@/components/UploadZone';
import PDFPreview from '@/components/PDFPreview';
import { FileText, Users, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  const [csvFile, setCSVFile] = useState<File | null>(null);
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCSVUpload = (file: File) => {
    setCSVFile(file);
    console.log('[v0] CSV uploaded:', file.name);
  };

  const handleTemplateUpload = (file: File) => {
    setTemplateFile(file);
    console.log('[v0] Template uploaded:', file.name);
  };

  const handleGenerate = async () => {
    if (!csvFile || !templateFile) {
      console.log('[v0] Missing CSV or template file');
      return;
    }
    
    setIsGenerating(true);
    // Simulate processing
    setTimeout(() => {
      setIsGenerating(false);
      console.log('[v0] Certificates generated');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--border-color)] bg-[var(--card-bg)] bg-opacity-40 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Certificate Generator</h1>
          <p className="text-[var(--text-secondary)] mt-1">Bulk create certificates in minutes</p>
        </div>
      </div>

      <div className="p-8">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Generated"
            value="2,847"
            change={12}
            icon={<FileText size={20} />}
          />
          <StatCard
            label="Processed Today"
            value="156"
            change={8}
            icon={<CheckCircle size={20} />}
          />
          <StatCard
            label="Queue Items"
            value="23"
            change={-5}
            icon={<Clock size={20} />}
          />
          <StatCard
            label="Active Users"
            value="12"
            change={2}
            icon={<Users size={20} />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Upload Sections */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* CSV Upload */}
            <UploadZone
              title="Upload CSV Data"
              description="Import your recipient data with names, emails, and any custom fields"
              acceptedFormats=".csv,.xlsx,.xls"
              onFileSelect={handleCSVUpload}
              fileName={csvFile?.name}
            />

            {/* Template Upload */}
            <UploadZone
              title="Upload Certificate Template"
              description="Design your certificate template as an HTML or image file"
              acceptedFormats=".html,.jpg,.png,.svg"
              onFileSelect={handleTemplateUpload}
              fileName={templateFile?.name}
            />

            {/* Action Button */}
            <button
              onClick={handleGenerate}
              disabled={!csvFile || !templateFile || isGenerating}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                csvFile && templateFile && !isGenerating
                  ? 'bg-[var(--accent-primary)] text-white hover:bg-opacity-90 active:scale-95'
                  : 'bg-[var(--border-color)] text-[var(--text-secondary)] cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating Certificates...
                </>
              ) : (
                <>
                  <FileText size={20} />
                  Generate Certificates
                </>
              )}
            </button>
          </div>

          {/* PDF Preview */}
          <div className="md:col-span-1">
            <PDFPreview
              isLoading={isGenerating}
              fileName={templateFile?.name}
              showPreview={!!templateFile}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Generations</h3>
          <div className="space-y-3">
            {[
              { id: 1, name: 'Summer Internship 2024', count: 145, time: '2 hours ago', status: 'Completed' },
              { id: 2, name: 'Workshop Participants', count: 89, time: '5 hours ago', status: 'Completed' },
              { id: 3, name: 'Employee Recognition', count: 342, time: '1 day ago', status: 'Completed' },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-[var(--background)] rounded-lg hover:border-l-2 hover:border-[var(--accent-primary)] transition-all">
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{item.count} certificates • {item.time}</p>
                </div>
                <span className="px-3 py-1 bg-[var(--accent-secondary)] bg-opacity-20 text-[var(--accent-secondary)] text-xs font-medium rounded">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
