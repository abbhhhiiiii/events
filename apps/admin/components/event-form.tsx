"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { EventSections, PlatformEvent } from "@events/types";
import { saveEvent, type EventFormPayload } from "../lib/api";

const AVAILABLE_SECTIONS: Array<keyof EventSections> = [
  "overview",
  "mediaKit",
  "agenda",
  "speakers",
  "sponsors",
  "venue",
  "contactUs",
  "info",
  "book"
];

const defaultSections: EventSections = {
  overview: { heading: "", content: "" },
  mediaKit: { title: "", description: "", files: [] },
  agenda: [],
  speakers: [],
  sponsors: [],
  venue: { name: "", address: "", mapUrl: "", notes: "" },
  contactUs: { email: "", phone: "", person: "" },
  info: [],
  book: { enabled: true, instructions: "" }
};

const defaultTickets = [
  {
    name: "Delegate Pass",
    price: 0,
    description: "Event access",
    quantity: 100,
    isFree: true
  }
];

function toDateInput(value?: string) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function EventForm({ event }: { event?: PlatformEvent | null }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeSections, setActiveSections] = useState<Array<keyof EventSections>>(
    AVAILABLE_SECTIONS.filter((section) => Boolean(event?.sections?.[section] ?? defaultSections[section]))
  );
  const initialSections = useMemo(() => ({ ...defaultSections, ...(event?.sections ?? {}) }), [event]);

  async function onSubmit(formData: FormData) {
    setSaving(true);
    setError("");

    const sections = activeSections.reduce<EventSections>((acc, section) => {
      const raw = String(formData.get(`section-${section}`) ?? "");
      return {
        ...acc,
        [section]: parseJson(raw, defaultSections[section])
      };
    }, {});

    const payload: EventFormPayload = {
      slug: String(formData.get("slug") ?? ""),
      name: String(formData.get("name") ?? ""),
      category: String(formData.get("category") ?? ""),
      status: String(formData.get("status") ?? "DRAFT") as EventFormPayload["status"],
      shortDescription: String(formData.get("shortDescription") ?? ""),
      startDate: String(formData.get("startDate") ?? ""),
      endDate: String(formData.get("endDate") ?? "") || undefined,
      time: String(formData.get("time") ?? ""),
      location: String(formData.get("location") ?? ""),
      heroImage: String(formData.get("heroImage") ?? "") || undefined,
      heroVideo: String(formData.get("heroVideo") ?? "") || undefined,
      gallery: String(formData.get("gallery") ?? "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      sections,
      tickets: parseJson(String(formData.get("tickets") ?? "[]"), defaultTickets),
      seo: {
        title: String(formData.get("seoTitle") ?? ""),
        description: String(formData.get("seoDescription") ?? ""),
        canonical: String(formData.get("canonicalUrl") ?? "")
      }
    };

    try {
      await saveEvent(payload, event?.id);
      router.push("/events");
      router.refresh();
    } catch {
      setError("Event save nahi hua. API, database URL aur JSON fields check karo.");
      setSaving(false);
    }
  }

  return (
    <form action={onSubmit}>
      {error ? <div className="admin-card" style={{ borderColor: "var(--danger)", marginBottom: 18 }}>{error}</div> : null}

      <section className="form-section">
        <h2>Basic Info</h2>
        <div className="form-grid">
          <label>
            Event Name
            <input name="name" defaultValue={event?.name} required />
          </label>
          <label>
            Slug
            <input name="slug" defaultValue={event?.slug} required />
          </label>
          <label>
            Category
            <input name="category" defaultValue={event?.category ?? "Leadership"} required />
          </label>
          <label>
            Status
            <select name="status" defaultValue={event?.status ?? "DRAFT"}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
              <option value="SOLD_OUT">Sold Out</option>
            </select>
          </label>
          <label>
            Start Date
            <input name="startDate" type="date" defaultValue={toDateInput(event?.startDate)} required />
          </label>
          <label>
            End Date
            <input name="endDate" type="date" defaultValue={toDateInput(event?.endDate)} />
          </label>
          <label>
            Time
            <input name="time" defaultValue={event?.time} required />
          </label>
          <label>
            Location
            <input name="location" defaultValue={event?.location} required />
          </label>
        </div>
        <label>
          Short Description
          <textarea name="shortDescription" defaultValue={event?.shortDescription} required />
        </label>
      </section>

      <section className="form-section">
        <h2>Hero Media</h2>
        <div className="form-grid">
          <label>
            Hero Image URL
            <input name="heroImage" defaultValue={event?.heroImage} />
          </label>
          <label>
            Hero Video URL
            <input name="heroVideo" defaultValue={event?.heroVideo} />
          </label>
        </div>
        <label>
          Gallery Image URLs, one per line
          <textarea name="gallery" defaultValue={(event?.gallery ?? []).join("\n")} />
        </label>
      </section>

      <section className="form-section">
        <h2>Manage Event Sections</h2>
        <div className="section-toggle-grid">
          {AVAILABLE_SECTIONS.map((section) => (
            <label key={section}>
              <input
                type="checkbox"
                checked={activeSections.includes(section)}
                onChange={(changeEvent) => {
                  setActiveSections((current) =>
                    changeEvent.target.checked ? [...current, section] : current.filter((item) => item !== section)
                  );
                }}
              />
              {section}
            </label>
          ))}
        </div>
      </section>

      {activeSections.map((section) => (
        <section className="form-section" key={section}>
          <h2>{section}</h2>
          <label>
            Section JSON
            <textarea
              name={`section-${section}`}
              defaultValue={JSON.stringify(initialSections[section], null, 2)}
              spellCheck={false}
            />
          </label>
        </section>
      ))}

      <section className="form-section">
        <h2>Tickets</h2>
        <label>
          Tickets JSON
          <textarea name="tickets" defaultValue={JSON.stringify(event?.tickets ?? defaultTickets, null, 2)} spellCheck={false} />
        </label>
      </section>

      <section className="form-section">
        <h2>SEO</h2>
        <div className="form-grid">
          <label>
            Meta Title
            <input name="seoTitle" defaultValue={event?.seo.title} required />
          </label>
          <label>
            Canonical URL
            <input name="canonicalUrl" defaultValue={event?.seo.canonical} required />
          </label>
        </div>
        <label>
          Meta Description
          <textarea name="seoDescription" defaultValue={event?.seo.description} required />
        </label>
      </section>

      <button className="btn" type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save Event"}
      </button>
    </form>
  );
}
