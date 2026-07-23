"use client";

import React from "react";
import SingleImageUpload from "../SingleImageUpload";
import { Trash2, ArrowUp, ArrowDown, Plus, X } from "lucide-react";

// --- Types for JSON Structure ---
interface SponsorItem {
  name: string;
  logo: string;
  website: string; // Use the backend-compatible website field instead of websiteUrl.
}

interface SponsorSection {
  sectionTitle: string;
  sponsors: SponsorItem[];
}

interface SponsorsManagerProps {
  data: any[];
  onChange: (data: any[]) => void;
}

export default function Sponsors({ data = [], onChange }: SponsorsManagerProps) {
  // Ensure the data is an array of sections (Nested JSON structure)
  const sections: SponsorSection[] = Array.isArray(data)
    ? data.map((section: any) => ({
        sectionTitle: section.sectionTitle || section.title || "", // 'title' fallback for older data
        sponsors: section.sponsors || [],
      }))
    : [];

  // ==========================================
  // SECTION HANDLERS
  // ==========================================
  const addSection = () => {
    onChange([{ sectionTitle: "", sponsors: [] }, ...sections]);
  };

  const updateSectionTitle = (index: number, newTitle: string) => {
    const updatedSections = [...sections];
    updatedSections[index].sectionTitle = newTitle;
    onChange(updatedSections);
  };

  const removeSection = (index: number) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    onChange(updatedSections);
  };

  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    const updatedSections = [...sections];
    const temp = updatedSections[index - 1];
    updatedSections[index - 1] = updatedSections[index];
    updatedSections[index] = temp;
    onChange(updatedSections);
  };

  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return;
    const updatedSections = [...sections];
    const temp = updatedSections[index + 1];
    updatedSections[index + 1] = updatedSections[index];
    updatedSections[index] = temp;
    onChange(updatedSections);
  };

  // ==========================================
  // SPONSOR HANDLERS (Inside a Section)
  // ==========================================
  const addSponsor = (sectionIndex: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].sponsors = [
      { name: "", logo: "", website: "" },
      ...updatedSections[sectionIndex].sponsors,
    ];
    onChange(updatedSections);
  };

  const updateSponsor = (
    sectionIndex: number,
    sponsorIndex: number,
    field: keyof SponsorItem,
    value: string
  ) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].sponsors[sponsorIndex] = {
      ...updatedSections[sectionIndex].sponsors[sponsorIndex],
      [field]: value,
    };
    onChange(updatedSections);
  };

  const removeSponsor = (sectionIndex: number, sponsorIndex: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].sponsors = updatedSections[
      sectionIndex
    ].sponsors.filter((_, i) => i !== sponsorIndex);
    onChange(updatedSections);
  };

  const moveSponsorUp = (sectionIndex: number, sponsorIndex: number) => {
    if (sponsorIndex === 0) return;
    const updatedSections = [...sections];
    const sponsorsArray = [...updatedSections[sectionIndex].sponsors];
    const temp = sponsorsArray[sponsorIndex - 1];
    sponsorsArray[sponsorIndex - 1] = sponsorsArray[sponsorIndex];
    sponsorsArray[sponsorIndex] = temp;
    updatedSections[sectionIndex].sponsors = sponsorsArray;
    onChange(updatedSections);
  };

  const moveSponsorDown = (sectionIndex: number, sponsorIndex: number) => {
    const updatedSections = [...sections];
    const sponsorsArray = [...updatedSections[sectionIndex].sponsors];
    if (sponsorIndex === sponsorsArray.length - 1) return;
    
    const temp = sponsorsArray[sponsorIndex + 1];
    sponsorsArray[sponsorIndex + 1] = sponsorsArray[sponsorIndex];
    sponsorsArray[sponsorIndex] = temp;
    updatedSections[sectionIndex].sponsors = sponsorsArray;
    onChange(updatedSections);
  };

  return (
    <div className="space-y-6">
      {/* Top Level Button & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-3 gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            🤝 Sponsors & Partners
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Group sponsors by tiers (e.g., Platinum, Gold, Partners).
          </p>
        </div>
        <button
          type="button"
          onClick={addSection}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-1 shrink-0"
        >
          <Plus size={16} /> Add Sponsor Section
        </button>
      </div>

      {sections.length === 0 && (
        <p className="text-sm text-slate-400 italic text-center py-6 border border-dashed border-slate-300 rounded-xl bg-slate-50/50">
          No sponsor sections added yet. Click the button above to begin.
        </p>
      )}

      {/* Render all sections */}
      <div className="space-y-6">
        {sections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="p-4 border border-slate-200 bg-slate-50/50 rounded-xl space-y-4 shadow-sm"
          >
            {/* SECTION HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-4">
              <input
                type="text"
                value={section.sectionTitle}
                onChange={(e) => updateSectionTitle(sectionIndex, e.target.value)}
                placeholder="e.g. Platinum Sponsors"
                className="w-full max-w-[250px] sm:max-w-xs border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-md px-3 py-2 text-sm font-medium outline-none transition-all text-slate-700 bg-white"
              />

              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                {/* Section Up/Down Controls */}
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-1 py-1 mr-1">
                  <button
                    type="button"
                    onClick={() => moveSectionUp(sectionIndex)}
                    disabled={sectionIndex === 0}
                    className="text-slate-500 hover:text-blue-600 p-1 rounded hover:bg-blue-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                    title="Move Section Up"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <div className="w-px h-4 bg-slate-200 mx-0.5"></div>
                  <button
                    type="button"
                    onClick={() => moveSectionDown(sectionIndex)}
                    disabled={sectionIndex === sections.length - 1}
                    className="text-slate-500 hover:text-blue-600 p-1 rounded hover:bg-blue-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                    title="Move Section Down"
                  >
                    <ArrowDown size={16} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => addSponsor(sectionIndex)}
                  className="bg-[#10B981] text-white px-3 py-2 rounded-md text-sm font-semibold shadow-sm hover:bg-[#059669] transition-colors flex items-center gap-1"
                >
                  <Plus size={16} /> Add Sponsor
                </button>
                <button
                  type="button"
                  onClick={() => removeSection(sectionIndex)}
                  className="bg-red-50 text-red-600 px-3 py-2 rounded-md text-sm font-semibold shadow-sm hover:bg-red-100 transition-colors flex items-center gap-1"
                >
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            </div>

            {section.sponsors.length === 0 && (
              <p className="text-sm text-slate-400 italic text-center py-4">
                No items added yet. Click "+ Add Sponsor" to begin.
              </p>
            )}

            {/* SPONSORS LIST (Inside Section) */}
            <div className="space-y-3">
              {section.sponsors.map((sponsor: SponsorItem, sponsorIndex: number) => (
                <div
                  key={sponsorIndex}
                  className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm relative group hover:border-slate-300 transition-all duration-200"
                >
                  {/* Top Right Controls for Individual Sponsor */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => moveSponsorUp(sectionIndex, sponsorIndex)}
                      disabled={sponsorIndex === 0}
                      className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-md disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                      title="Move Up"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSponsorDown(sectionIndex, sponsorIndex)}
                      disabled={sponsorIndex === section.sponsors.length - 1}
                      className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-md disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                      title="Move Down"
                    >
                      <ArrowDown size={16} />
                    </button>
                    <div className="w-px h-4 bg-slate-200 mx-1"></div>
                    <button
                      type="button"
                      onClick={() => removeSponsor(sectionIndex, sponsorIndex)}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Card Layout */}
                  <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start pt-3">
                    <div className="w-28 shrink-0 flex flex-col items-center sm:items-start">
                      {/* Image Upload Area */}
                      <div className="w-28 h-24 bg-slate-50 border mt-2 sm:mt-6 border-slate-200 rounded-lg overflow-hidden shadow-inner flex items-center justify-center relative group/image">
                        <SingleImageUpload
                          value={sponsor.logo}
                          onChange={(url) =>
                            updateSponsor(sectionIndex, sponsorIndex, "logo", url)
                          }
                        />

                        {/* Floating 'X' Button to remove image */}
                        {sponsor.logo && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              updateSponsor(sectionIndex, sponsorIndex, "logo", "");
                            }}
                            className="absolute top-0 right-0 bg-white/90 backdrop-blur-sm border-l border-b border-slate-200 p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors z-10 rounded-bl-lg shadow-sm"
                            title="Remove Image"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 w-full flex flex-col gap-3 justify-center sm:pt-4">
                      <div>
                        <label className="block text-[12px] font-semibold text-slate-600 mb-1">
                          Company Name <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={sponsor.name}
                          onChange={(e) =>
                            updateSponsor(sectionIndex, sponsorIndex, "name", e.target.value)
                          }
                          placeholder="e.g. Acme Corp"
                          className="w-full max-w-md border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-md px-3 py-1.5 text-sm outline-none transition-all bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[12px] font-semibold text-slate-600 mb-1">
                          Website URL <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="url"
                          value={sponsor.website}
                          onChange={(e) =>
                            updateSponsor(sectionIndex, sponsorIndex, "website", e.target.value)
                          }
                          placeholder="https://..."
                          className="w-full max-w-md border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-md px-3 py-1.5 text-sm outline-none transition-all bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
