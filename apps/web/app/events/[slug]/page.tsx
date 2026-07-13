import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Download, Mail } from "lucide-react";
import { formatMoney } from "@events/utils";
import { Hero } from "../../../components/hero";
import { SectionHeading } from "../../../components/section-heading";
import { demoEvents, getEventBySlug } from "../../../lib/events";

export const revalidate = 300;

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return demoEvents.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return {};
  }

  return {
    title: event.seo.title,
    description: event.seo.description,
    alternates: {
      canonical: event.seo.canonical
    },
    openGraph: {
      title: event.seo.title,
      description: event.seo.description,
      images: event.heroImage ? [event.heroImage] : [],
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: event.seo.title,
      description: event.seo.description,
      images: event.heroImage ? [event.heroImage] : []
    }
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const tabs = [
    { label: "Overview", id: "overview", exists: event.sections.overview },
    { label: "Media Kit", id: "media-kit", exists: event.sections.mediaKit },
    { label: "Agenda", id: "agenda", exists: event.sections.agenda?.length },
    { label: "Speakers", id: "speakers", exists: event.sections.speakers?.length },
    { label: "Sponsors", id: "sponsors", exists: event.sections.sponsors?.length },
    { label: "Venue", id: "venue", exists: event.sections.venue },
    { label: "General Info", id: "general-info", exists: event.sections.info?.length },
    { label: "Contact Us", id: "contact", exists: event.sections.contactUs },
    { label: "Book Event", id: "book", exists: event.tickets.length }
  ].filter((tab) => Boolean(tab.exists));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    startDate: event.startDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.sections.venue?.name ?? event.location,
      address: event.location
    },
    image: event.heroImage,
    description: event.sections.overview?.content ?? event.shortDescription,
    offers: event.tickets.map((ticket) => ({
      "@type": "Offer",
      name: ticket.name,
      price: ticket.price,
      priceCurrency: "INR",
      availability: (ticket.quantity - (ticket.sold ?? 0)) > 0 ? "https://schema.org/InStock" : "https://schema.org/SoldOut"
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Hero event={event} detail />
      <div className="tabs">
        <nav className="site-shell" aria-label="Event sections">
          {tabs.map((tab) => (
            <a key={tab.id} href={`#${tab.id}`}>
              {tab.label}
            </a>
          ))}
        </nav>
      </div>

      <section className="section">
        <div className="site-shell detail-layout">
          <div>
            <section id="overview" className="info-panel">
              <p className="eyebrow">Overview</p>
              <h2>{event.sections.overview?.heading ?? event.name}</h2>
              <p>{event.sections.overview?.content ?? event.shortDescription}</p>
            </section>

            {event.sections.mediaKit ? (
              <section id="media-kit" className="section">
                <SectionHeading
                  eyebrow="Media Kit"
                  title={event.sections.mediaKit.title ?? "Press-ready event assets."}
                  copy={event.sections.mediaKit.description ?? "Give journalists, partners, and sponsors approved event material."}
                />
                <div className="info-panel">
                  {(event.sections.mediaKit.files ?? [{ label: "Download Media Kit", url: "#" }]).map((file) => (
                    <Link className="btn btn-secondary" href={file.url} key={file.label}>
                      <Download size={16} aria-hidden /> {file.label}
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {event.sections.agenda?.length ? (
              <section id="agenda" className="section">
                <SectionHeading
                  eyebrow="Agenda"
                  title="A polished program with clear timing."
                  copy="Agenda data is shown only when the event builder contains agenda items."
                />
                <div className="agenda-list">
                  {event.sections.agenda.map((item) => (
                    <article className="agenda-item" key={`${item.time}-${item.title}`}>
                      <strong>{item.time}</strong>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {event.sections.speakers?.length ? (
              <section id="speakers" className="section">
                <SectionHeading
                  eyebrow="Speakers"
                  title="Featured voices."
                  copy="Speaker cards use optimized images and compact credentials for quick scanning."
                />
                <div className="speaker-grid">
                  {event.sections.speakers.map((speaker) => (
                    <article className="speaker-card" key={speaker.name}>
                      <Image src={speaker.image} alt={speaker.name} width={96} height={96} />
                      <h3>{speaker.name}</h3>
                      <p>
                        {speaker.role}, {speaker.company}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {event.sections.sponsors?.length ? (
              <section id="sponsors" className="section">
                <SectionHeading
                  eyebrow="Sponsors"
                  title="Partner recognition."
                  copy="Sponsors are presented with restrained enterprise styling."
                />
                <div className="sponsor-grid">
                  {event.sections.sponsors.map((sponsor) => (
                    <span key={sponsor.name}>{sponsor.name}</span>
                  ))}
                </div>
              </section>
            ) : null}

            <section id="venue" className="section">
              <SectionHeading
                eyebrow="Venue"
                title={event.sections.venue?.name ?? event.location}
                copy={`${event.sections.venue?.address ?? event.location}. ${event.sections.venue?.notes ?? "Venue details, arrival instructions, and map embeds can be managed from the admin event builder."}`}
              />
              <div className="gallery-grid">
                {(event.gallery ?? []).map((image) => (
                  <Image key={image} src={image} alt="" width={900} height={620} loading="lazy" />
                ))}
              </div>
            </section>

            {event.sections.info?.length ? (
              <section id="general-info" className="section">
                <SectionHeading
                  eyebrow="General Information"
                  title="Everything attendees should know."
                  copy="Operational notes stay separate from marketing copy so visitors can find practical details quickly."
                />
                <div className="faq-grid">
                  {event.sections.info.map((item) => (
                    <article className="faq-card" key={item}>
                      <p>{item}</p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {event.sections.contactUs ? (
              <section id="contact" className="section">
                <div className="info-panel">
                  <p className="eyebrow">Contact Us</p>
                  <h2>Need help with this event?</h2>
                  <p>Our support team can help with ticketing, sponsor requests, media access, and venue questions.</p>
                  <a className="btn btn-secondary" href={`mailto:${event.sections.contactUs.email ?? "events@company.com"}`}>
                    <Mail size={16} aria-hidden /> {event.sections.contactUs.email ?? "events@company.com"}
                  </a>
                </div>
              </section>
            ) : null}
          </div>

          <aside className="booking-card" id="book" aria-label="Book event">
            <p className="eyebrow">Book Event</p>
            <h2>Select Ticket</h2>
            {event.tickets.map((ticket) => (
              <div className="ticket-option" key={ticket.name}>
                <div>
                  <strong>{ticket.name}</strong>
                  <p>{ticket.description}</p>
                </div>
                <strong>{formatMoney(ticket.price)}</strong>
              </div>
            ))}
            <Link className="btn btn-primary" href={`/book/${event.slug}`} style={{ width: "100%", marginTop: 18 }}>
              Continue to Checkout <ArrowRight size={16} aria-hidden />
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
