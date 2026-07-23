import { prisma } from "@events/db";
import { mapEvent } from "../../../lib/event-mapper";
import { eventPayloadSchema } from "../../../lib/event-schema";
import { fail, getCorsHeaders, ok } from "../../../lib/http";

import { NextResponse } from "next/server";

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(request),
  });
}

export const dynamic = "force-dynamic";
const json = (value: unknown) =>
  value === null || value === undefined ? undefined : (value as never);

export async function GET(request: Request) {
  try {
    const events = await prisma.event.findMany({
      include: { tickets: true },
      orderBy: { startDate: "asc" },
    });
    return ok(events.map(mapEvent), 200, request);
  } catch (error) {
    return fail(error, 500, request);
  }
}

export async function POST(request: Request) {
  try {
    const payload = eventPayloadSchema.parse(await request.json());
    const event = await prisma.event.create({
      data: {
        name: payload.name,
        type: payload.type,
        startDate: payload.startDate,
        endDate: payload.endDate,
        startTime: payload.startTime,
        endTime: payload.endTime,
        location: payload.location,
        image: payload.image,
        galleryImages: json(payload.galleryImages),
        galleryVideos: json(payload.galleryVideos),
        status: payload.status,
        agenda: json(payload.agenda),
        book: json(payload.book),
        contactUs: json(payload.contactUs),
        info: json(payload.info),
        mediaKit: json(payload.mediaKit),
        overview: json(payload.overview),
        speakers: json(payload.speakers),
        sponsors: json(payload.sponsors),
        venue: json(payload.venue),
        guestPrice: payload.guestPrice,
        memberPrice: payload.memberPrice,
        tickets: {
          create: payload.tickets.map((ticket) => ({
            name: ticket.name,
            price: ticket.price,
            description: ticket.description,
            quantity: ticket.quantity,
            isFree: ticket.isFree ?? ticket.price === 0,
            requiresApproval: ticket.requiresApproval ?? false,
          })),
        },
      },
      include: { tickets: true },
    });
    return ok(mapEvent(event), 201, request);
  } catch (error) {
    return fail(error, 500, request);
  }
}
