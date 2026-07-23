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

// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Calendar, MapPin, ArrowRight, Clock } from "lucide-react";
// import type { PlatformEvent } from "@events/types";

// const FALLBACK_IMAGE =
//   "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2200&q=85";

// export function Hero({
//   event,
//   events,
//   detail = false,
// }: {
//   event?: PlatformEvent;
//   events?: PlatformEvent[];
//   detail?: boolean;
// }) {
//   const displayEvents = events?.length ? events : event ? [event] : [];
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Auto-slide logic
//   useEffect(() => {
//     if (displayEvents.length <= 1) return;

//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % displayEvents.length);
//     }, 5000); // 5 seconds timer

//     return () => clearInterval(interval);
//   }, [displayEvents.length]);

//   if (displayEvents.length === 0) {
//     return null;
//   }

  

//   return (
//   <section
//   className={`relative w-full overflow-hidden bg-[#111] ${
//     detail
//       ? "h-[25vh] min-h-[250px] md:h-[40vh] md:min-h-[400px]"
//       : "h-[40vh] min-h-[500px] md:h-[60vh] md:min-h-[650px]"
//   }`}
// >
//       {/* Sliding Track */}
//       <div
//         className="flex w-full h-full transition-transform duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
//         style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//       >
//         {displayEvents.map((ev, index) => {
//           const image = ev.image || FALLBACK_IMAGE;

// const description = (
//   ev.overview?.content ??
//   ev.overview?.heading ??
//   ""
// )
//   .replace(/<[^>]*>/g, "")   // HTML tags remove
//   .replace(/&nbsp;/g, " ")   // Replace non-breaking spaces with regular spaces.
//   .replace(/&amp;/g, "&")    // optional
//   .replace(/\s+/g, " ")      // extra spaces remove
//   .trim();
//           return (
//             <div key={ev.id} className="min-w-full h-full relative">
              
//               {/* Full Background Image */}
//               <Image
//                 src={image}
//                 alt={ev.name}
//                 fill
//                 priority={index === 0}
//                 sizes="100vw"
//                 className="object-cover"
//               />

//               {/* Dark gradient overlay: dark on the left and transparent on the right. */}
//               <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50 pointer-events-none" />

//               {/* Content Box Container */}
//            <div className="max-w-[1630px] mx-auto px-5 sm:px-6 lg:px-8 h-full relative z-10">
//   <div
//     className="
//       absolute
//       left-5
//       right-5
//       top-1/2
//       -translate-y-1/2
//       md:left-0
//       md:right-auto
//       max-w-2xl
//       flex
//       flex-col
//       gap-2 
//       md:gap-5
//       text-white
//     "
//   >
//     {/* Badge */}
//     <span className="bg-[#e31837] text-white px-2 py-1 rounded-sm text-[10px] md:text-xs font-bold uppercase tracking-widest w-fit">
//       {ev.type ?? "SME EVENT"}
//     </span>

//     {/* Title */}
//     <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-snug md:leading-tight">
//       {ev.name}
//     </h1>

//     {/* Meta Info (Date, Time, Location) */}
//    {/* Metadata container: use a column layout to place the location below. */}
// <div className="flex flex-col gap-1.5 md:gap-2 text-xs sm:text-sm md:text-base text-white/90">
  
//   {/* Row 1: date and time */}
//   <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
//     {ev.startDate && (
//       <div className="flex items-center gap-1.5">
//         <Calendar size={14} className="md:w-5 md:h-5" />
//         <span>
//           {new Date(ev.startDate).toLocaleDateString("en-IN", {
//             day: "numeric",
//             month: "long",
//             year: "numeric",
//           })}
//         </span>
//       </div>
//     )}

//     {ev.startTime && (
//       <div className="flex items-center gap-1.5">
//         <Clock size={14} className="md:w-5 md:h-5" />
//         <span>{ev.startTime}</span>
//       </div>
//     )}
//   </div>

//   {/* Row 2: always place the location on a new line. */}
//   {ev.location && (
//     <div className="flex items-start md:items-center gap-1.5">
//       <MapPin size={14} className="md:w-5 md:h-5 shrink-0 mt-0.5 md:mt-0" />
//       <span className="line-clamp-1">{ev.location}</span>
//     </div>
//   )}
  
// </div>

//     {/* Description */}
//     <p className="text-xs sm:text-sm md:text-lg leading-relaxed text-white/85 line-clamp-2">
//       {description}
//     </p>

//     {/* Button */}
//     <div className="pt-1 md:pt-2">
//       <Link
//         href={detail ? "#book" : `/events/${ev.id}`}
//         className="inline-flex items-center gap-1.5 px-4 py-2 md:px-5 md:py-3 text-sm md:text-base bg-white text-black rounded-md md:rounded-lg font-semibold hover:bg-gray-200 transition"
//       >
//         {detail ? "Book Tickets" : "Know More"}
//         <ArrowRight size={16} className="md:w-5 md:h-5" />
//       </Link>
//     </div>
//   </div>
// </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Slider Navigation Dots */}
//       {displayEvents.length > 1 && (
//         <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
//           {displayEvents.map((_, index) => (
//             <button
//               key={`dot-${index}`}
//               onClick={() => setCurrentIndex(index)}
//               aria-label={`Go to slide ${index + 1}`}
//               className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
//                 currentIndex === index 
//                   ? "bg-white scale-125" 
//                   : "bg-white/40 hover:bg-white/70"
//               }`}
//             />
//           ))}
//         </div>
//       )}
//     </section>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const slides = [
    {
      img: "/1 (2).png",
      heading: "India's SME Banking Hub",
      subtext: "Unlock exclusive financial insights and networking opportunities with industry stalwarts.",
      cta: "Register Now"
    },
    {
      img: "/1 (3).png",
      heading: "Your Next Big Connection",
      subtext: "Join 500+ entrepreneurs, investors, and leaders to shape the future of your business.",
      cta: "Book Your Spot"
    },
    {
      img: "/1 (1).png",
      heading: "Scale Your Vision",
      subtext: "Empower your business with strategic mentorship and proven growth frameworks.",
      cta: "Explore Agenda"
    }
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000); // Thoda slow kiya taki log padh sakein
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[85vh] bg-[#0a0a0a] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === i ? "opacity-100" : "opacity-0"}`}
        >
          <Image src={slide.img} alt="Event" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 z-10 flex items-center max-w-[1630px] mx-auto px-6 lg:px-12">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute flex flex-col gap-6 max-w-xl transition-all duration-1000 ${
              index === i ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <span className="text-[#e31837] font-bold tracking-[0.2em] uppercase text-sm">
              Upcoming Networking Summit
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1]">
              {slide.heading}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed">
              {slide.subtext}
            </p>
            <div className="flex gap-4 pt-4">
              <Link
                href="/events/upcoming-events"
                className="group flex items-center gap-2 bg-[#e31837] text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-red-700 transition-all"
              >
                {slide.cta}
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Indicators */}
      <div className="absolute bottom-10 left-12 z-20 flex gap-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1 transition-all duration-500 ${index === i ? "w-16 bg-[#e31837]" : "w-8 bg-white/30"}`}
          />
        ))}
      </div>
    </section>
  );
}
