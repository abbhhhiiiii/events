import type { EventBooking, EventSections, PlatformEvent, TicketTier } from "@events/types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002/api";

type ApiResponse<T> = {
  data: T;
  error?: string;
};

export async function apiGet<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, { cache: "no-store" });
    if (!response.ok) return fallback;
    const json = (await response.json()) as ApiResponse<T>;
    return json.data ?? fallback;
  } catch {
    return fallback;
  }
}

export async function listAdminEvents() {
  return apiGet<PlatformEvent[]>("/events?admin=true", []);
}

export async function getAdminEvent(id: string) {
  return apiGet<PlatformEvent | null>(`/events/${id}`, null);
}

export async function listBookings() {
  return apiGet<Array<EventBooking & { event?: PlatformEvent; ticket?: TicketTier }>>("/admin/event-bookings", []);
}

export type EventFormPayload = {
  slug: string;
  name: string;
  category: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | "SOLD_OUT";
  shortDescription: string;
  startDate: string;
  endDate?: string;
  time: string;
  location: string;
  heroImage?: string;
  heroVideo?: string;
  gallery: string[];
  sections: EventSections;
  tickets: TicketTier[];
  seo: {
    title: string;
    description: string;
    canonical: string;
  };
};

export async function saveEvent(payload: EventFormPayload, id?: string) {
  const response = await fetch(`${apiBaseUrl}/events${id ? `/${id}` : ""}`, {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("EVENT_SAVE_FAILED");
  }

  return response.json();
}
