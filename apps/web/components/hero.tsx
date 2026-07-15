// import Image from "next/image";
// import Link from "next/link";
// import { Calendar, MapPin } from "lucide-react";
// import type { PlatformEvent } from "@events/types";

// export function Hero({
//   event,
//   detail = false,
// }: {
//   event: PlatformEvent;
//   detail?: boolean;
// }) {
//   const image =
//     event.image ||
//     "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2200&q=85";

//   const overview =
//     event.overview?.content ??
//     event.overview?.heading ??
//     "";

//   return (
//     <section className={`hero ${detail ? "detail-hero" : ""}`}>
//       <div className="site-shell hero-layout">
//         <div className="hero-copy-block">
//           <p className="event-label">SME EVENTS</p>

//           <h1>{event.name}</h1>

//           <p className="hero-date">
//             <Calendar size={16} />{" "}
//             {event.startDate
//               ? new Date(event.startDate).toLocaleDateString("en-IN", {
//                   day: "numeric",
//                   month: "short",
//                   year: "numeric",
//                 })
//               : ""}
//             <span /> <MapPin size={16} /> {event.location}
//           </p>

//           <p className="hero-copy">{overview}</p>

//           <Link className="btn btn-primary" href="#">
//             Register now
//           </Link>
//         </div>

//         <div className="hero-image">
//           <Image
//             src={image}
//             alt={event.name}
//             fill
//             priority
//             sizes="(max-width: 800px) 100vw, 60vw"
//           />
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Clock } from "lucide-react";
import type { PlatformEvent } from "@events/types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2200&q=85";

export function Hero({
  event,
  events,
  detail = false,
}: {
  event?: PlatformEvent;
  events?: PlatformEvent[];
  detail?: boolean;
}) {
  const displayEvents = events?.length ? events : event ? [event] : [];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide logic
  useEffect(() => {
    if (displayEvents.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displayEvents.length);
    }, 5000); // 5 seconds timer

    return () => clearInterval(interval);
  }, [displayEvents.length]);

  if (displayEvents.length === 0) {
    return null;
  }

  return (
    <section
      className={`relative w-full overflow-hidden bg-[#111] ${
        detail ? "h-[40vh] min-h-[400px]" : "h-[60vh] min-h-[650px]"
      }`}
    >
      {/* Sliding Track */}
      <div
        className="flex w-full h-full transition-transform duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {displayEvents.map((ev, index) => {
          const image = ev.image || FALLBACK_IMAGE;

          return (
            <div key={ev.id} className="min-w-full h-full relative">
              
              {/* Full Background Image */}
              <Image
                src={image}
                alt={ev.name}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />

              {/* Dark Gradient Overlay (Left se dark, right me transparent) */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent pointer-events-none" />

              {/* Content Box Container */}
              <div className="max-w-[1630px] mx-auto px-4 sm:px-6 lg:px-8 h-full relative z-10">
                
                {/* Left Aligned Content */}
                <div className="absolute top-1/2 -translate-y-1/2 max-w-2xl flex flex-col gap-5 text-white mt-8">
                  
                  {/* Small Event Label */}
                  <span className="bg-[#e31837] text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-widest w-fit shadow-lg">
                    {ev.type ?? "SME EVENT"}
                  </span>

                  {/* Title */}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] drop-shadow-md">
                    {ev.name}
                  </h1>

                  {/* Metadata (Date, Time, Location) */}
                  <div className="flex flex-wrap gap-6 items-center text-white/90 font-medium text-[17px]">
                    {ev.startDate && (
                      <div className="flex items-center gap-2">
                        <Calendar size={18} />
                        <span>
                          {new Date(ev.startDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}

                    {ev.startTime && (
                      <div className="flex items-center gap-2">
                        <Clock size={18} />
                        <span>{ev.startTime}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <MapPin size={18} />
                      <span>{ev.location}</span>
                    </div>
                  </div>

                  {/* Overview (Line Clamp 2 se sirf 2 lines dikhengi) */}
                  <p className="text-lg leading-relaxed text-white/85 line-clamp-2">
                    {ev.overview?.content ?? ev.overview?.heading ?? ""}
                  </p>

                  {/* CTA Button */}
                  <div className="mt-2">
                    <Link
                      href={detail ? "#book" : `/events/${ev.id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 font-semibold bg-white text-black rounded hover:bg-gray-200 transition-colors"
                    >
                      {detail ? "Book Tickets" : "Know More"} <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slider Navigation Dots */}
      {displayEvents.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
          {displayEvents.map((_, index) => (
            <button
              key={`dot-${index}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentIndex === index 
                  ? "bg-white scale-125" 
                  : "bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}