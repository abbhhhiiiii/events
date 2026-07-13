import { prisma } from "@events/db";
import { fail, ok } from "../../../../lib/http";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { bookingId?: string; paymentId?: string };

    if (!body.bookingId) {
      return fail(new Error("BOOKING_ID_REQUIRED"), 400);
    }

    const booking = await prisma.eventBooking.update({
      where: { id: body.bookingId },
      data: {
        status: "PAID",
        paymentId: body.paymentId
      }
    });

    return ok({ verified: true, booking });
  } catch (error) {
    return fail(error);
  }
}
