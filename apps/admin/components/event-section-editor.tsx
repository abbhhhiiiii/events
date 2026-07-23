"use client";

import type { EventSections, TicketTier } from "@events/types";
import Agenda from "./event-sections/Agenda";
import BookNow from "./event-sections/BookNow";
import ContactUs from "./event-sections/ContactUs";
import Info from "./event-sections/Info";
import MediaKit from "./event-sections/MediaKit";
import Overview from "./event-sections/Overview";
import Speakers from "./event-sections/Speakers";
import Sponsors from "./event-sections/Sponsors";
import Venue from "./event-sections/Venue";

type Props = { 
  sections: EventSections; 
  onChange: (value: EventSections) => void; 
  tickets: TicketTier[]; 
  onTicketsChange: (value: TicketTier[]) => void;
  activeTab: string;
};

export function EventSectionEditor({ sections, onChange, tickets, onTicketsChange, activeTab }: Props) {
  const set = <K extends keyof EventSections>(key: K, value: EventSections[K]) => 
    onChange({ ...sections, [key]: value });

  return (
    <div className="fade-in-animation">
      {activeTab === "overview" && <Overview data={sections.overview} onChange={value => set("overview", value)} />}
      {activeTab === "agenda" && <Agenda data={sections.agenda ?? []} onChange={value => set("agenda", value)} availableSpeakers={sections.speakers ?? []} />}
      {activeTab === "speakers" && <Speakers data={sections.speakers ?? []} onChange={value => set("speakers", value)} />}
      {activeTab === "sponsors" && <Sponsors data={sections.sponsors ?? []} onChange={value => set("sponsors", value)} />}
      {activeTab === "venue" && <Venue data={sections.venue} onChange={value => set("venue", value)} />}
      {activeTab === "mediaKit" && <MediaKit data={sections.mediaKit} onChange={value => set("mediaKit", value)} />}
      {activeTab === "contactUs" && <ContactUs data={sections.contactUs} onChange={value => set("contactUs", value)} />}
      {activeTab === "info" && <Info data={sections.info ?? []} onChange={value => set("info", value)} />}
      {activeTab === "book" && <BookNow data={sections.book} onChange={value => set("book", value)} tickets={tickets} onTicketsChange={onTicketsChange} />}
    </div>
  );
}