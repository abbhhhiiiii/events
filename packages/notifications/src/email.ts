"use server";

import nodemailer from "nodemailer";

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function createTransporter() {
  const host = requiredEnv("SMTP_HOST");
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = requiredEnv("SMTP_USER");
  const pass = requiredEnv("SMTP_PASS");
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function getPublicBaseUrl() {
  const configuredUrl = requiredEnv("NEXT_PUBLIC_BASE_URL");

  if (configuredUrl.startsWith("http://") || configuredUrl.startsWith("https://")) {
    return configuredUrl.replace(/\/$/, "");
  }

  return `https://${configuredUrl.replace(/\/$/, "")}`;
}

function getEmailAssetUrl(path: string) {
  return `${getPublicBaseUrl()}${path}`;
}

// ── OTP Email ─────────────────────────────────────────────────────────────────

export async function sendEmailOTP(to: string, code: string): Promise<void> {
  await createTransporter().sendMail({
    from: `"SME Business Forum" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
    to,
    subject: "Your OTP – SME Business Forum",
    text: `Your one-time password is: ${code}\n\nIt expires in 10 minutes. Do not share it with anyone.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;background:#f9fafb;padding:32px;border-radius:12px">
        <div style="text-align:center;margin-bottom:24px">
          <img src="${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/images/logo3.svg" height="48" alt="SME Business Forum" />
        </div>
        <h2 style="font-size:20px;color:#111;margin:0 0 8px">Verify your email</h2>
        <p style="color:#555;font-size:14px;margin:0 0 24px">
          Use the code below. It is valid for <strong>10 minutes</strong>.
        </p>
        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:28px;text-align:center">
          <p style="letter-spacing:10px;font-size:36px;font-weight:700;color:#111;margin:0">${code}</p>
        </div>
        <p style="color:#aaa;font-size:12px;margin:24px 0 0;text-align:center">
          If you did not request this, please ignore this email.
        </p>
      </div>`,
  });
}


export async function sendEmail(
  subject: string,
  fields: Record<string, string>,
): Promise<void> {
  const rows = Object.entries(fields)
    .map(
      ([key, value]) => `
    <tr>
      <td style="border:1px solid #dbe8ef;font-weight:700;background:#f8fbfd;width:190px;padding:8px">${key}</td>
      <td style="border:1px solid #dbe8ef;padding:8px">${value || "—"}</td>
    </tr>`,
    )
    .join("");

  await createTransporter().sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: process.env.SMTP_USER,
    cc: process.env.ADMIN_CC,
    subject,
    replyTo: fields.Email || undefined,
    html: `
      <div style="font-family:Arial,sans-serif;color:#0B1F33;line-height:1.6">
        <h2 style="color:#2596BE">${subject}</h2>
        <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:680px">
          ${rows}
        </table>
      </div>`,
  });
}

export async function sendNewsletterEmail(to: string, subject: string, html: string) {
  await createTransporter().sendMail({
    from: `"SME Business Forum" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}

// ── Membership Confirmation Email ─────────────────────────────────────────────

export interface MembershipEmailData {
  membershipId: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  planName: string;
  amount: number; // Amount in paise.
  paymentId: string;
  forum: string;
}

export async function sendMembershipConfirmation(
  data: MembershipEmailData,
): Promise<void> {
  const amountRs = (data.amount / 100).toLocaleString("en-IN");
  const date = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const tableRows = [
    ["Plan", data.planName],
    ["Company", data.companyName],
    ["Date", date],
    ["Amount Paid", `₹${amountRs}`],
    ["Payment Ref", data.paymentId],
  ]
    .map(
      ([k, v]) => `
    <tr>
      <td style="padding:10px 14px;background:#f3f4f6;font-weight:700;font-size:13px;border:1px solid #e5e7eb;width:40%">${k}</td>
      <td style="padding:10px 14px;font-size:13px;border:1px solid #e5e7eb">${v}</td>
    </tr>`,
    )
    .join("");

  await createTransporter().sendMail({
    from: `"SME Business Forum" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
    to: data.email,
    subject: `Welcome to SME Business Forum — Membership ID: ${data.membershipId}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#0B1F33">
        <div style="background:linear-gradient(135deg,#0B1F33,#1a3a5c);padding:40px 32px;text-align:center;border-radius:12px 12px 0 0">
          <img src="${process.env.NEXT_PUBLIC_BASE_URL}/images/logo3.svg" height="52" alt="SME Business Forum" style="margin-bottom:16px" />
          <h1 style="color:#fff;font-size:22px;margin:0">Welcome to SME Business Forum!</h1>
        </div>
        <div style="background:#f9fafb;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none">
          <p>Dear <strong>${data.firstName} ${data.lastName}</strong>,</p>
          <p style="color:#555">Your <strong>${data.planName}</strong> membership is confirmed. Here are your details:</p>

          <div style="background:#fff;border:2px solid #008DD2;border-radius:12px;padding:24px;text-align:center;margin:20px 0">
            <p style="color:#555;font-size:12px;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.1em">Your Membership ID</p>
            <p style="font-size:28px;font-weight:900;color:#008DD2;letter-spacing:4px;margin:0">${data.membershipId}</p>
            <p style="color:#999;font-size:11px;margin:8px 0 0">Save this ID for future reference</p>
          </div>

          <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-bottom:24px">
            ${tableRows}
          </table>

          <p style="color:#555;font-size:14px">Our team will review your application and send your membership certificate within 2–3 business days.</p>
          <p style="font-size:14px;margin:20px 0 0">Warm regards,<br/><strong>SME Business Forum Team</strong></p>
        </div>
        <p style="text-align:center;color:#aaa;font-size:11px;margin:16px 0 0">
          © ${new Date().getFullYear()} SME Business Forum. All rights reserved.
        </p>
      </div>`,
  });
}

export async function notifyAdminNewMembership(
  data: MembershipEmailData,
): Promise<void> {
  const amountRs = (data.amount / 100).toLocaleString("en-IN");
  await sendEmail(
    `New Membership — ${data.membershipId} | ${data.companyName}`,
    {
      "Membership ID": data.membershipId,
      Plan: data.planName,
      Name: `${data.firstName} ${data.lastName}`,
      Email: data.email,
      Company: data.companyName,
      Amount: `₹${amountRs}`,
      "Payment ID": data.paymentId,
      "Registration Source": data.forum,
    },
  );
}


export type EventBookingMailStatus = "PENDING" | "CONFIRMED" | "REJECTED";

const EVENT_MAIL_FROM = `"SME Events" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`;

const eventBookingAdminRecipient =
  process.env.EVENT_BOOKING_ADMIN_EMAIL ?? process.env.ADMIN_CC ?? process.env.SMTP_USER;

export interface EventBookingEmailData {
  eventName: string;
  ticketName: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  companyName?: string | null;
  designation?: string | null;
  amountPaid: number;
  approvalStatus: "NOT_REQUIRED" | "PENDING" | "APPROVED" | "REJECTED";
  paymentStatus: "PENDING" | "SUCCESS" | "FAILED" | "FREE";
  bookingId: string;
  bookedAt: Date;
  rejectionReason?: string;
}

function formatBookingAmount(amountPaid: number) {
  return `₹${(amountPaid / 100).toLocaleString("en-IN")}`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

function formatBookingStatus(status: EventBookingMailStatus) {
  if (status === "PENDING") return "Pending Approval";
  if (status === "REJECTED") return "Rejected";
  return "Confirmed";
}

function buildEventBookingSummaryRows(data: EventBookingEmailData) {
  const rows = [
    ["Event", data.eventName],
    ["Ticket", data.ticketName],
    ["Attendee", data.attendeeName],
    ["Email", data.attendeeEmail],
    ["Phone", data.attendeePhone],
    ["Company", data.companyName || "—"],
    ["Designation", data.designation || "—"],
    ["Amount", formatBookingAmount(data.amountPaid)],
    ["Payment", data.paymentStatus],
    ["Booking ID", data.bookingId],
    ["Approval", data.approvalStatus],
  ];

  if (data.rejectionReason) {
    rows.push(["Rejection Reason", data.rejectionReason]);
  }

  return rows;
}

function buildEventBookingHtml(
  data: EventBookingEmailData,
  status: EventBookingMailStatus,
) {
  const title =
    status === "PENDING"
      ? "Booking Received and Pending Approval"
      : status === "REJECTED"
        ? "Booking Rejected"
        : "Booking Confirmed";

  const description =
    status === "PENDING"
      ? "Your booking has been received."
      : status === "REJECTED"
        ? "Your booking has been rejected."
        : "Your booking is confirmed.";

  const statusMessage =
    status === "PENDING"
      ? "The team will review it and send the confirmation once it is approved."
      : status === "REJECTED"
        ? data.rejectionReason
          ? `Reason: ${data.rejectionReason}`
          : "Please contact the event organizer for more information."
        : "Keep this email for reference at the event.";

  const statusLabel = formatBookingStatus(status);

  const statusColor =
    status === "PENDING"
      ? "#B45309"
      : status === "REJECTED"
        ? "#B91C1C"
        : "#047857";

  const statusBg =
    status === "PENDING"
      ? "#FFFBEB"
      : status === "REJECTED"
        ? "#FEF2F2"
        : "#ECFDF5";

  const rows = buildEventBookingSummaryRows(data)
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 14px;background:#F8FAFC;border:1px solid #E2E8F0;font-weight:700;color:#0F172A;width:34%">${label}</td>
        <td style="padding:10px 14px;border:1px solid #E2E8F0;color:#1E293B">${escapeHtml(value)}</td>
      </tr>`,
    )
    .join("");

  return `
    <div style="margin:0;background:#F8FAFC;padding:24px">
      <div style="max-width:640px;margin:0 auto;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:18px;overflow:hidden;font-family:Arial,sans-serif;color:#0F172A">
        <div style="background:#0B1F33;padding:28px 24px;text-align:center">
          <img src="${getEmailAssetUrl("/Logos-SME-EVENTS.svg")}" alt="SME Events" height="52" style="display:block;margin:0 auto 14px" />
          <h1 style="margin:0;color:#FFFFFF;font-size:22px;line-height:1.3">${title}</h1>
        </div>

        <div style="padding:28px 24px">
          <p style="margin:0 0 12px;font-size:15px;color:#334155">
            Hello ${escapeHtml(data.attendeeName)},
          </p>

          <p style="margin:0 0 18px;font-size:14px;line-height:1.7;color:#475569">
            ${description}
          </p>

          <div
            style="display:inline-block;padding:8px 14px;border-radius:999px;background:${statusBg};color:${statusColor};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em"
          >
            ${statusLabel}
          </div>

          <p style="margin:14px 0 20px;font-size:14px;line-height:1.7;color:#475569">
            ${escapeHtml(statusMessage)}
          </p>

          <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:0 0 22px">
            ${rows}
          </table>

          <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;padding:16px 18px">
            <p style="margin:0;font-size:13px;color:#475569">
              Booked on ${data.bookedAt.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <p style="margin:20px 0 0;font-size:14px;color:#334155">
            Regards,<br />
            <strong>SME Events Team</strong>
          </p>
        </div>
      </div>
    </div>`;
}


function buildSimpleEventBookingHtml(
  data: EventBookingEmailData,
  status: EventBookingMailStatus,
) {
  const rows = buildEventBookingSummaryRows(data)
    .filter(([label]) => label !== "Approval")
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 12px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:700;width:32%">${label}</td>
          <td style="padding:8px 12px;border:1px solid #e5e7eb">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#0f172a;max-width:620px;margin:0 auto;padding:20px">
      <h2 style="margin:0 0 10px;font-size:20px;color:#0b1f33">Event booking ${formatBookingStatus(status)}</h2>
      <p style="margin:0 0 16px;color:#475569;line-height:1.6">A new booking update is available for review.</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%">
        ${rows}
      </table>
    </div>`;
}

export async function sendUserEventBookingMail(
  data: EventBookingEmailData,
  status: EventBookingMailStatus,
): Promise<void> {
  await createTransporter().sendMail({
    from: EVENT_MAIL_FROM,
    to: data.attendeeEmail,
    subject:
      status === "PENDING"
        ? `Booking received: ${data.eventName}`
        : status === "REJECTED"
          ? `Booking rejected: ${data.eventName}`
          : `Booking confirmed: ${data.eventName}`,
    html: buildEventBookingHtml(data, status),
  });
}

export async function sendAdminEventBookingMail(
  data: EventBookingEmailData,
  status: EventBookingMailStatus,
): Promise<void> {
  await createTransporter().sendMail({
    from: EVENT_MAIL_FROM,
    to: eventBookingAdminRecipient,
    replyTo: data.attendeeEmail || undefined,
    subject: `Event booking ${formatBookingStatus(status)}: ${data.eventName}`,
    html: buildSimpleEventBookingHtml(data, status),
  });
}
