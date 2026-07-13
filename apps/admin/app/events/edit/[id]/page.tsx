import { notFound } from "next/navigation";
import { EventForm } from "../../../../components/event-form";
import { getAdminEvent } from "../../../../lib/api";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;
  const event = await getAdminEvent(id);

  if (!event) {
    notFound();
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <p style={{ textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 800 }}>Events</p>
          <h1>Edit Event</h1>
        </div>
      </div>
      <EventForm event={event} />
    </>
  );
}
