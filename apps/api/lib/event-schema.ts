import { z } from "zod";

const jsonRecord = z.record(z.unknown()).optional().nullable();

export const eventTicketSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  price: z.coerce.number().int().min(0),
  description: z.string().default(""),
  quantity: z.coerce.number().int().min(0),
  sold: z.coerce.number().int().min(0).optional(),
  isFree: z.boolean().optional()
});

export const eventPayloadSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "SOLD_OUT"]).default("DRAFT"),
  shortDescription: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  time: z.string().min(1),
  location: z.string().min(1),
  heroImage: z.string().optional().nullable(),
  heroVideo: z.string().optional().nullable(),
  gallery: z.array(z.string()).default([]),
  sections: z
    .object({
      overview: jsonRecord,
      mediaKit: jsonRecord,
      agenda: z.array(z.record(z.unknown())).optional().nullable(),
      speakers: z.array(z.record(z.unknown())).optional().nullable(),
      sponsors: z.array(z.record(z.unknown())).optional().nullable(),
      venue: jsonRecord,
      contactUs: jsonRecord,
      info: z.array(z.string()).optional().nullable(),
      book: jsonRecord
    })
    .default({}),
  tickets: z.array(eventTicketSchema).default([]),
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    canonical: z.string().min(1)
  })
});

export const bookingPayloadSchema = z.object({
  eventId: z.string().min(1),
  ticketId: z.string().optional(),
  attendeeName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  quantity: z.coerce.number().int().min(1).default(1)
});
