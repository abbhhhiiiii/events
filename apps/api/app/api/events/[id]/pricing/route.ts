import { prisma } from "@events/db";
import { fail, ok } from "../../../../../lib/http";

export const dynamic = "force-dynamic";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const event = await prisma.event.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { tickets: true }
    });

    if (!event) {
      return fail(new Error("EVENT_NOT_FOUND"), 404);
    }

    return ok(
      event.tickets.map((ticket: { quantity: number; sold: number }) => ({
        ...ticket,
        available: Math.max(ticket.quantity - ticket.sold, 0)
      }))
    );
  } catch (error) {
    return fail(error);
  }
}
