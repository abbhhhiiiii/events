"use client";

import { Save, Info, ImageIcon, Calendar, MapPin, DollarSign, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { EventSections, TicketTier } from "@events/types";
import { saveEvent, type AdminEvent, type EventFormPayload } from "../lib/api";
import ImageUpload from "./ImageUpload";
import MultiImageUpload from "./MultiImageUpload";
import MultiVideoUpload from "./MultiVideoUpload";
import { EventSectionEditor } from "./event-section-editor";

const sectionsFrom = (event?: AdminEvent | null): EventSections => ({
  agenda: event?.agenda ?? [],
  book: event?.book ?? { enabled: true, instructions: "" },
  contactUs: event?.contactUs ?? {},
  info: event?.info ?? [],
  mediaKit: event?.mediaKit ?? {},
  overview: event?.overview ?? {},
  speakers: event?.speakers ?? [],
  sponsors: event?.sponsors ?? [],
  venue: event?.venue ?? {},
});

const date = (value?: string) =>
  value ? new Date(value).toISOString().slice(0, 10) : "";

export function EventForm({ event }: { event?: AdminEvent | null }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  
  const [form, setForm] = useState({
    name: event?.name ?? "",
    type: event?.type ?? "",
    startDate: date(event?.startDate),
    endDate: date(event?.endDate),
    startTime: event?.startTime ?? "",
    endTime: event?.endTime ?? "",
    location: event?.location ?? "",
    image: event?.image ?? "",
    galleryImages: event?.galleryImages ?? [],
    galleryVideos: event?.galleryVideos ?? [],
    status: event?.status ?? "DRAFT",
    guestPrice: event?.guestPrice ?? 0,
    memberPrice: event?.memberPrice ?? 0,
  });

  const [sections, setSections] = useState<EventSections>(sectionsFrom(event));
  const [tickets, setTickets] = useState<TicketTier[]>(event?.tickets ?? []);

  const set = (key: keyof typeof form, value: string | string[] | number) =>
    setForm((current) => ({ ...current, [key]: value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload: EventFormPayload = {
      ...form,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      startTime: form.startTime || undefined,
      endTime: form.endTime || undefined,
      agenda: sections.agenda,
      book: sections.book,
      contactUs: sections.contactUs,
      info: sections.info,
      mediaKit: sections.mediaKit,
      overview: sections.overview,
      speakers: sections.speakers,
      sponsors: sections.sponsors,
      venue: sections.venue,
      tickets,
    };

    try {
      await saveEvent(payload, event?.id?.toString());
      router.push("/events");
      router.refresh();
    } catch {
      setError("Event save nahi hua. Check required fields or try again.");
      setSaving(false);
    }
  }

  // Common Input Class
  const inputClass = "w-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md px-3 py-2 text-sm outline-none transition-all bg-white shadow-sm";

  return (
    <form className="relative max-w-[1400px] mx-auto pb-32" onSubmit={submit}>
      
      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-6 bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm">
          <Info size={18} /> {error}
        </div>
      )}

      <div className="space-y-8">
        <section className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Settings className="text-blue-600" size={22} /> Event Setup
            </h2>
            <p className="text-sm text-slate-500 mt-1">Configure the core details of your event.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Event Name *</label>
              <input required value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} placeholder="e.g. Annual Tech Conference 2026" />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Event Type *</label>
              <input required value={form.type} onChange={(e) => set("type", e.target.value)} className={inputClass} placeholder="e.g. Conference, Webinar, Meetup" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1"><Calendar size={14} /> Start Date</label>
              <input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1"><Calendar size={14} /> End Date</label>
              <input type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Status *</label>
              <select required value={form.status} onChange={(e) => set("status", e.target.value)} className={inputClass}>
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Start Time</label>
              <input type="time" value={form.startTime} onChange={(e) => set("startTime", e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">End Time</label>
              <input type="time" value={form.endTime} onChange={(e) => set("endTime", e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1"><MapPin size={14} /> Main Location *</label>
              <input required value={form.location} onChange={(e) => set("location", e.target.value)} className={inputClass} placeholder="e.g. New York, NY or Online" />
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1"><DollarSign size={14} /> Guest Price</label>
                <input type="number" min="0" value={form.guestPrice} onChange={(e) => set("guestPrice", Number(e.target.value))} className={inputClass} placeholder="0 for Free" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1"><DollarSign size={14} /> Member Price</label>
                <input type="number" min="0" value={form.memberPrice} onChange={(e) => set("memberPrice", Number(e.target.value))} className={inputClass} placeholder="0 for Free" />
              </div>
            </div>
          </div>
        </section>

  
        <section className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <ImageIcon className="text-blue-600" size={22} /> Media & Assets
            </h2>
            <p className="text-sm text-slate-500 mt-1">Upload hero images and gallery content.</p>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Main Event Image (Hero)</label>
              <ImageUpload value={form.image} onChange={(url) => set("image", url)} />
            </div>

            <hr className="border-slate-100" />

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Image Gallery</label>
              <MultiImageUpload value={form.galleryImages} onChange={(urls) => set("galleryImages", urls)} />
            </div>

            <hr className="border-slate-100" />

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Video Gallery</label>
              <MultiVideoUpload value={form.galleryVideos} onChange={(urls) => set("galleryVideos", urls)} />
            </div>
          </div>
        </section>

    
        <EventSectionEditor
          sections={sections}
          onChange={setSections}
          tickets={tickets}
          onTicketsChange={setTickets}
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 lg:left-[250px] bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 sm:px-8 z-50 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] flex flex-col sm:flex-row justify-between items-center gap-4 transition-all">
        <span className="text-sm text-slate-500 font-medium">
          Only filled sections will be visible on the event page.
        </span>
        <button 
          type="submit" 
          disabled={saving}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Save size={18} /> {saving ? "Saving Event..." : "Save Event"}
        </button>
      </div>
    </form>
  );
}