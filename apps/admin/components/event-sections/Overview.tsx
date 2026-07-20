"use client";

import React from "react";
import { Plus, Trash2, FileText, LayoutTemplate, Video, Image as ImageIcon } from "lucide-react";
import RichTextEditor from "../RichTextEditor";
import MultiImageUpload from "../MultiImageUpload";
import SingleImageUpload from "../SingleImageUpload";
import MultiVideoUpload from "../MultiVideoUpload";

// --- Types ---
interface FeatureBlock {
  image: string;
  content: string;
}

interface HighlightBlock {
  id: string;
  title: string;
  content: string;
}

interface SponsoredVideo {
  videoUrl: string;
  companyName: string;
  websiteLink: string;
}

interface SectionProps {
  data: any;
  onChange: (data: any) => void;
}

export default function Overview({ data, onChange }: SectionProps) {
  // Safe default structure with backward compatibility (reads 'content' if 'mainDescription' is missing)
  const currentData = data || {};
  const mainDescription = currentData.mainDescription || currentData.content || "";
  const highlightBlocks: HighlightBlock[] = currentData.highlightBlocks || [];
  const featureBlocks: FeatureBlock[] = currentData.featureBlocks || [];
  const sponsoredVideos = currentData.sponsoredVideos || [];
  const gallery = currentData.gallery || [];
  const videoGallery = currentData.videoGallery || [];
  const heading = currentData.heading || "";


  const updateMain = (field: string, value: any) => {
    onChange({ ...currentData, [field]: value });
  };

  // --- Highlights ---
  const addHighlightBlock = () => {
    const newBlock = { id: crypto.randomUUID(), title: "", content: "" };
    onChange({ ...currentData, highlightBlocks: [...highlightBlocks, newBlock] });
  };

  const updateHighlightBlock = (index: number, field: keyof HighlightBlock, value: string) => {
    const updated = highlightBlocks.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange({ ...currentData, highlightBlocks: updated });
  };

  const removeHighlightBlock = (index: number) => {
    const updated = highlightBlocks.filter((_, i) => i !== index);
    onChange({ ...currentData, highlightBlocks: updated });
  };

  // --- Feature Blocks ---
  const addFeatureBlock = () => {
    const newBlocks = [...featureBlocks, { image: "", content: "" }];
    onChange({ ...currentData, featureBlocks: newBlocks });
  };

  const updateFeatureBlock = (index: number, field: keyof FeatureBlock, value: string) => {
    const updated = [...featureBlocks];
    updated[index][field] = value;
    onChange({ ...currentData, featureBlocks: updated });
  };

  const removeFeatureBlock = (index: number) => {
    const updated = featureBlocks.filter((_, i) => i !== index);
    onChange({ ...currentData, featureBlocks: updated });
  };

  // --- Sponsored Videos ---
  const handleSponsoredVideosChange = (urls: string[]) => {
    const updated = urls.map((url) => {
      const existing = sponsoredVideos.find((v: any) => (v.videoUrl || v) === url);
      return existing || { videoUrl: url, companyName: "", websiteLink: "" };
    });
    onChange({ ...currentData, sponsoredVideos: updated });
  };

  const updateSponsoredVideo = (index: number, field: keyof SponsoredVideo, value: string) => {
    const updated = [...sponsoredVideos];
    if (typeof updated[index] === "string") {
      updated[index] = { videoUrl: updated[index], companyName: "", websiteLink: "" };
    }
    updated[index][field] = value;
    onChange({ ...currentData, sponsoredVideos: updated });
  };

  return (
    <div className="p-4 sm:p-6 border border-blue-200 bg-blue-50/20 rounded-xl space-y-10">
      

      <div className="space-y-4">
        <div className="border-b border-blue-200 pb-3">
          <h3 className="text-lg font-bold text-blue-800 flex items-center gap-2">
            <FileText size={20} /> 1. Main Event Description
          </h3>
          <p className="text-xs text-blue-600 mt-1">The primary introduction and heading of your event.</p>
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Custom Heading (Optional)</label>
          <input
            type="text"
            value={heading}
            onChange={(e) => updateMain("heading", e.target.value)}
            className="w-full max-w-md border border-slate-200 focus:border-blue-500 rounded-md px-3 py-2 text-sm outline-none bg-white shadow-sm"
            placeholder="Leaves blank to use the Event Name"
          />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Introduction Text</label>
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <RichTextEditor 
              value={mainDescription} 
              onChange={(val) => updateMain("mainDescription", val)} 
              placeholder="Write the event introduction here..." 
            />
          </div>
        </div>
      </div>

      <hr className="border-blue-100" />


      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-lg font-bold text-blue-800 flex items-center gap-2">
              <LayoutTemplate size={20} /> 2. Highlight Sections
            </h3>
            <p className="text-xs text-slate-500 mt-1">Add custom headings with rich content.</p>
          </div>
          <button 
            type="button" 
            onClick={addHighlightBlock} 
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-sm"
          >
            <Plus size={16} /> Add Highlight
          </button>
        </div>

        {highlightBlocks.length === 0 && (
          <p className="text-sm text-slate-400 italic py-4">No highlights added yet.</p>
        )}

        <div className="grid grid-cols-1 gap-4">
          {highlightBlocks.map((item, index) => (
            <div key={item.id || index} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group transition-all hover:border-blue-300">
              <button 
                type="button" 
                onClick={() => removeHighlightBlock(index)} 
                className="absolute right-3 top-3 text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                title="Remove Highlight"
              >
                <Trash2 size={16} />
              </button>
              
              <div className="pr-10 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Heading</label>
                  <input
                    value={item.title}
                    onChange={(e) => updateHighlightBlock(index, "title", e.target.value)}
                    className="w-full md:w-1/2 border border-slate-200 focus:border-blue-500 rounded-md px-3 py-2 text-sm outline-none"
                    placeholder="e.g. Event Highlights or Key Takeaways"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Content</label>
                  <div className="border border-slate-200 rounded-lg overflow-hidden focus-within:border-blue-500">
                    <RichTextEditor 
                      value={item.content} 
                      onChange={(val) => updateHighlightBlock(index, "content", val)} 
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-blue-100" />
      

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-lg font-bold text-blue-800 flex items-center gap-2">
              <ImageIcon size={20} /> 3. Content Blocks
            </h3>
            <p className="text-xs text-slate-500 mt-1">Image on top, bullet points or paragraphs below it.</p>
          </div>
          <button 
            type="button" 
            onClick={addFeatureBlock} 
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-sm"
          >
            <Plus size={16} /> Add New Block
          </button>
        </div>

        {featureBlocks.length === 0 && (
          <p className="text-sm text-slate-400 italic py-4">No content blocks added yet.</p>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {featureBlocks.map((block, index) => (
            <div key={index} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm relative group hover:border-blue-300 transition-all flex flex-col h-full">
              <button 
                type="button" 
                onClick={() => removeFeatureBlock(index)} 
                className="absolute top-3 right-3 text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors z-10"
                title="Remove Block"
              >
                <Trash2 size={16} />
              </button>

              <div className="space-y-4 flex-1 flex flex-col">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Block Image</label>
                  <SingleImageUpload value={block.image} onChange={(url) => updateFeatureBlock(index, "image", url)} />
                </div>
                <div className="flex-1 flex flex-col">
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Block Content</label>
                  <div className="flex-1 border border-slate-200 rounded-lg overflow-hidden focus-within:border-blue-500">
                    <RichTextEditor 
                      value={block.content} 
                      onChange={(val) => updateFeatureBlock(index, "content", val)} 
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-blue-100" />


      <div className="space-y-5 bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-blue-800 flex items-center gap-2">
            <Video size={20} /> 4. Sponsored Videos
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Upload promotional or sponsored videos and add company details.
          </p>
        </div>
        
        <MultiVideoUpload
          value={sponsoredVideos.map((v: any) => (typeof v === "string" ? v : v.videoUrl))}
          onChange={handleSponsoredVideosChange}
        />

        {sponsoredVideos.length > 0 && (
          <div className="space-y-3 mt-4">
            {sponsoredVideos.map((video: any, index: number) => {
              const videoUrl = typeof video === "string" ? video : video.videoUrl;
              return (
                <div key={index} className="flex flex-col sm:flex-row gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="w-full sm:w-32 h-20 shrink-0 bg-black rounded-lg overflow-hidden border border-slate-300">
                    <video src={videoUrl} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Company Name</label>
                      <input
                        type="text"
                        placeholder="e.g., Tech Corp"
                        value={video.companyName || ""}
                        onChange={(e) => updateSponsoredVideo(index, "companyName", e.target.value)}
                        className="w-full border border-slate-200 focus:border-blue-500 rounded-md px-3 py-2 text-sm outline-none bg-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Website Link</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={video.websiteLink || ""}
                        onChange={(e) => updateSponsoredVideo(index, "websiteLink", e.target.value)}
                        className="w-full border border-slate-200 focus:border-blue-500 rounded-md px-3 py-2 text-sm outline-none bg-white shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-5 bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-blue-800 flex items-center gap-2">
            <ImageIcon size={20} /> 5. Event Gallery
          </h3>
          <p className="text-xs text-slate-500 mt-1">Upload images and videos that will scroll horizontally at the bottom.</p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-2">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700 border-b border-slate-100 pb-2">Images</label>
            <MultiImageUpload value={gallery} onChange={(urls) => updateMain("gallery", urls)} />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700 border-b border-slate-100 pb-2">Videos</label>
            <MultiVideoUpload value={videoGallery} onChange={(urls) => updateMain("videoGallery", urls)} />
          </div>
        </div>
      </div>

    </div>
  );
}