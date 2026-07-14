import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, CreditCard, Download, Ticket, Calendar, MapPin } from "lucide-react";
import { formatMoney } from "@events/utils";
import { getEventById } from "../../../lib/events";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Checkout",
  description: "Select tickets, checkout, payment, success, and download ticket."
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2200&q=85";

export default async function BookingPage({ params }: Props) {
  const { id } = await params;
  const event = await getEventById(Number(id));

  if (!event) {
    notFound();
  }

  const image = event.image || FALLBACK_IMAGE;
  const tickets = event.tickets ?? [];

  return (
    <section className="section" style={{ paddingTop: 130, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <div className="site-shell">
        <div className="section-heading" style={{ marginBottom: "2rem" }}>
          <div>
            <p className="eyebrow" style={{ color: "var(--brand-color, #e11d48)", fontWeight: 600 }}>Secure Booking</p>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Complete Your Registration</h1>
          </div>
          <p style={{ fontSize: "1.1rem", color: "#64748b" }}>
            Select your ticket and fill in your details to secure your spot at {event.name}.
          </p>
        </div>

        <div className="booking-grid booking-grid-checkout" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)", gap: "2rem", alignItems: "start" }}>
          
          {/* LEFT COLUMN - Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* Step 1: Ticket Selection */}
            <div className="booking-card" style={{ backgroundColor: "#fff", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <div style={{ backgroundColor: "#1e293b", color: "#fff", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.875rem" }}>1</div>
                <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Select Ticket</h2>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {tickets.length > 0 ? tickets.map((ticket, index) => (
                  <label 
                    className="ticket-option" 
                    key={ticket.name}
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between",
                      padding: "1.25rem", 
                      border: "1px solid #cbd5e1", 
                      borderRadius: "8px", 
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      backgroundColor: "#f8fafc"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <input 
                        type="radio" 
                        name="ticketId" 
                        value={ticket.id} 
                        aria-label={ticket.name} 
                        defaultChecked={index === 0} 
                        style={{ width: "1.25rem", height: "1.25rem", accentColor: "var(--brand-color, #e11d48)" }}
                      />
                      <span>
                        <strong style={{ display: "block", fontSize: "1.1rem", marginBottom: "0.25rem", color: "#0f172a" }}>{ticket.name}</strong>
                        <p style={{ margin: 0, fontSize: "0.875rem", color: "#64748b" }}>{ticket.description}</p>
                      </span>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "#0f172a" }}>{formatMoney(ticket.price)}</span>
                  </label>
                )) : (
                  <p style={{ color: "#ef4444", padding: "1rem", backgroundColor: "#fef2f2", borderRadius: "8px" }}>No tickets available for this event.</p>
                )}
              </div>
            </div>

            {/* Step 2: Attendee Details */}
            <div className="booking-card" style={{ backgroundColor: "#fff", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <div style={{ backgroundColor: "#1e293b", color: "#fff", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.875rem" }}>2</div>
                <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Attendee Details</h2>
              </div>

              <div style={{ display: "grid", gap: "1.25rem" }}>
                <input type="hidden" name="eventId" value={event.id} />
                
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem", color: "#334155" }}>Full Name</label>
                  <input aria-label="Full name" placeholder="e.g. John Doe" style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" }} />
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem", color: "#334155" }}>Email Address</label>
                    <input aria-label="Email" placeholder="john@company.com" type="email" style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem", color: "#334155" }}>Phone Number</label>
                    <input aria-label="Phone" placeholder="+91 98765 43210" style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem", color: "#334155" }}>Payment Method</label>
                  <select aria-label="Payment method" defaultValue="card" style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none", backgroundColor: "#fff" }}>
                    <option value="card">Credit / Debit Card</option>
                    <option value="upi">UPI</option>
                    <option value="invoice">Corporate Invoice</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN - Order Summary (Sticky) */}
          <aside className="booking-card" style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", border: "1px solid #e2e8f0", position: "sticky", top: "100px" }}>
            <p className="eyebrow" style={{ marginBottom: "1rem" }}>Order Summary</p>
            
            {/* Event Image & Details Preview */}
            <div style={{ marginBottom: "1.5rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "1.5rem" }}>
              <div style={{ position: "relative", width: "100%", height: "140px", borderRadius: "8px", overflow: "hidden", marginBottom: "1rem" }}>
                <Image src={image} alt={event.name} fill style={{ objectFit: "cover" }} />
              </div>
              <h3 style={{ fontSize: "1.125rem", margin: "0 0 0.75rem 0", lineHeight: 1.3 }}>{event.name}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.875rem", color: "#64748b" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Calendar size={14} /> {event.startDate ? new Date(event.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "TBA"}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><MapPin size={14} /> {event.location}</span>
              </div>
            </div>

            <div className="card-meta" style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem", color: "#475569", marginBottom: "2rem" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Ticket size={16} style={{ color: "var(--brand-color, #e11d48)" }} aria-hidden /> Official Ticket
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <CreditCard size={16} style={{ color: "var(--brand-color, #e11d48)" }} aria-hidden /> Secure 256-bit encryption
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <CheckCircle2 size={16} style={{ color: "var(--brand-color, #e11d48)" }} aria-hidden /> Instant confirmation
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Download size={16} style={{ color: "var(--brand-color, #e11d48)" }} aria-hidden /> Digital download
              </span>
            </div>

            <button className="btn btn-primary" type="button" style={{ width: "100%", padding: "0.875rem", fontSize: "1rem", fontWeight: 600, display: "flex", justifyContent: "center", gap: "0.5rem" }}>
              Pay and Book <ArrowRight size={18} aria-hidden />
            </button>
            <Link className="btn btn-secondary" href={`/events/${event.id}`} style={{ width: "100%", marginTop: 12, display: "flex", justifyContent: "center", backgroundColor: "transparent", border: "1px solid #cbd5e1" }}>
              Back to Event
            </Link>
          </aside>

        </div>
      </div>
    </section>
  );
}