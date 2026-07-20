"use client";

import React from "react";
import RichTextEditor from "../RichTextEditor";
import DocumentUpload from "../DocumentUpload";

interface SectionProps {
  data: any;
  onChange: (data: any) => void;
}

export default function MediaKit({ data, onChange }: SectionProps) {
  // Safe default structure with backward compatibility for old data format
  const currentData = data || {};
  
  // Agar purana 'description' tha toh usko 'content' me daal do
  const content = currentData.content ?? currentData.description ?? "";
  
  // Agar purana 'files' array tha toh uski pehli file ka URL utha lo
  const brochureUrl = currentData.brochureUrl ?? (currentData.files?.[0]?.url) ?? "";

  const handleEditorChange = (val: string) => {
    onChange({ ...currentData, content: val });
  };

  const handleBrochureChange = (url: string) => {
    onChange({ ...currentData, brochureUrl: url });
  };

  return (
    <div className="p-6 border border-purple-200 bg-purple-50/50 rounded-xl space-y-8">
      <div className="border-b border-purple-200 pb-2">
        <h3 className="text-xl font-bold text-purple-800">
          Media Kit & Brochure
        </h3>
        <p className="text-sm text-gray-600">
          Add introductory text and upload a downloadable brochure.
        </p>
      </div>

      {/* PART 1: Text Section */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Introduction Text
        </label>
        <div className="bg-white rounded-lg overflow-hidden border border-slate-200 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
          <RichTextEditor
            value={content}
            onChange={handleEditorChange}
            placeholder="Download our official media kit and brochure to know more..."
        
          />
        </div>
      </div>

      {/* PART 2: File Upload Section */}
      <div className="space-y-2 pt-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700">
          Official Brochure (PDF)
        </label>
        <p className="text-xs text-gray-400 mb-3">
          This file will be available for users to download.
        </p>
        <DocumentUpload
          value={brochureUrl}
          onChange={handleBrochureChange}
        />
      </div>
    </div>
  );
}