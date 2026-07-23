import { prisma } from "@events/db";
import { fail, ok } from "../../../../lib/http";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const bookings = await prisma.eventBooking.findMany({
      include: {
        event: true,
        ticket: true
      },
      orderBy: { createdAt: "desc" }
    });

    return ok(bookings, 200, request);
  } catch (error) {
    return fail(error, 500, request);
  }
}
