"use client";

import React from "react";
import RichTextEditor from "../RichTextEditor";

// --- Types for JSON Structure ---
interface VenueData {
  name: string;
  address: string;
  mapUrl: string;
  notes: string; // Purane data structure ke hisab se safe rakha gaya hai
}

interface VenueProps {
  data: any;
  onChange: (data: any) => void;
}

export default function Venue({ data, onChange }: VenueProps) {
  // Safe default data parsing
  const venueData: VenueData = data ?? {
    name: "",
    address: "",
    mapUrl: "",
    notes: "",
  };

  const update = (field: keyof VenueData, value: string) => {
    onChange({ ...venueData, [field]: value });
  };

  return (
    <div className="p-4 border border-purple-200 bg-purple-50/30 rounded-xl space-y-4">
      {/* Header */}
      <div className="border-b border-purple-200 pb-3">
        <h3 className="text-lg font-bold text-purple-800 flex items-center gap-2">
          📍 Venue Details
        </h3>
        <p className="text-xs text-purple-700/80 mt-0.5">
          Enter the exact location, map details, and additional info for your event.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Venue Name
          </label>
          <input
            type="text"
            value={venueData.name ?? ""}
            onChange={(e) => update("name", e.target.value)}
            className="w-full border border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-md px-3 py-1.5 text-sm outline-none transition-all bg-white shadow-sm"
            placeholder="e.g. Marina Bay Sands Expo"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Google Maps Link
          </label>
          <input
            type="url"
            value={venueData.mapUrl ?? ""}
            onChange={(e) => update("mapUrl", e.target.value)}
            className="w-full border border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-md px-3 py-1.5 text-sm outline-none transition-all bg-white shadow-sm"
            placeholder="Paste Google Maps URL"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Full Address
        </label>
        <input
          type="text"
          value={venueData.address ?? ""}
          onChange={(e) => update("address", e.target.value)}
          className="w-full border border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-md px-3 py-1.5 text-sm outline-none transition-all bg-white shadow-sm"
          placeholder="e.g. 10 Bayfront Ave, Singapore 018956"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Additional Details (Notes)
        </label>
        {/* RichTextEditor Wrapper */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all shadow-sm">
          <RichTextEditor
            value={venueData.notes ?? ""}
            onChange={(val: string) => update("notes", val)}
            placeholder="Parking, hall number, access information…"
          />
        </div>
      </div>
    </div>
  );
}