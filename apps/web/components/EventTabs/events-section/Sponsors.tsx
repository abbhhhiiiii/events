import Image from "next/image";
import { SectionHeading } from "../../section-heading"; // Apna path verify kar lena

export function SponsorsSection({ sponsors }: { sponsors: any[] }) {
  if (!sponsors?.length) return null;

  // Check if data is nested
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

      <div className="mt-12 space-y-16">
        {sectionsToRender.map((section, sIdx) => {
          // Skip sections without sponsors.
          if (!section.sponsors?.length) return null;

          return (
            <div key={sIdx} className="space-y-2">
              
              {/* Category Heading with Horizontal Line */}
              {section.sectionTitle && (
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-gray-700 text-sm sm:text-base whitespace-nowrap">
                    {section.sectionTitle}
                  </h3>
                  {/* Fill the remaining horizontal space with a line. */}
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
              )}

              {/* Sponsors Grid (Clean Layout with borders & hover scale) */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 items-center">
                {section.sponsors.map((sponsor: any, idx: number) => {
                  
                  // Sponsor Card UI
                  const sponsorCardContent = (
                    <div className="flex flex-col items-center justify-center h-24 sm:h-32 px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 hover:scale-105 transition-all duration-300 cursor-pointer group">
                      {sponsor.logo ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <Image
                            src={sponsor.logo}
                            alt={sponsor.name || "Sponsor Logo"}
                            fill
                            className="object-contain mix-blend-multiply p-2"
                          />
                        </div>
                      ) : (
                        <h4 className="font-bold text-sm sm:text-base text-gray-800 text-center">
                          {sponsor.name || "Partner"}
                        </h4>
                      )}
                    </div>
                  );

                  // Website URL check (handles both possible API properties)
                  const websiteUrl = sponsor.website || sponsor.websiteUrl;

                  // Wrap with a link when a website URL is available.
                  return websiteUrl ? (
                    <a
                      key={idx}
                      href={websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full"
                      title={sponsor.name}
                    >
                      {sponsorCardContent}
                    </a>
                  ) : (
                    <div key={idx} className="w-full" title={sponsor.name}>
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
