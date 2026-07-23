import {
  sendAdminEventBookingMail,
  sendUserEventBookingMail,
  type EventBookingMailStatus,
} from "@events/notifications";
import { prisma } from "@events/db";

function approvalStatus(status: string): "NOT_REQUIRED" | "PENDING" | "APPROVED" | "REJECTED" {
  if (status === "PENDING_APPROVAL") return "PENDING";
  if (status === "APPROVED") return "APPROVED";
  if (status === "REJECTED") return "REJECTED";
  return "NOT_REQUIRED";
}

export async function notifyEventBooking(
  bookingId: string,
  status: EventBookingMailStatus,
) {
  const booking = await prisma.eventBooking.findUnique({
    where: { id: bookingId },
    include: { event: true, ticket: true },
  });

  if (!booking || !booking.ticket) return;

  const registration = (booking.registrationData ?? {}) as Record<string, unknown>;
  const data = {
    eventName: booking.event.name,
    ticketName: booking.ticket.name,
    attendeeName: booking.attendeeName,
    attendeeEmail: booking.email,
    attendeePhone: booking.phone ?? "—",
    companyName: typeof registration.companyName === "string" ? registration.companyName : null,
    designation: typeof registration.designation === "string" ? registration.designation : null,
    amountPaid: booking.paymentAmountPaise,
    approvalStatus: approvalStatus(booking.status),
    paymentStatus: booking.paymentId
      ? "SUCCESS" as const
      : booking.paymentAmountPaise === 0
        ? "FREE" as const
        : "PENDING" as const,
    bookingId: booking.id,
    bookedAt: booking.createdAt,
    rejectionReason: booking.rejectionReason ?? undefined,
  };

  await Promise.all([
    sendUserEventBookingMail(data, status),
    sendAdminEventBookingMail(data, status),
  ]);
}

/** Email delivery must never roll back a successful booking or payment. */
export async function safelyNotifyEventBooking(
  bookingId: string,
  status: EventBookingMailStatus,
) {
  try {
    await notifyEventBooking(bookingId, status);
  } catch (error) {
    console.error(`Unable to send ${status.toLowerCase()} booking email for ${bookingId}`, error);
  }
}
