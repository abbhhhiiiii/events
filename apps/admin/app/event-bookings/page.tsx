import { listBookings } from "../../lib/api";

export const dynamic = "force-dynamic";

export default async function EventBookingsPage() {
  const bookings = await listBookings();

  return (
    <>
      <div className="admin-header">
        <div>
          <p style={{ textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 800 }}>Bookings</p>
          <h1>Event Bookings</h1>
        </div>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Attendee</th>
              <th>Email</th>
              <th>Event</th>
              <th>Ticket</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.attendeeName}</td>
                <td>{booking.email}</td>
                <td>{booking.event?.name ?? booking.eventId}</td>
                <td>{booking.ticket?.name ?? booking.ticketId ?? "Free"}</td>
                <td>{booking.status}</td>
                <td>{booking.amount}</td>
              </tr>
            ))}
            {!bookings.length ? (
              <tr>
                <td colSpan={6}>No bookings found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
