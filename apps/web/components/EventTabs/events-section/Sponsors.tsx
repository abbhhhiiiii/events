import Image from "next/image";
import { SectionHeading } from "../../section-heading"; // Apna path verify kar lena

export function SponsorsSection({ sponsors }: { sponsors: any[] }) {
  if (!sponsors?.length) return null;


  const isNested = sponsors.some((s) => Array.isArray(s.sponsors));
  
 
  const sectionsToRender = isNested 
    ? sponsors 
    : [{ sectionTitle: "", sponsors: sponsors }];

  return (
    <section id="sponsors" className="scroll-mt-32 bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100">
      <SectionHeading
        eyebrow="Sponsors & Partners"
        title="Partner recognition."
        copy="Meet the amazing organizations making this event possible."
      />

      <div className="mt-12 space-y-12">
        {sectionsToRender.map((section, sIdx) => {
          // Agar section me koi sponsor nahi hai, toh usko skip karo
          if (!section.sponsors?.length) return null;

          return (
            <div key={sIdx}>
              {/* SECTION TITLE (e.g., Platinum Sponsors) */}
              {section.sectionTitle && (
                <div className="text-center mb-8">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 uppercase tracking-wider">
                    {section.sectionTitle}
                  </h3>
                  <div className="w-12 h-1 bg-[#008DD2] mx-auto mt-3 rounded-full" />
                </div>
              )}

              {/* SPONSORS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {section.sponsors.map((sponsor: any, idx: number) => {
                  
                  // Sponsor Card UI
                  const sponsorCardContent = (
                    <div className="h-24 sm:h-32 flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:border-[#008DD2] hover:shadow-md transition-all bg-slate-50/50 group relative overflow-hidden">
                      {sponsor.logo ? (
                        // IMAGE DISPLAY
                        <div className="relative w-full h-full flex items-center justify-center">
                          <Image
                            src={sponsor.logo}
                            alt={sponsor.name || "Sponsor Logo"}
                            fill
                            className="object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 p-2"
                          />
                        </div>
                      ) : (
                        // FALLBACK TEXT DISPLAY (If no image)
                        <span className="font-bold text-gray-700 text-center text-sm md:text-base group-hover:text-[#008DD2] transition-colors">
                          {sponsor.name || "Partner"}
                        </span>
                      )}
                    </div>
                  );

                  // Agar website link hai, toh a-tag se wrap karo, warna normal div
                  return sponsor.website ? (
                    <a
                      key={idx}
                      href={sponsor.website.startsWith('http') ? sponsor.website : `https://${sponsor.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                      title={sponsor.name}
                    >
                      {sponsorCardContent}
                    </a>
                  ) : (
                    <div key={idx} title={sponsor.name}>
                      {sponsorCardContent}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}