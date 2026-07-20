"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { SectionHeading } from "../../section-heading"; // Apna path verify kar lena

export function SpeakersSection({ speakers }: { speakers: any[] }) {
  const [selectedSpeaker, setSelectedSpeaker] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  // Next.js mein portal client-side pe render karne ke liye mounted check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Modal khulne par background scroll lock karne ke liye
  useEffect(() => {
    if (selectedSpeaker) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedSpeaker]);

  // Agar koi speakers nahi hain toh section hide kardo
  if (!speakers?.length) return null;

  return (
    <section id="speakers" className="scroll-mt-32 bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100">
      {/* Top Main Heading */}
      <SectionHeading
        eyebrow="Speakers"
        title="Featured voices."
        copy="Meet our experts, thought leaders, and featured speakers."
      />

      {/* SPEAKERS DISPLAY LOGIC */}
      <div className="mt-12 space-y-14">
        {speakers.map((section: any, sectionIndex: number) => (
          <div key={sectionIndex}>
            {/* SECTION HEADING (e.g. Chief Guests, Panelists) */}
            {section?.title && (
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="w-10 h-[1.5px] bg-[#008DD2] rounded-full" />
                  <h2 className="text-xl md:text-2xl font-semibold text-[#0b1c2e] tracking-wide">
                    {section.title}
                  </h2>
                  <span className="w-10 h-[1.5px] bg-[#008DD2] rounded-full" />
                </div>
              </div>
            )}

            {/* SPEAKER CARDS */}
            <div className="flex flex-wrap justify-center gap-y-8 gap-x-3 sm:gap-x-6">
              {(section.speakers || []).map((speaker: any, index: number) => (
                <div
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSpeaker(speaker);
                  }}
                  className="w-[45%] sm:w-[210px] md:w-[220px] p-2 sm:p-4 rounded-2xl transition text-center group cursor-pointer"
                >
                  {/* IMAGE */}
                  {speaker.image ? (
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full overflow-hidden mb-3 sm:mb-4 border-2 border-[#008DD2] group-hover:border-[#3cb6f3] transition">
                      <Image
                        src={speaker.image}
                        alt={speaker.name}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full bg-gray-200 flex items-center justify-center mb-3">
                      <span className="text-gray-400 text-2xl font-bold">
                        {speaker.name?.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* NAME */}
                  <h3 className="text-sm sm:text-base font-medium text-[#0b1c2e] leading-tight">
                    {speaker.name}
                  </h3>

                  {/* MULTIPLE ROLES */}
                  <div className="mt-2 space-y-1">
                    {(speaker.roles || []).map((role: any, i: number) => (
                      <p key={i} className="text-[10px] sm:text-xs leading-snug text-gray-500">
                        {role.designation}
                        {role.company && (
                          <>
                            {" | "}
                            {role.company}
                          </>
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* PORTAL MODAL (Pop-up on click) */}
      {mounted &&
        selectedSpeaker &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] bg-black/70 flex items-center justify-center p-4"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedSpeaker(null);
            }}
          >
            {/* OUTER MODAL */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl w-full max-w-2xl overflow-hidden relative shadow-2xl flex flex-col"
            >
              {/* Close Button */}
              <div className="absolute top-0 right-0 p-3 md:p-4 z-10">
                <button
                  onClick={() => setSelectedSpeaker(null)}
                  className="text-2xl md:text-3xl font-normal text-gray-400 hover:text-red-500 transition-colors leading-none"
                >
                  &times;
                </button>
              </div>

              {/* TOP SECTION: Image (Left) + Name & Roles (Right) */}
              <div className="flex w-full border-b border-gray-300">
                {/* IMAGE BLOCK */}
                <div className="p-3 md:p-4 flex justify-center items-center w-[100px] md:w-[130px] shrink-0">
                  {selectedSpeaker.image ? (
                    <Image
                      src={selectedSpeaker.image}
                      alt={selectedSpeaker.name}
                      width={120}
                      height={120}
                      className="object-cover rounded-full w-20 h-20 md:w-24 md:h-24 border-2 border-[#008DD2]"
                    />
                  ) : (
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-2xl font-bold">
                        {selectedSpeaker.name?.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* NAME & ROLE BLOCK */}
                <div className="flex-1 p-3 md:p-4 flex flex-col justify-center pr-8 md:pr-10 bg-white">
                  <h2 className="text-xl md:text-2xl font-serif text-black leading-tight mb-1">
                    {selectedSpeaker.name}
                  </h2>
                  {(selectedSpeaker.roles || []).map((role: any, index: number) => (
                    <p key={index} className="mt-0.5 md:mt-1 text-[12px] md:text-sm text-gray-700 leading-snug">
                      {role.designation}
                      {role.company && <> | {role.company}</>}
                    </p>
                  ))}
                </div>
              </div>

              {/* BOTTOM SECTION: SCROLLABLE DESCRIPTION */}
              {selectedSpeaker.description && (
                <div className="p-4 md:p-6 bg-white">
                  <div className="overflow-y-auto max-h-[40vh] md:max-h-[200px] pr-2">
                    <p className="text-xs md:text-sm leading-relaxed whitespace-pre-line text-black text-justify">
                      {selectedSpeaker.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}