import { prisma } from "@events/db";
import type { Prisma } from "@prisma/client";
import { mapEvent } from "../../../../lib/event-mapper";
import { eventPayloadSchema } from "../../../../lib/event-schema";
import { fail, ok } from "../../../../lib/http";

export const dynamic = "force-dynamic";

type Params = {
  params: Promise<{ id: string }>;
};

function jsonValue(value: unknown): Prisma.InputJsonValue | undefined {
  return value === null || value === undefined ? undefined : (value as Prisma.InputJsonValue);
}

async function findEvent(id: string) {
  return prisma.event.findFirst({
    where: {
      OR: [{ id }, { slug: id }]
    },
    include: { tickets: true }
  });
}

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const event = await findEvent(id);

    if (!event) {
      return fail(new Error("EVENT_NOT_FOUND"), 404);
    }

    return ok(mapEvent(event));
  } catch (error) {
    return fail(error);
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const existing = await findEvent(id);

    if (!existing) {
      return fail(new Error("EVENT_NOT_FOUND"), 404);
    }

    const payload = eventPayloadSchema.parse(await request.json());

    await prisma.eventTicket.deleteMany({ where: { eventId: existing.id } });

    const event = await prisma.event.update({
      where: { id: existing.id },
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
            sold: ticket.sold ?? 0,
            isFree: ticket.isFree ?? ticket.price === 0
          }))
        }
      },
      include: { tickets: true }
    });

    return ok(mapEvent(event));
  } catch (error) {
    return fail(error);
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const existing = await findEvent(id);

    if (!existing) {
      return fail(new Error("EVENT_NOT_FOUND"), 404);
    }

    await prisma.event.delete({ where: { id: existing.id } });
    return ok({ deleted: true });
  } catch (error) {
    return fail(error);
  }
}
