import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import type { PlatformEvent } from "@events/types";

export function EventCard({ event }: { event: PlatformEvent }) {
  const heroImage =
    event.heroImage ??
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=85";

  return (
    <article className="event-card">
      <Link href={`/events/${event.slug}`} className="event-card-media" aria-label={`View ${event.name}`}>
        <Image src={heroImage} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" />
        <span className="status-badge">{event.status}</span>
      </Link>
      <div className="event-card-body">
        <p className="eyebrow">{event.category}</p>
        <h3>{event.name}</h3>
        <p>{event.shortDescription}</p>
        <div className="card-meta">
          <span>
            <Calendar size={16} aria-hidden /> {new Date(event.startDate).toLocaleDateString("en-IN")}
          </span>
          <span>
            <Clock size={16} aria-hidden /> {event.time}
          </span>
          <span>
            <MapPin size={16} aria-hidden /> {event.location}
          </span>
        </div>
        <Link className="btn btn-primary" href={`/events/${event.slug}`}>
          Register <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </article>
  );
}
