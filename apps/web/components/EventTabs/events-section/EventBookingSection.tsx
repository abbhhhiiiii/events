"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const GST_RATE = 0.18;

const addGst = (amount: number) =>
  Math.round(amount * (1 + GST_RATE) * 100) / 100;

export type EventTicket = {
  id: string;
  name: string;
  type: "PAID" | "FREE";
  audience: "ALL" | "MEMBER" | "GUEST";
  price: number;
  originalPrice?: number;
  currency: string;
  description?: string;
  features?: string[];
  requiresApproval: boolean;
  remaining: number;
};

export default function EventBookingSection({ event }: { event: any }) {
  const router = useRouter();
  const [tickets, setTickets] = useState<EventTicket[]>([]);
  const [selected, setSelected] = useState<EventTicket | null>(null);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [error, setError] = useState("");

  const bookingClosed = Boolean(
    event.bookingClosesAt && new Date(event.bookingClosesAt) <= new Date()
  );

  useEffect(() => {
    if (!API_URL) {
      setError("NEXT_PUBLIC_API_URL is not configured");
      setTicketsLoading(false);
      return;
    }
    setTicketsLoading(true);
    setError("");

    fetch(`${API_URL}/events/${event.id}/pricing`, { cache: "no-store" })
      .then(async (r) => {
        const x = await r.json();
        if (!r.ok) throw Error(x.error);
        return x.data;
      })
      .then((data: EventTicket[]) => {
        setTickets(data);
        if (data.length === 1) setSelected(data[0]);
      })
      .catch((e) => setError(e.message || "Unable to load tickets"))
      .finally(() => setTicketsLoading(false));
  }, [event.id]);

  const unavailable = (ticket: EventTicket) => bookingClosed || ticket.remaining < 1;

  const handleBookTicket = () => {
    if (!selected || bookingClosed) return;
    // Open the registration form and payment page.
    router.push(`/events/${event.id}/register?ticketId=${selected.id}`);
  };

  const TicketSkeleton = () => (
    <div className="rounded-xl border border-slate-200 p-4 animate-pulse space-y-2">
      <div className="h-4 w-1/2 bg-slate-200 rounded-full" />
      <div className="h-3 w-1/3 bg-slate-100 rounded-full" />
    </div>
  );

  if (ticketsLoading) {
    return (
      <div className="space-y-3">
        <TicketSkeleton />
        <TicketSkeleton />
      </div>
    );
  }

  if (error && tickets.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-center text-red-600 text-sm font-medium">
        {error}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center text-slate-500 text-sm font-medium">
        No tickets available for this event.
      </div>
    );
  }

  const tAmount = selected ? (selected.type === "FREE" ? 0 : selected.price || 0) : 0;
  const tPayableAmount = selected ? (selected.type === "FREE" ? 0 : addGst(tAmount)) : 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900">Select Ticket</h3>

      <div className="space-y-2.5">
        {tickets.map((ticket) => {
          const disabled = unavailable(ticket);
          const isSelected = selected?.id === ticket.id;
          const price = ticket.type === "FREE" ? 0 : ticket.price || 0;

          return (
            <button
              key={ticket.id}
              type="button"
              disabled={disabled}
              onClick={() => {
                setSelected(ticket);
                setError("");
              }}
              className={`w-full text-left rounded-xl border p-3.5 transition-all flex items-center justify-between gap-3 ${
                isSelected
                  ? "border-[#008DD2] ring-2 ring-blue-50 bg-blue-50/40"
                  : "border-slate-200 hover:border-slate-300"
              } ${disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : "cursor-pointer"}`}
            >
              <div className="min-w-0">
                <p className="font-bold text-sm text-[#0b1c2e] truncate">{ticket.name}</p>
                {disabled && (
                  <p className="text-[11px] font-semibold text-red-500 mt-0.5">
                    {bookingClosed ? "Booking Closed" : "Sold Out"}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-extrabold text-sm text-[#008DD2]">
                  {price === 0 ? "FREE" : `₹${price.toLocaleString("en-IN")}`}
                </span>
                {isSelected && <CheckCircle2 size={18} className="text-[#008DD2]" />}
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="rounded-xl bg-[#f8f9fa] border border-slate-100 p-4">
          <div className="space-y-2 text-xs font-medium text-slate-600">
            <div className="flex justify-between items-center">
              <span>Subtotal</span>
              <span className="font-bold text-slate-700">
                {tAmount === 0 ? "FREE" : `₹${tAmount.toLocaleString("en-IN")}`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>GST (18%)</span>
              <span className="font-bold text-rose-500">
                +{tPayableAmount > tAmount ? `₹${(tPayableAmount - tAmount).toLocaleString("en-IN")}` : "₹0"}
              </span>
            </div>
          </div>
          <div className="border-t border-slate-200 my-2.5" />
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm text-[#0b1c2e]">Total Payable</span>
            <span className="font-extrabold text-sm text-[#0b1c2e]">
              {tPayableAmount === 0 ? "FREE" : `₹${tPayableAmount.toLocaleString("en-IN")}`}
            </span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleBookTicket}
        disabled={!selected || bookingClosed}
        className="w-full bg-[#008DD2] hover:bg-[#0074b0] text-white font-bold py-3.5 px-4 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {bookingClosed ? "Booking Closed" : "Book Ticket"}
      </button>
    </div>
  );
}
