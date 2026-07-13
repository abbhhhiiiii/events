import { prisma } from "@events/db";
import { bookingPayloadSchema } from "../../../../lib/event-schema";
import { fail, ok } from "../../../../lib/http";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = bookingPayloadSchema.parse(await request.json());
    const ticket = payload.ticketId
      ? await prisma.eventTicket.findUnique({ where: { id: payload.ticketId } })
      : null;

    const amount = ticket ? ticket.price * payload.quantity : 0;
    const isFree = !ticket || ticket.isFree || amount === 0;

    const booking = await prisma.eventBooking.create({
      data: {
        eventId: payload.eventId,
        ticketId: ticket?.id,
        attendeeName: payload.attendeeName,
        email: payload.email,
        phone: payload.phone,
        quantity: payload.quantity,
        amount,
        status: isFree ? "FREE" : "PENDING"
      }
    });

    if (ticket) {
      await prisma.eventTicket.update({
        where: { id: ticket.id },
        data: { sold: { increment: payload.quantity } }
      });
    }

    return ok({
      booking,
      payment: isFree
        ? null
        : {
            provider: "razorpay",
            amount,
            currency: "INR",
            keyId: process.env.RAZORPAY_KEY_ID ?? ""
          }
    });
  } catch (error) {
    return fail(error);
  }
}
