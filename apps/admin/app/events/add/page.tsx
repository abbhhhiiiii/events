import { EventForm } from "../../../components/event-form";

export default function AddEventPage() {
  return (
    <>
      <div className="bg-slate-900">
        <div>
          <p style={{ textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 800 }}>Events</p>
          <h1>Add Event</h1>
        </div>
      </div>
      <EventForm />
    </>
  );
}
