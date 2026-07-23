import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, MapPin } from "lucide-react";
import { getEventById } from "../../../lib/events";

import OverviewSection from "../../../components/EventTabs/events-section/Overview";
import { MediaKitSection } from "../../../components/EventTabs/events-section/MediaKit";
import AgendaSection from "../../../components/EventTabs/events-section/Agenda";
import { SpeakersSection } from "../../../components/EventTabs/events-section/Speakers";
import { SponsorsSection } from "../../../components/EventTabs/events-section/Sponsors";
import { VenueSection } from "../../../components/EventTabs/events-section/Venue";
import { GeneralInfoSection } from "../../../components/EventTabs/events-section/Info";
import { ContactSection } from "../../../components/EventTabs/events-section/Contact";
import EventBookingSection from "../../../components/EventTabs/events-section/EventBookingSection";

export const revalidate = 300;

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = await getEventById(Number(id));

  if (!event) {
    return { title: "Event Not Found" };
  }

  const overviewData = event.overview as any;

  return {
    title: `${event.name} | StayAtlas Events`,
    description: overviewData?.mainDescription?.substring(0, 160) || "Join us for this amazing event.",
    openGraph: {
      title: event.name,
      images: event.image ? [{ url: event.image }] : [],
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const event = await getEventById(Number(id));

  if (!event) {
    notFound();
  }

  // 1. DYNAMIC TABS LOGIC (Sirf wahi tabs banenge jinka data backend se aayega)
  const tabs = [];
  
  if (event.overview) tabs.push({ id: "overview", label: "Overview" });
  if (event.mediaKit) tabs.push({ id: "media-kit", label: "Media Kit" });
  if (event.agenda && event.agenda.length > 0) tabs.push({ id: "agenda", label: "Agenda" });
  if (event.speakers && event.speakers.length > 0) tabs.push({ id: "speakers", label: "Speakers" });
  if (event.sponsors && event.sponsors.length > 0) tabs.push({ id: "sponsors", label: "Sponsors" });
  if (event.venue) tabs.push({ id: "venue", label: "Venue" });
  if (event.info && (Array.isArray(event.info) ? event.info.length > 0 : (event.info as any)?.content)) {
    tabs.push({ id: "general-info", label: "General Info" });
  }
  if (event.contactUs) tabs.push({ id: "contact", label: "Contact Us" });

  const overviewData = event.overview as any;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.name,
    "startDate": event.startDate,
    "endDate": event.endDate,
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": event.location || "TBA",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": event.venue?.address || event.location || "TBA"
      }
    },
    "image": event.image ? [event.image] : [],
    "description": overviewData?.mainDescription || "Join this amazing event.",
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* HERO SECTION */}
      <div className="relative w-full h-[300px] md:h-[400px] bg-[#0b1c2e] overflow-hidden mt-20 md:mt-28">
        {event.image ? (
          <>
            <Image
              src={event.image}
              alt={event.name}
              fill
              className="object-cover opacity-50"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c2e] to-transparent opacity-80" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-[#0b1c2e]" />
        )}

        <div className="absolute bottom-8 left-4 md:left-8 lg:left-12 z-10 max-w-4xl">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
            {event.name}
          </h1>
          <div className="flex flex-wrap gap-4 text-gray-200 text-sm md:text-base">
            {event.startDate && (
              <span className="flex items-center gap-1.5">
                <Calendar size={18} /> {new Date(event.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            )}
            {event.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={18} /> {event.location}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      {tabs.length > 0 && (
        <div className="lg:hidden sticky top-[60px] md:top-[80px] z-40 bg-white border-b border-gray-200 shadow-sm overflow-x-auto scrollbar-hide">
          <div className="flex px-4 min-w-max">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={`#${tab.id}`}
                className="px-4 py-3.5 text-sm font-medium text-gray-600 hover:text-[#008DD2] whitespace-nowrap border-b-2 border-transparent hover:border-[#008DD2] transition-colors"
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* MAIN LAYOUT GRID */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-10 flex flex-col lg:flex-row gap-6 xl:gap-8 items-start">

        {/* COLUMN 1: LEFT SIDEBAR */}
        {tabs.length > 0 && (
          <aside className="hidden lg:block sticky top-32 w-56 xl:w-64 shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <nav className="flex flex-col py-2">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  href={`#${tab.id}`}
                  className="px-5 py-3 text-sm font-medium text-gray-600 hover:text-[#008DD2] hover:bg-blue-50/50 border-l-2 border-transparent hover:border-[#008DD2] transition-colors"
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
          </aside>
        )}

        {/* COLUMN 2: CENTER - Sirf available sections render honge */}
        <div className="flex-1 w-full min-w-0 space-y-12 md:space-y-16">
          {event.overview && (
            <div id="overview" className="scroll-mt-32">
              <OverviewSection overview={event.overview} />
            </div>
          )}

          {event.mediaKit && (
            <div id="media-kit" className="scroll-mt-32">
              <MediaKitSection mediaKit={event.mediaKit} />
            </div>
          )}

          {event.agenda && event.agenda.length > 0 && (
            <div id="agenda" className="scroll-mt-32">
              <AgendaSection agenda={event.agenda} allSpeakers={event.speakers} />
            </div>
          )}

          {event.speakers && event.speakers.length > 0 && (
            <div id="speakers" className="scroll-mt-32">
              <SpeakersSection speakers={event.speakers} />
            </div>
          )}

          {event.sponsors && event.sponsors.length > 0 && (
            <div id="sponsors" className="scroll-mt-32">
              <SponsorsSection sponsors={event.sponsors} />
            </div>
          )}

          {event.venue && (
            <div id="venue" className="scroll-mt-32">
              <VenueSection venue={event.venue} location={event.location} galleryImages={event.galleryImages} />
            </div>
          )}

          {event.info && (Array.isArray(event.info) ? event.info.length > 0 : (event.info as any)?.content) && (
            <div id="general-info" className="scroll-mt-32">
              <GeneralInfoSection info={event.info} />
            </div>
          )}

          {event.contactUs && (
            <div id="contact" className="scroll-mt-32">
              <ContactSection contactUs={event.contactUs} />
            </div>
          )}
        </div>

        {/* COLUMN 3: RIGHT SIDEBAR — Tickets */}
        <aside
          className="w-full lg:w-[320px] xl:w-[350px] shrink-0 sticky top-32 bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          id="book"
          aria-label="Book event"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Event Details</h3>
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Date</p>
                    <p>{event.startDate ? new Date(event.startDate).toLocaleDateString() : "TBA"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Time</p>
                    <p>{event.startTime ? `${event.startTime} - ${event.endTime}` : "TBA"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p>{event.location || "TBA"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-gray-100">
              <EventBookingSection event={event} />
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}