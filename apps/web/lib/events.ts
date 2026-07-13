import type { PlatformEvent } from "@events/types";

const fallbackImage =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2200&q=85";

export const demoEvents: PlatformEvent[] = [
  {
    id: "demo-global-growth-summit",
    slug: "global-growth-summit-2026",
    name: "Global Growth Summit 2026",
    category: "Leadership",
    status: "PUBLISHED",
    shortDescription: "A flagship leadership forum for enterprise growth, capital, policy, and global partnerships.",
    startDate: "2026-09-18T00:00:00.000Z",
    time: "09:00 AM - 06:30 PM",
    location: "Mumbai, India",
    heroImage: fallbackImage,
    gallery: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80"
    ],
    sections: {
      overview: {
        heading: "A premium room for business leaders.",
        content:
          "A gathering of founders, CXOs, investors, public leaders, and ecosystem builders shaping the next decade of business growth."
      },
      mediaKit: {
        title: "Media Kit",
        description: "Press releases, speaker portraits, brand assets, and venue media are available for approved partners.",
        files: [{ label: "Download Media Kit", url: "#" }]
      },
      agenda: [
        {
          time: "09:00",
          title: "Executive Registration",
          description: "Badge pickup, hosted networking breakfast, and partner lounge access."
        },
        {
          time: "10:00",
          title: "Opening Keynote",
          description: "The enterprise growth playbook for resilient global expansion."
        }
      ],
      speakers: [
        {
          name: "Aarav Mehta",
          role: "Managing Partner",
          company: "Northstar Ventures",
          image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80"
        },
        {
          name: "Naina Kapoor",
          role: "Chief Strategy Officer",
          company: "Atlas Group",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
        }
      ],
      sponsors: [{ name: "Atlas" }, { name: "Northstar" }, { name: "FinEdge" }],
      venue: {
        name: "Jio World Convention Centre",
        address: "Mumbai, India",
        notes: "Doors open at 8:30 AM."
      },
      contactUs: {
        email: "events@company.com",
        phone: "+91 22 4000 2026",
        person: "Events Desk"
      },
      info: ["Government ID is required at check-in.", "Smart casual attire."],
      book: { enabled: true, instructions: "Select a ticket and continue to checkout." }
    },
    tickets: [
      { id: "demo-ticket-1", name: "Delegate Pass", price: 14900, description: "Main stage, expo, lunch, and networking.", quantity: 120 },
      { id: "demo-ticket-2", name: "Executive Pass", price: 29900, description: "Delegate access plus VIP lounge and dinner.", quantity: 42 }
    ],
    seo: {
      title: "Global Growth Summit 2026",
      description: "Book your pass for Global Growth Summit 2026 in Mumbai.",
      canonical: "/events/global-growth-summit-2026"
    }
  }
];

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002/api";

async function apiFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      return fallback;
    }

    const json = (await response.json()) as { data: T };
    return json.data ?? fallback;
  } catch {
    return fallback;
  }
}

export async function listEvents(admin = false) {
  return apiFetch<PlatformEvent[]>(`/events${admin ? "?admin=true" : ""}`, demoEvents);
}

export async function getEventBySlug(slug: string) {
  const fallback = demoEvents.find((event) => event.slug === slug) ?? null;
  return apiFetch<PlatformEvent | null>(`/events/${slug}`, fallback);
}

export async function getFeaturedEvent() {
  const events = await listEvents();
  return events.find((event) => event.status === "PUBLISHED") ?? events[0] ?? demoEvents[0];
}

export async function getUpcomingEvents() {
  return listEvents();
}

export async function getPastEvents() {
  return demoEvents.map((event) => ({
    ...event,
    id: "demo-past-enterprise",
    slug: "enterprise-leadership-retreat-2025",
    name: "Enterprise Leadership Retreat 2025",
    status: "ARCHIVED" as const,
    startDate: "2025-12-09T00:00:00.000Z"
  }));
}
