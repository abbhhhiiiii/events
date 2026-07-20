"use client";

import React from "react";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import SingleImageUpload from "../SingleImageUpload";

// --- Types for JSON Structure ---
interface Role {
  designation: string;
  company: string;
}

interface SpeakerItem {
  name: string;
  image: string;
  description: string;
  roles: Role[];
}

interface SpeakerSection {
  title: string;
  speakers: SpeakerItem[];
}

interface SpeakersProps {
  data: any[];
  onChange: (data: any[]) => void;
}

export default function Speakers({ data = [], onChange }: SpeakersProps) {
  // Ensure the data is an array (JSON structure)
  const sections: SpeakerSection[] = Array.isArray(data)
    ? data.map((section: any) => ({
        title: section.title || "",
        speakers: section.speakers || [],
      }))
    : [];

  // ==========================================
  // SECTION HANDLERS
  // ==========================================
  const addSection = () => {
    onChange([...sections, { title: "", speakers: [] }]);
  };

  const updateSection = (index: number, value: string) => {
    const copy = [...sections];
    copy[index].title = value;
    onChange(copy);
  };

  const removeSection = (index: number) => {
    const copy = sections.filter((_, i) => i !== index);
    onChange(copy);
  };

  // ==========================================
  // SPEAKER HANDLERS
  // ==========================================
  const addSpeaker = (sectionIndex: number) => {
    const copy = [...sections];
    copy[sectionIndex].speakers.push({
      name: "",
      image: "",
      description: "",
      roles: [{ designation: "", company: "" }],
    });
    onChange(copy);
  };

  const updateSpeaker = (
    sIndex: number,
    spIndex: number,
    field: keyof SpeakerItem,
    value: string
  ) => {
    const copy = [...sections];
    copy[sIndex].speakers[spIndex] = {
      ...copy[sIndex].speakers[spIndex],
      [field]: value,
    };
    onChange(copy);
  };

  const removeSpeaker = (sIndex: number, spIndex: number) => {
    const copy = [...sections];
    copy[sIndex].speakers = copy[sIndex].speakers.filter(
      (_, i) => i !== spIndex
    );
    onChange(copy);
  };

  const moveSpeaker = (sIndex: number, index: number, dir: number) => {
    const newSections = [...sections];
    const newSpeakers = [...newSections[sIndex].speakers];
    const length = newSpeakers.length;

    if (length <= 1) return;

    const [movedItem] = newSpeakers.splice(index, 1);
    if (!movedItem) return;

    let newIndex: number;
    if (dir === -1) {
      newIndex = index === length - 1 ? 0 : index + 1; // Move Up
    } else {
      newIndex = index === 0 ? length - 1 : index - 1; // Move Down
    }

    newSpeakers.splice(newIndex, 0, movedItem);
    newSections[sIndex].speakers = newSpeakers;
    onChange(newSections);
  };

  // ==========================================
  // ROLE HANDLERS
  // ==========================================
  const addRole = (sIndex: number, spIndex: number) => {
    const copy = [...sections];
    copy[sIndex].speakers[spIndex].roles.push({ designation: "", company: "" });
    onChange(copy);
  };

  const updateRole = (
    sIndex: number,
    spIndex: number,
    rIndex: number,
    field: keyof Role,
    value: string
  ) => {
    const copy = [...sections];
    copy[sIndex].speakers[spIndex].roles[rIndex] = {
      ...copy[sIndex].speakers[spIndex].roles[rIndex],
      [field]: value,
    };
    onChange(copy);
  };

  const removeRole = (sIndex: number, spIndex: number, rIndex: number) => {
    const copy = [...sections];
    copy[sIndex].speakers[spIndex].roles = copy[sIndex].speakers[spIndex].roles.filter(
      (_, i) => i !== rIndex
    );
    onChange(copy);
  };

  return (
    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-3 gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            🎤 Speakers & Guests
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Group speakers by section and assign multiple roles.
          </p>
        </div>
        <button
          type="button"
          onClick={addSection}
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 shrink-0"
        >
          <Plus size={16} /> Add Speaker Section
        </button>
      </div>

      {sections.length === 0 && (
        <p className="text-sm text-slate-500 italic text-center py-6 bg-white rounded-lg border border-slate-200 border-dashed">
          No speaker sections added yet. Click the button above to add one.
        </p>
      )}

      {/* SECTIONS LOOP */}
      {[...sections]
        .map((section, index) => ({ ...section, originalIndex: index }))
        .reverse()
        .map((section) => {
          const sIndex = section.originalIndex;

          return (
            <div
              key={sIndex}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4"
            >
              {/* Section Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <input
                  value={section.title}
                  placeholder="e.g. Chief Guests / Panelists"
                  onChange={(e) => updateSection(sIndex, e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-1.5 rounded-md text-base font-semibold outline-none transition-all"
                />
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => addSpeaker(sIndex)}
                    className="bg-emerald-500 hover:bg-emerald-600 transition-colors text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Speaker
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSection(sIndex)}
                    className="bg-red-50 text-red-600 hover:bg-red-100 transition-colors px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Remove Section
                  </button>
                </div>
              </div>

              {/* Speakers List Loop */}
              <div className="space-y-3">
                {[...section.speakers]
                  .map((speaker, index) => ({ ...speaker, originalIndex: index }))
                  .reverse()
                  .map((speaker) => {
                    const spIndex = speaker.originalIndex;

                    return (
                      <div
                        key={spIndex}
                        className="relative flex flex-col sm:flex-row gap-4 border border-slate-200 bg-slate-50/50 rounded-lg p-4 group hover:border-blue-200 transition-colors"
                      >
                        {/* Hover Actions */}
                        <div className="absolute right-2 top-2 flex gap-1 bg-white border border-slate-200 rounded shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10">
                          <button
                            type="button"
                            onClick={() => moveSpeaker(sIndex, spIndex, -1)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            title="Move Up"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSpeaker(sIndex, spIndex, 1)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 border-l border-r border-slate-200"
                            title="Move Down"
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeSpeaker(sIndex, spIndex)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Remove Speaker"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {/* Image */}
                        <div className="w-24 shrink-0 pt-2 sm:pt-0">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 text-center">
                            Photo
                          </label>
                          <SingleImageUpload
                            value={speaker.image}
                            onChange={(url) => updateSpeaker(sIndex, spIndex, "image", url)}
                          />
                        </div>

                        {/* Fields */}
                        <div className="flex-1 space-y-3 mt-2 sm:mt-0">
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                              Speaker Name
                            </label>
                            <input
                              value={speaker.name}
                              placeholder="e.g. John Doe"
                              onChange={(e) => updateSpeaker(sIndex, spIndex, "name", e.target.value)}
                              className="w-full md:w-3/4 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-1.5 rounded-md text-sm outline-none bg-white transition-all shadow-sm"
                            />
                          </div>

                          {/* Multiple Roles */}
                          <div className="space-y-2">
                            <label className="block text-xs font-semibold text-slate-600">
                              Designations & Companies
                            </label>
                            {(speaker.roles || []).map((role, rIndex) => (
                              <div
                                key={rIndex}
                                className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center w-full md:w-3/4"
                              >
                                <input
                                  value={role.designation}
                                  placeholder="Designation"
                                  onChange={(e) => updateRole(sIndex, spIndex, rIndex, "designation", e.target.value)}
                                  className="border border-slate-200 focus:border-blue-500 px-3 py-1.5 rounded-md text-sm outline-none bg-white transition-all shadow-sm"
                                />
                                <input
                                  value={role.company}
                                  placeholder="Company"
                                  onChange={(e) => updateRole(sIndex, spIndex, rIndex, "company", e.target.value)}
                                  className="border border-slate-200 focus:border-blue-500 px-3 py-1.5 rounded-md text-sm outline-none bg-white transition-all shadow-sm"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeRole(sIndex, spIndex, rIndex)}
                                  className="text-slate-400 hover:text-red-500 p-1.5 transition-colors bg-white border border-slate-200 rounded-md hover:border-red-200 hover:bg-red-50 shadow-sm"
                                  title="Remove Role"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => addRole(sIndex, spIndex)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-semibold mt-1 transition-colors"
                          >
                            <Plus size={14} /> Add Another Role
                          </button>

                          {/* Bio */}
                          <div className="w-full mt-3">
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                              Speaker Description
                            </label>
                            <textarea
                              rows={3}
                              value={speaker.description || ""}
                              onChange={(e) => updateSpeaker(sIndex, spIndex, "description", e.target.value)}
                              placeholder="Write speaker profile..."
                              className="w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md px-3 py-2 text-sm outline-none resize-y bg-white shadow-sm transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
    </div>
  );
}