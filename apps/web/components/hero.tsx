import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import type { PlatformEvent } from "@events/types";

export function Hero({ event, detail = false }: { event: PlatformEvent; detail?: boolean }) {
  const hasVideo = Boolean(event.heroVideo);
  const heroImage =
    event.heroImage ??
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2200&q=85";
  const overviewCopy = event.sections.overview?.content ?? event.shortDescription;

  return (
    <section className={`hero ${detail ? "detail-hero" : ""}`}>
      <div className="hero-media" aria-hidden>
        {hasVideo ? (
          <video autoPlay muted loop playsInline poster={heroImage}>
            <source src={event.heroVideo} type="video/mp4" />
          </video>
        ) : (
          <Image src={heroImage} alt="" fill priority sizes="100vw" />
        )}
      </div>
      <div className="site-shell hero-content">
        <p className="eyebrow">{event.category} Event</p>
        <h1>{event.name}</h1>
        <p className="hero-copy">{detail ? overviewCopy : event.shortDescription}</p>
        <div className="hero-meta" aria-label="Event details">
          <span className="meta-chip">
            <Calendar size={17} aria-hidden /> {new Date(event.startDate).toLocaleDateString("en-IN")}
          </span>
          <span className="meta-chip">
            <Clock size={17} aria-hidden /> {event.time}
          </span>
          <span className="meta-chip">
            <MapPin size={17} aria-hidden /> {event.location}
          </span>
        </div>
        <div className="hero-actions">
          <Link className="btn btn-primary" href={`/book/${event.slug}`}>
            Register Now <ArrowRight size={16} aria-hidden />
          </Link>
          <Link className="btn btn-ghost" href="/#upcoming">
            Explore Events
          </Link>
        </div>
      </div>
    </section>
  );
}
