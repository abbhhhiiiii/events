"use client";

import React from "react";
import { Info as InfoIcon } from "lucide-react";
import RichTextEditor from "../RichTextEditor";

interface SectionProps {
  data: any;
  onChange: (data: any) => void;
}

export default function Info({ data, onChange }: SectionProps) {
  // Safely handle legacy arrays, plain strings, and the current object format.
  let content = "";
  
  if (typeof data === "string") {
    content = data;
  } else if (Array.isArray(data)) {
    if (data.length > 0) {
      content = `<ul class="list-disc pl-5">` + data.map(item => `<li>${item}</li>`).join("") + `</ul>`;
    }
  } else if (data && typeof data === "object") {

    content = data.content || "";
  }

  const handleContentChange = (val: string) => {

    onChange({ content: val });
  };

  return (
    <div className="p-4 sm:p-6 border border-blue-200 bg-blue-50/30 rounded-xl space-y-5 shadow-sm">
      
      {/* Header Section */}
      <div className="border-b border-blue-200 pb-3">
        <h3 className="text-lg font-bold text-blue-800 flex items-center gap-2">
          <InfoIcon size={20} className="text-blue-600" /> Event Information
        </h3>
        <p className="text-xs text-blue-600/80 mt-1">
          Add any additional details, rules, guidelines, or instructions here.
        </p>
      </div>

      {/* Rich Text Editor Input */}
      <div>
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all shadow-sm">
          <RichTextEditor
            value={content}
            onChange={handleContentChange}
            placeholder="e.g. Dress code, parking instructions, entry rules, or event policies..."
          />
        </div>
      </div>
      
    </div>
  );
}
