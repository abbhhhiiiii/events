"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import RichTextEditor from "../RichTextEditor";

interface SectionProps {
  data: any;
  onChange: (data: any) => void;
}

export default function ContactUs({ data, onChange }: SectionProps) {
  // Safe parsing: Agar data string hai toh wahi use karo, warna object se 'content' nikal lo
  const content = typeof data === "string" ? data : (data?.content || "");

  const handleContentChange = (val: string) => {
    // Purane data format (email, phone) ko safe rakhne ke liye object merge kar rahe hain
    const newData = typeof data === "object" && data !== null ? { ...data } : {};
    newData.content = val;
    onChange(newData);
  };

  return (
    <div className="p-4 sm:p-6 border border-blue-200 bg-blue-50/30 rounded-xl space-y-5 shadow-sm">
      
      {/* Header Section */}
      <div className="border-b border-blue-200 pb-3">
        <h3 className="text-lg font-bold text-blue-800 flex items-center gap-2">
          📞 Contact Information
        </h3>
        <p className="text-xs text-blue-600/80 mt-1">
          Provide contact details, support hours, or links for inquiries.
        </p>
      </div>

      {/* Single Rich Text Editor */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-2">
          <MessageSquare size={14} className="text-slate-400" /> Contact Details
        </label>
        
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all shadow-sm">
          <RichTextEditor
            value={content}
            onChange={handleContentChange}
            placeholder="e.g. Email: contact@event.com, Phone: +91 1234567890..."
          />
        </div>
      </div>

    </div>
  );
}