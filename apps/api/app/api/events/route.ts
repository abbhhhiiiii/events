import { prisma } from "@events/db";
import type { Prisma } from "@prisma/client";
import { mapEvent } from "../../../lib/event-mapper";
import { eventPayloadSchema } from "../../../lib/event-schema";
import { fail, ok } from "../../../lib/http";

export const dynamic = "force-dynamic";

function jsonValue(value: unknown): Prisma.InputJsonValue | undefined {
  return value === null || value === undefined ? undefined : (value as Prisma.InputJsonValue);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDrafts = searchParams.get("admin") === "true";

    const events = await prisma.event.findMany({
      where: includeDrafts ? undefined : { status: "PUBLISHED" },
      include: { tickets: true },
      orderBy: { startDate: "asc" }
    });

    return ok(events.map(mapEvent));
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = eventPayloadSchema.parse(await request.json());

    const event = await prisma.event.create({
      data: {
        slug: payload.slug,
        name: payload.name,
        category: payload.category,
        status: payload.status,
        shortDescription: payload.shortDescription,
        startDate: payload.startDate,
        endDate: payload.endDate,
        time: payload.time,
        location: payload.location,
        heroImage: payload.heroImage,
        heroVideo: payload.heroVideo,
        gallery: jsonValue(payload.gallery),
        overview: jsonValue(payload.sections.overview),
        mediaKit: jsonValue(payload.sections.mediaKit),
        agenda: jsonValue(payload.sections.agenda),
        speakers: jsonValue(payload.sections.speakers),
        sponsors: jsonValue(payload.sections.sponsors),
        venue: jsonValue(payload.sections.venue),
        contactUs: jsonValue(payload.sections.contactUs),
        info: jsonValue(payload.sections.info),
        book: jsonValue(payload.sections.book),
        seoTitle: payload.seo.title,
        seoDescription: payload.seo.description,
        canonicalUrl: payload.seo.canonical,
        tickets: {
          create: payload.tickets.map((ticket) => ({
            name: ticket.name,
            price: ticket.price,
            description: ticket.description,
            quantity: ticket.quantity,
            isFree: ticket.isFree ?? ticket.price === 0
          }))
        }
      },
      include: { tickets: true }
    });

    return ok(mapEvent(event), 201);
  } catch (error) {
    return fail(error);
  }
}
