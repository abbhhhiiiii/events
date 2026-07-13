export type EventStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "SOLD_OUT";

export type EventCategory =
  | "Leadership"
  | "Technology"
  | "Startup"
  | "Culture"
  | "Policy"
  | "Design";

export type Speaker = {
  name: string;
  role: string;
  company: string;
  image: string;
};

export type AgendaItem = {
  time: string;
  title: string;
  description: string;
};

export type TicketTier = {
  id?: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  sold?: number;
  isFree?: boolean;
};

export type EventSections = {
  overview?: {
    heading?: string;
    content?: string;
  };
  mediaKit?: {
    title?: string;
    description?: string;
    files?: Array<{ label: string; url: string }>;
  };
  agenda?: AgendaItem[];
  speakers?: Speaker[];
  sponsors?: Array<{ name: string; logo?: string; website?: string }>;
  venue?: {
    name?: string;
    address?: string;
    mapUrl?: string;
    notes?: string;
  };
  contactUs?: {
    email?: string;
    phone?: string;
    person?: string;
  };
  info?: string[];
  book?: {
    enabled?: boolean;
    instructions?: string;
  };
};

export type PlatformEvent = {
  id: string;
  slug: string;
  name: string;
  category: EventCategory | string;
  status: EventStatus;
  shortDescription: string;
  startDate: string;
  endDate?: string;
  time: string;
  location: string;
  heroImage?: string;
  heroVideo?: string;
  gallery?: string[];
  sections: EventSections;
  tickets: TicketTier[];
  seo: {
    title: string;
    description: string;
    canonical: string;
  };
};

export type EventBooking = {
  id: string;
  eventId: string;
  ticketId?: string;
  attendeeName: string;
  email: string;
  phone?: string;
  quantity: number;
  amount: number;
  status: "PENDING" | "PAID" | "FAILED" | "FREE" | "CANCELLED";
  paymentId?: string;
  createdAt: string;
};
