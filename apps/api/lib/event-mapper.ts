import type { PlatformEvent } from "@events/types";

type DbEvent = {
  id: string;
  slug: string;
  name: string;
  category: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | "SOLD_OUT";
  shortDescription: string;
  startDate: Date;
  endDate: Date | null;
  time: string;
  location: string;
  heroImage: string | null;
  heroVideo: string | null;
  gallery: unknown;
  overview: unknown;
  mediaKit: unknown;
  agenda: unknown;
  speakers: unknown;
  sponsors: unknown;
  venue: unknown;
  contactUs: unknown;
  info: unknown;
  book: unknown;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  tickets?: Array<{
    id: string;
    name: string;
    price: number;
    description: string;
    quantity: number;
    sold: number;
    isFree: boolean;
  }>;
};

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asObject<T extends Record<string, unknown>>(value: unknown): T | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as T) : undefined;
}

export function mapEvent(event: DbEvent): PlatformEvent {
  return {
    id: event.id,
    slug: event.slug,
    name: event.name,
    category: event.category,
    status: event.status,
    shortDescription: event.shortDescription,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate?.toISOString(),
    time: event.time,
    location: event.location,
    heroImage: event.heroImage ?? undefined,
    heroVideo: event.heroVideo ?? undefined,
    gallery: asArray<string>(event.gallery),
    sections: {
      overview: asObject(event.overview),
      mediaKit: asObject(event.mediaKit),
      agenda: asArray(event.agenda),
      speakers: asArray(event.speakers),
      sponsors: asArray(event.sponsors),
      venue: asObject(event.venue),
      contactUs: asObject(event.contactUs),
      info: asArray<string>(event.info),
      book: asObject(event.book)
    },
    tickets: event.tickets ?? [],
    seo: {
      title: event.seoTitle,
      description: event.seoDescription,
      canonical: event.canonicalUrl
    }
  };
}
