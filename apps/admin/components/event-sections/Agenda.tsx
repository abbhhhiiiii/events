"use client";

import React from "react";
import { Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";

interface AgendaSpeaker {
  name: string;
  timeFrom: string;
  timeTo: string;
  topic: string;
}

interface AgendaItem {
  timeFrom: string;
  timeTo: string;
  title: string;
  description: string;
  speakers: AgendaSpeaker[];
}

interface AgendaProps {
  data: any[];
  onChange: (data: any[]) => void;
  availableSpeakers?: any[];
}

export default function Agenda({
  data = [],
  onChange,
  availableSpeakers = [],
}: AgendaProps) {
  const items = Array.isArray(data) ? data : [];

  const speakersList = availableSpeakers.flatMap((section: any) => {
    // Speakers are nested in the current structure.
    if (section.speakers) {
      return section.speakers;
    }
    return section;
  });

 
  const addItem = () => {
    onChange([
      ...items,
      { timeFrom: "", timeTo: "", title: "", description: "", speakers: [] },
    ]);
  };

  const updateItem = (index: number, field: keyof AgendaItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  const moveItem = (index: number, dir: number) => {
    const copy = [...items];
    const length = copy.length;
    if (length <= 1) return;

    const [movedItem] = copy.splice(index, 1);
    if (!movedItem) return;

    let newIndex: number;
    if (dir === -1) {
      // Move Up
      newIndex = index === 0 ? length - 1 : index - 1;
    } else {
      // Move Down
      newIndex = index === length - 1 ? 0 : index + 1;
    }

    copy.splice(newIndex, 0, movedItem);
    onChange(copy);
  };

  // ==========================================
  // NESTED SPEAKER HANDLERS
  // ==========================================
  const addSpeaker = (itemIndex: number) => {
    const updated = [...items];
    if (!updated[itemIndex].speakers) updated[itemIndex].speakers = [];
    
    updated[itemIndex].speakers.push({
      name: "",
      timeFrom: "",
      timeTo: "",
      topic: "",
    });
    onChange(updated);
  };

  const updateSpeaker = (
    itemIndex: number,
    speakerIndex: number,
    field: keyof AgendaSpeaker,
    value: string
  ) => {
    const updated = [...items];
    updated[itemIndex].speakers[speakerIndex] = {
      ...updated[itemIndex].speakers[speakerIndex],
      [field]: value,
    };
    onChange(updated);
  };

const removeSpeaker = (itemIndex: number, speakerIndex: number) => {
    const updated = [...items];
    updated[itemIndex].speakers = updated[itemIndex].speakers.filter(
      (_: any, i: number) => i !== speakerIndex
    );
    onChange(updated);
  };

  return (
    <div className="p-4 border border-emerald-200 bg-emerald-50/30 rounded-xl space-y-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-emerald-200 pb-3 gap-3">
        <div>
          <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
            ⏰ Event Agenda
          </h3>
          <p className="text-xs text-emerald-600/80 mt-0.5">
            Add timeline sessions and assign speakers to them.
          </p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-1 shrink-0"
        >
          <Plus size={16} /> Add Session
        </button>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-emerald-600/60 italic text-center py-6 bg-white rounded-lg border border-emerald-200 border-dashed">
          No agenda sessions added yet. Click the button above to add one.
        </p>
      )}

      {/* Agenda Items List */}
      <div className="space-y-4">
        {items.map((item: AgendaItem, index: number) => (
          <div
            key={index}
            className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4 relative group hover:border-emerald-300 transition-colors"
          >
            {/* Top Right Controls (Hover to show) */}
            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-10 bg-white rounded shadow-sm border border-slate-200">
              <button
                type="button"
                onClick={() => moveItem(index, -1)}
                className="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-l-md transition-colors"
                title="Move Up"
              >
                <ArrowUp size={16} />
              </button>
              <button
                type="button"
                onClick={() => moveItem(index, 1)}
                className="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 p-1.5 border-l border-r border-slate-200 transition-colors"
                title="Move Down"
              >
                <ArrowDown size={16} />
              </button>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-r-md transition-colors"
                title="Remove Session"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Row 1: Times & Title */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_2fr] gap-4 pt-3 sm:pt-0">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  From Time
                </label>
                <input
                  type="time"
                  value={item.timeFrom}
                  onChange={(e) => updateItem(index, "timeFrom", e.target.value)}
                  className="w-full border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-md px-3 py-2 text-sm outline-none transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  To Time
                </label>
                <input
                  type="time"
                  value={item.timeTo}
                  onChange={(e) => updateItem(index, "timeTo", e.target.value)}
                  className="w-full border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-md px-3 py-2 text-sm outline-none transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Session Title
                </label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(index, "title", e.target.value)}
                  className="w-full border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-md px-3 py-2 text-sm outline-none transition-all shadow-sm"
                  placeholder="e.g. Opening Keynote"
                />
              </div>
            </div>

            {/* Row 2: Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Description (optional)
              </label>
              <textarea
                value={item.description}
                onChange={(e) => updateItem(index, "description", e.target.value)}
                className="w-full border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-md px-3 py-2 text-sm outline-none transition-all resize-y shadow-sm"
                placeholder="Brief details about the session..."
                rows={2}
              />
            </div>

            {/* Row 3: Nested Speakers */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-xs font-semibold text-slate-600">
                  Session Speakers (optional)
                </label>
                <button
                  type="button"
                  onClick={() => addSpeaker(index)}
                  className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1"
                >
                  <Plus size={14} /> Add Speaker
                </button>
              </div>

              {item.speakers?.length > 0 && (
                <div className="space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {item.speakers.map(
                    (speaker: AgendaSpeaker, speakerIndex: number) => (
                      <div
                        key={speakerIndex}
                        className="flex flex-col lg:flex-row gap-3 items-start lg:items-center bg-white border border-slate-200 rounded-md p-3 shadow-sm"
                      >
                        {/* Speaker Dropdown */}
                        <div className="w-full lg:w-auto flex-1">
                          <label className="block lg:hidden text-[10px] font-bold text-slate-400 mb-1 uppercase">Select Speaker</label>
                          <select
                            value={speaker.name}
                            onChange={(e) =>
                              updateSpeaker(index, speakerIndex, "name", e.target.value)
                            }
                            className="w-full border border-slate-200 focus:border-emerald-500 rounded-md px-2 py-2 text-sm outline-none bg-white shadow-sm"
                          >
                            <option value="">-- Select Speaker --</option>
                            {speakersList.map((sp: any, spIndex: number) => (
                              <option key={`${sp.name}-${spIndex}`} value={sp.name}>
                                {sp.name}
                                {sp.roles?.length > 0 &&
                                  " - " +
                                  sp.roles
                                    .map(
                                      (role: any) =>
                                        `${role.designation}${
                                          role.company ? ` | ${role.company}` : ""
                                        }`
                                    )
                                    .join(" , ")}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Speaker Topic */}
                        <div className="w-full lg:w-auto flex-1">
                          <label className="block lg:hidden text-[10px] font-bold text-slate-400 mb-1 uppercase">Topic</label>
                          <input
                            type="text"
                            value={speaker.topic || ""}
                            onChange={(e) =>
                              updateSpeaker(index, speakerIndex, "topic", e.target.value)
                            }
                            placeholder="Speaker Topic (optional)"
                            className="w-full border border-slate-200 focus:border-emerald-500 rounded-md px-3 py-2 text-sm outline-none shadow-sm"
                          />
                        </div>

                        {/* Specific Times & Delete */}
                        <div className="flex gap-2 w-full lg:w-auto items-center shrink-0">
                          <input
                            type="time"
                            value={speaker.timeFrom}
                            onChange={(e) =>
                              updateSpeaker(index, speakerIndex, "timeFrom", e.target.value)
                            }
                            title="Speaker Start Time"
                            className="w-24 border border-slate-200 focus:border-emerald-500 rounded-md px-2 py-2 text-sm outline-none shadow-sm"
                          />
                          <span className="text-slate-400 text-xs">-</span>
                          <input
                            type="time"
                            value={speaker.timeTo}
                            onChange={(e) =>
                              updateSpeaker(index, speakerIndex, "timeTo", e.target.value)
                            }
                            title="Speaker End Time"
                            className="w-24 border border-slate-200 focus:border-emerald-500 rounded-md px-2 py-2 text-sm outline-none shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeSpeaker(index, speakerIndex)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors ml-1 border border-transparent hover:border-red-100"
                            title="Remove Speaker"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
