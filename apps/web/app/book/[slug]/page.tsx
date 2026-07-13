import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, CreditCard, Download, Ticket } from "lucide-react";
import { formatMoney } from "@events/utils";
import { getEventBySlug } from "../../../lib/events";

type Props = {
  params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
  title: "Checkout",
  description: "Select tickets, checkout, payment, success, and download ticket."
};

export default async function BookingPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <section className="section" style={{ paddingTop: 130 }}>
      <div className="site-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Booking</p>
            <h1>{event.name}</h1>
          </div>
          <p>Simple mobile-first flow: select ticket, checkout, payment, success, and download ticket.</p>
        </div>

        <div className="booking-grid booking-grid-checkout">
          <div className="booking-card">
            <p className="eyebrow">Select Ticket</p>
            {event.tickets.map((ticket, index) => (
              <label className="ticket-option" key={ticket.name}>
                <span>
                  <strong>{ticket.name}</strong>
                  <p>{ticket.description}</p>
                </span>
                <span>{formatMoney(ticket.price)}</span>
                <input type="radio" name="ticketId" value={ticket.id} aria-label={ticket.name} defaultChecked={index === 0} />
              </label>
            ))}

            <div style={{ display: "grid", gap: 12, marginTop: 22 }}>
              <input type="hidden" name="eventId" value={event.id} />
              <input aria-label="Full name" placeholder="Full name" />
              <input aria-label="Email" placeholder="Email" type="email" />
              <input aria-label="Phone" placeholder="Phone" />
              <select aria-label="Payment method" defaultValue="card">
                <option value="card">Credit / Debit Card</option>
                <option value="upi">UPI</option>
                <option value="invoice">Corporate Invoice</option>
              </select>
            </div>
          </div>

          <aside className="booking-card">
            <p className="eyebrow">Checkout</p>
            <h2>Order Summary</h2>
            <div className="card-meta">
              <span>
                <Ticket size={16} aria-hidden /> Ticket selection
              </span>
              <span>
                <CreditCard size={16} aria-hidden /> Secure payment
              </span>
              <span>
                <CheckCircle2 size={16} aria-hidden /> Success confirmation
              </span>
              <span>
                <Download size={16} aria-hidden /> Download ticket
              </span>
            </div>
            <button className="btn btn-primary" type="button" style={{ width: "100%" }}>
              Pay and Book <ArrowRight size={16} aria-hidden />
            </button>
            <Link className="btn btn-secondary" href={`/events/${event.slug}`} style={{ width: "100%", marginTop: 10 }}>
              Back to Event
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
