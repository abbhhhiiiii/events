import Image from "next/image";
import { MapPin, Navigation } from "lucide-react";
import { SectionHeading } from "../../section-heading"; // Apna path verify kar lena

export function VenueSection({ 
  venue, 
  location, 
  galleryImages 
}: { 
  venue: any; 
  location: string; 
  galleryImages: string[] 
}) {
  if (!venue && !location && !(galleryImages?.length)) return null;

  // Safe variables fallback ke sath
  const venueName = venue?.name || location || "Event Venue";
  const venueAddress = venue?.address || location || "";
  const mapUrl = venue?.mapUrl || "";
  const notes = venue?.notes || "";
  const images = galleryImages || [];

  return (
    <section id="venue" className="scroll-mt-32 bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
      
      {/* Top Heading */}
      <SectionHeading
        eyebrow="Venue & Location"
        title={venueName}
        copy="Everything you need to know about getting to the event."
      />

      <div className="mt-10 flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* LEFT COLUMN: Details & Notes */}
        <div className="flex-1 space-y-8">
          
          {/* Address & Map Card */}
          {(venueAddress || mapUrl) && (
            <div className="bg-slate-50 p-5 sm:p-6 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm shrink-0 border border-slate-100">
                  <MapPin className="w-6 h-6 text-[#008DD2]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Location Address</h4>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed max-w-md">
                    {venueAddress}
                  </p>
                </div>
              </div>
              
              {/* Google Maps Button */}
              {mapUrl && (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-[#008DD2] hover:text-[#008DD2] hover:shadow-md text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-lg transition-all shrink-0 w-full sm:w-auto"
                >
                  <Navigation size={16} />
                  Get Directions
                </a>           
              )}
            </div>
          )}

          {/* Notes (Rich Text rendering) */}
          {notes && (
            <div className="pt-2">
              <h4 className="font-bold text-gray-900 mb-3 text-lg border-b border-gray-100 pb-2">
                Additional Information
              </h4>
              <div
                className="prose prose-gray prose-sm sm:prose-base max-w-none text-gray-600 leading-relaxed text-justify [&_a]:text-[#008DD2] hover:[&_a]:underline [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: notes }}
              />
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Venue Gallery Grid */}
        {images.length > 0 && (
          <div className="lg:w-1/2 w-full shrink-0">
            <div className={`grid gap-4 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  // Agar 3 images hain, toh pehli image badi dikhegi (span-2), baaki 2 niche choti.
                  className={`relative rounded-xl overflow-hidden border border-gray-200 shadow-sm group ${
                    images.length === 3 && idx === 0 
                      ? 'col-span-2 aspect-[21/9]' 
                      : 'aspect-square sm:aspect-[4/3]'
                  }`}
                >
                  <Image
                    src={imgUrl}
                    alt={`Venue image ${idx + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}