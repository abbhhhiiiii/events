import Image from "next/image";
import { PlayCircle, Image as ImageIcon, Info } from "lucide-react";
import { SectionHeading } from "../../section-heading"; // Path verify kar lena

export function OverviewSection({ overview, eventName }: { overview: any; eventName: string }) {
  if (!overview) return null;

  const mainDescription = overview.mainDescription || overview.content || "";
  const highlights = overview.highlightBlocks || [];
  const features = overview.featureBlocks || [];
  const sponsoredVideos = overview.sponsoredVideos || [];
  const gallery = overview.gallery || [];
  const videoGallery = overview.videoGallery || [];

  return (
    <div id="overview" className="scroll-mt-32 space-y-8">
      

      <section className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
        <SectionHeading
          eyebrow="Overview"
          title={overview.heading ?? eventName}
          copy="Everything you need to know about this event."
        />
        
        {mainDescription && (
          <div className="mt-8">
            <div 
              className="prose prose-gray sm:prose-base max-w-none text-gray-600 leading-relaxed text-justify [&_p]:mb-4 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-[#008DD2] hover:[&_a]:underline"
              dangerouslySetInnerHTML={{ __html: mainDescription.replace(/&nbsp;/g, ' ') }}
            />
          </div>
        )}
      </section>


      {highlights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {highlights.map((block: any, idx: number) => (
            <section key={idx} className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#008DD2] opacity-0 group-hover:opacity-100 transition-opacity" />
              {block.title && (
                <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <Info className="text-[#008DD2]" size={20} />
                  {block.title}
                </h3>
              )}
              <div 
                className="prose prose-sm sm:prose-base max-w-none text-gray-600 text-justify leading-relaxed"
                dangerouslySetInnerHTML={{ __html: block.content || "" }}
              />
            </section>
          ))}
        </div>
      )}


      {features.length > 0 && (
        <div className="space-y-6">
          {features.map((block: any, idx: number) => (
            <section key={idx} className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 lg:gap-10 items-start">
              {block.image && (
                <div className="w-full md:w-1/3 lg:w-[40%] shrink-0 relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <Image src={block.image} alt={`Feature image ${idx + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div 
                className="flex-1 w-full prose prose-gray max-w-none text-gray-600 leading-relaxed text-justify mt-2 sm:mt-0"
                dangerouslySetInnerHTML={{ __html: block.content || "" }}
              />
            </section>
          ))}
        </div>
      )}


      {sponsoredVideos.length > 0 && (
        <section className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-8">
            <PlayCircle className="text-[#008DD2]" size={24} />
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">Featured Videos</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {sponsoredVideos.map((video: any, idx: number) => {
              const url = typeof video === 'string' ? video : video.videoUrl;
              const company = typeof video === 'string' ? '' : video.companyName;
              const link = typeof video === 'string' ? '' : video.websiteLink;
              
              return (
                <div key={idx} className="flex flex-col gap-4 group">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-gray-200 shadow-sm">
                    <video src={url} controls className="w-full h-full object-cover" preload="metadata" />
                  </div>
                  
                  {(company || link) && (
                    <div className="px-1">
                      {company && <h4 className="font-bold text-gray-900 text-sm md:text-base">{company}</h4>}
                      {link && (
                        <a 
                          href={link.startsWith('http') ? link : `https://${link}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-block mt-1 text-xs md:text-sm font-medium text-[#008DD2] hover:text-blue-700 hover:underline truncate w-full"
                        >
                          {link}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {(gallery.length > 0 || videoGallery.length > 0) && (
        <section className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-8">
            <ImageIcon className="text-[#008DD2]" size={24} />
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">Event Gallery</h3>
          </div>
          
          <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 snap-x scrollbar-hide -mx-2 px-2">
            
            {/* Images */}
            {gallery.map((img: string, idx: number) => (
              <div key={`img-${idx}`} className="shrink-0 w-[260px] h-[180px] sm:w-[320px] sm:h-[220px] relative rounded-xl overflow-hidden border border-gray-200 snap-center group shadow-sm">
                <Image 
                  src={img} 
                  alt={`Gallery ${idx + 1}`} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-500" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            ))}

            {/* Videos */}
            {videoGallery.map((vid: string, idx: number) => (
              <div key={`vid-${idx}`} className="shrink-0 w-[260px] h-[180px] sm:w-[320px] sm:h-[220px] relative rounded-xl overflow-hidden border border-gray-200 snap-center bg-black shadow-sm group">
                <video src={vid} controls className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" preload="metadata" />
              </div>
            ))}

          </div>
        </section>
      )}

    </div>
  );
}