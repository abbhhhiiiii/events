import { Download, FileText } from "lucide-react";
import { SectionHeading } from "../../section-heading"; // Apna path verify kar lena

export function MediaKitSection({ mediaKit }: { mediaKit: any }) {
  if (!mediaKit) return null;

  // Safe extraction for both NEW (content, brochureUrl) and OLD (description, files, videos) data
  const content = mediaKit.content || mediaKit.description || "";
  const brochureUrl = mediaKit.brochureUrl || mediaKit.files?.[0]?.url || "";
  const legacyVideos = mediaKit.videos || [];
  const title = mediaKit.title || "Media Kit & Resources";

  // Do not render an empty tab.
  if (!content && !brochureUrl && legacyVideos.length === 0) return null;

  return (
    <section id="media-kit" className="scroll-mt-32 bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
      
      <SectionHeading
        eyebrow="Media Kit"
        title={title}
        copy="Download official brochures and press materials."
      />
      
      <div className="mt-8 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        
        {/* LEFT: Main Rich Text Content */}
        {content && (
          <div className="flex-1 w-full min-w-0">
            <div 
              className="prose prose-gray sm:prose-base max-w-none text-gray-600 leading-relaxed text-justify [&_a]:text-[#008DD2] hover:[&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_p]:mb-4"
              dangerouslySetInnerHTML={{ __html: content }} 
            />
          </div>
        )}

        {/* RIGHT: Download Brochure Card */}
        {brochureUrl && (
          <div className="shrink-0 w-full lg:w-1/3 bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col gap-4 shadow-sm">
            <div>
              <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-1">
                <FileText size={20} className="text-[#008DD2]" /> Official Document
              </h4>
              <p className="text-xs text-gray-500">Available in PDF format for direct download.</p>
            </div>
            
            <a 
              href={brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex justify-center items-center gap-2 px-6 py-3.5 bg-[#008DD2] text-white text-sm font-bold rounded-lg hover:bg-[#0074b0] transition-colors shadow-sm"
            >
              <Download size={18} /> Download Brochure
            </a>
          </div>
        )}
      </div>

      {/* Legacy videos are shown only when they were already saved on the event. */}
      {legacyVideos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 pt-8 border-t border-slate-100">
          {legacyVideos.map((video: string, idx: number) => (
            <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-black border border-gray-200 shadow-sm">
              <video src={video} controls preload="metadata" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

    </section>
  );
}
