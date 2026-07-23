import { NextResponse } from "next/server";
import { prisma } from "@events/db";
import { bookingPayloadSchema } from "../../../../lib/event-schema";
import { fail, getCorsHeaders, ok } from "../../../../lib/http";
import { safelyNotifyEventBooking } from "../../../../lib/event-booking-notifications";

export const dynamic = "force-dynamic";

const GST_RATE = 0.18;

// --- CORS HEADERS FIX ---
// 1. OPTIONS METHOD EXPORT (CORS Preflight Fix)
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}

// Helper Function
async function createRazorpayOrder(amount: number, receipt: string) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) throw new Error("RAZORPAY_NOT_CONFIGURED");

  const authorization = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const razorpayApiBaseUrl = process.env.RAZORPAY_API_BASE_URL;
  if (!razorpayApiBaseUrl) throw new Error("RAZORPAY_API_BASE_URL_NOT_CONFIGURED");
  const response = await fetch(`${razorpayApiBaseUrl.replace(/\/$/, "")}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authorization}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount, currency: "INR", receipt }),
    cache: "no-store",
  });

  if (!response.ok) throw new Error("RAZORPAY_ORDER_CREATION_FAILED");
  return (await response.json()) as { id: string; amount: number; currency: string };
}

// Helper: Response me headers add karne ke liye
function withCors(response: Response, request: Request) {
  Object.entries(getCorsHeaders(request)).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// 2. POST METHOD EXPORT (Main Booking API)
export async function POST(request: Request) {
  try {
    const payload = bookingPayloadSchema.parse(await request.json());

    const ticket = await prisma.eventTicket.findFirst({
      where: { id: payload.ticketId, eventId: payload.eventId },
    });

    if (!ticket) return withCors(fail(new Error("TICKET_NOT_FOUND"), 404, request), request);
    if (ticket.sold + payload.quantity > ticket.quantity) {
      return withCors(fail(new Error("TICKET_SOLD_OUT"), 409, request), request);
    }

    const isFree = ticket.isFree || ticket.price === 0;
    const needsApproval =
      (ticket as typeof ticket & { requiresApproval?: boolean }).requiresApproval ?? false;

    const baseAmount = ticket.price * payload.quantity;
    const paymentAmountPaise = isFree
      ? 0
      : Math.round(baseAmount * (1 + GST_RATE) * 100);

  
    const booking = await prisma.eventBooking.create({
      data: {
        eventId: payload.eventId,
        ticketId: ticket.id,
        attendeeName: payload.attendeeName,
        email: payload.attendeeEmail,
        phone: payload.attendeePhone,
        quantity: payload.quantity,
        amount: baseAmount,
        paymentAmountPaise,
        registrationData: {
          companyName: payload.companyName,
          designation: payload.designation,
          ...payload.registrationData,
        },
        status: isFree
          ? (needsApproval ? "PENDING_APPROVAL" : "PAID")
          : "PENDING_PAYMENT",
      },
    });

   
    if (isFree) {
      if (needsApproval) {
        await safelyNotifyEventBooking(booking.id, "PENDING");
        return withCors(
          ok({ bookingId: booking.id, free: true, approvalStatus: "PENDING_APPROVAL" }, 200, request), request
        );
      }

      
      await prisma.eventTicket.update({
        where: { id: ticket.id },
        data: { sold: { increment: payload.quantity } },
      });

      await safelyNotifyEventBooking(booking.id, "CONFIRMED");

      return withCors(ok({ bookingId: booking.id, free: true }, 200, request), request);
    }

  
    const order = await createRazorpayOrder(paymentAmountPaise, booking.id);

    await prisma.eventBooking.update({
      where: { id: booking.id },
      data: { razorpayOrderId: order.id },
    });

    return withCors(
      ok({
        bookingId: booking.id,
        free: false,
        keyId: process.env.RAZORPAY_KEY_ID,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        requiresApproval: needsApproval, 
      }, 200, request), request
    );
  } catch (error) {
    return withCors(fail(error, 500, request), request);
  }
}
