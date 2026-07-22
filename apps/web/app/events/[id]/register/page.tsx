import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getEventById } from "../../../../lib/events";
import EventRegistrationForm from "../../../../components/EventTabs/events-section/EventRegistrationForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ticketId?: string }>;
};

export default async function EventRegisterPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { ticketId } = await searchParams;

  const event = await getEventById(Number(id));
  if (!event || !ticketId) notFound();

  const res = await fetch(`${API_URL}/events/${id}/pricing`, { cache: "no-store" });
  const json = await res.json();
  const tickets = json?.data || [];
  const ticket = tickets.find((t: any) => t.id === ticketId);

  if (!ticket) notFound();

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20 pt-28 md:pt-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/events/${id}`}
          className="text-sm font-bold text-[#008DD2] hover:text-[#007ab8] transition-colors inline-flex items-center gap-1 mb-6"
        >
          <ArrowLeft size={16} /> Back to event
        </Link>
        <EventRegistrationForm eventId={event.id} eventName={event.name} ticket={ticket} />
      </div>
    </div>
  );
}