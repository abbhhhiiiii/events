import { SectionHeading } from "../../section-heading"; // Apna path verify kar lena

// Helper function to convert 24h format "14:30" to "02:30 PM"
function convertTo12Hour(timeStr: string) {
  if (!timeStr) return "";
  const [hourString, minute] = timeStr.split(":");
  let hour = parseInt(hourString, 10);
  if (isNaN(hour)) return timeStr;
  
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour ? hour : 12; // the hour '0' should be '12'
  const hourFormatted = hour < 10 ? `0${hour}` : hour;
  return `${hourFormatted}:${minute || '00'} ${ampm}`;
}

export function AgendaSection({ agenda, allSpeakers = [] }: { agenda: any[], allSpeakers?: any[] }) {
  if (!agenda?.length) return null;

  return (
    <section id="agenda" className="scroll-mt-32 bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
      
      {/* Top Heading */}
      <SectionHeading
        eyebrow="Event Schedule"
        title="Agenda & Timeline"
        copy="A detailed breakdown of sessions, timings, and speakers."
      />

      <div className="mt-10 space-y-0">
        {[...agenda]
          // Sort the agenda items safely based on timeFrom or time (legacy data)
          .sort((a, b) => {
            const timeA = a.timeFrom || a.time || "00:00";
            const timeB = b.timeFrom || b.time || "00:00";
            return timeA.localeCompare(timeB);
          })
          .map((item: any, index: number) => {
            // Handle legacy structure (flat time) and new structure (timeFrom, timeTo)
            const startTime = item.timeFrom || item.time || "";
            const endTime = item.timeTo || "";

            return (
              <div key={index}>
                {/* --------------------------------- */}
                {/* 1. MAIN AGENDA SESSION BLOCK      */}
                {/* --------------------------------- */}
                <div className="flex gap-3 sm:gap-4 group">
                  
                  {/* Left: Agenda Time */}
                  <div className="w-20 sm:w-32 flex-shrink-0 text-right pt-1">
                    <div className="text-[11px] sm:text-sm font-bold text-[#008DD2]">
                      {convertTo12Hour(startTime)}
                    </div>
                    {endTime && (
                      <div className="text-[10px] sm:text-xs font-medium text-gray-500">
                        to {convertTo12Hour(endTime)}
                      </div>
                    )}
                  </div>

                  {/* Middle: Timeline Dot + Line */}
                  <div className="flex flex-col items-center w-4 sm:w-6 flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-[#008DD2] mt-1.5 z-10 border-2 border-white shadow-sm" />
                    <div className="w-[2px] flex-1 min-h-[45px] bg-gray-100 group-last:bg-transparent mt-1" />
                  </div>

                  {/* Right: Agenda Content */}
                  <div className={`flex-grow ${item.description?.trim() || item.speakers?.length ? "pb-6" : "pb-8"}`}>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1.5 leading-relaxed max-w-3xl">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* --------------------------------- */}
                {/* 2. NESTED SPEAKERS FOR SESSION    */}
                {/* --------------------------------- */}
                {item.speakers?.map((speaker: any, speakerIndex: number) => {
                  // Find full speaker details from the main allSpeakers array
                  const speakerDetails = allSpeakers
                    ?.flatMap((section: any) => section.speakers || [])
                    .find((s: any) => s.name === speaker.name);

                  // Determine if this is the absolute last item in the whole timeline
                  const isLastSpeaker = speakerIndex === item.speakers.length - 1;
                  const isLastAgendaItem = index === agenda.length - 1;

                  return (
                    <div key={speakerIndex} className="flex gap-3 sm:gap-4">
                      
                      {/* Left: Speaker Specific Time */}
                      <div className="w-20 sm:w-32 flex-shrink-0 text-right pt-2">
                        {speaker.timeFrom && speaker.timeTo && (
                          <div className="text-[10px] sm:text-xs font-medium text-gray-400">
                            {convertTo12Hour(speaker.timeFrom)} - {convertTo12Hour(speaker.timeTo)}
                          </div>
                        )}
                      </div>

                      {/* Middle: Small Timeline Dot + Line */}
                      <div className="flex flex-col items-center w-4 sm:w-6 flex-shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2.5 z-10" />
                        <div className={`w-[2px] flex-1 min-h-[50px] mt-1 ${(isLastSpeaker && isLastAgendaItem) ? 'bg-transparent' : 'bg-gray-100'}`} />
                      </div>

                      {/* Right: Speaker Details Card */}
                      <div className="-mt-1 flex items-start gap-3 sm:gap-4 pb-8 flex-grow">
                        
                        {/* Speaker Avatar */}
                        {speakerDetails?.image ? (
                          <img
                            src={speakerDetails.image}
                            alt={speaker.name}
                            loading="lazy"
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-500">
                            {speaker.name?.charAt(0)}
                          </div>
                        )}

                        {/* Speaker Info */}
                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 sm:p-4 w-full max-w-2xl">
                          <p className="text-sm sm:text-base font-bold text-gray-900">
                            {speaker.name}
                          </p>
                          
                          {speakerDetails?.roles?.length > 0 && (
                            <div className="mt-1 space-y-0.5">
                              {speakerDetails.roles.map((role: any, roleIndex: number) => (
                                <p key={roleIndex} className="text-xs sm:text-sm text-gray-600 leading-tight">
                                  {role.designation} {role.company && <span className="text-gray-400 mx-1">|</span>} {role.company}
                                </p>
                              ))}
                            </div>
                          )}

                          {speaker.topic?.trim() && (
                            <div className="mt-3 pt-3 border-t border-slate-200/60">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Speaking On</span>
                              <p className="text-xs sm:text-sm font-medium text-gray-800 leading-relaxed">
                                "{speaker.topic}"
                              </p>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    </section>
  );
}