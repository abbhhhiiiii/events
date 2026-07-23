import { Mail, Phone, User } from "lucide-react";
import { SectionHeading } from "../../section-heading"; // Apna path verify kar lena

export function ContactSection({ contactUs }: { contactUs: any }) {
  if (!contactUs) return null;

  // Safe data extraction (Supports both legacy fields and new rich text content)
  const content = typeof contactUs === "string" ? contactUs : (contactUs.content || "");
  const email = contactUs.email || "";
  const phone = contactUs.phone || "";
  const person = contactUs.person || "";

  // Check if content is actually empty or just contains empty HTML tags like <p><br></p>
  const isContentEmpty = !content || content.replace(/<[^>]*>?/gm, '').trim() === '';

  // Do not render the section when no contact details are available.
  if (isContentEmpty && !email && !phone && !person) return null;

  return (
    <section id="contact" className="scroll-mt-32 bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
      
      <SectionHeading
        eyebrow="Contact & Support"
        title="Need help with this event?"
        copy="Our team is here to assist you with ticketing, media access, and general inquiries."
      />

      <div className="mt-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* LEFT/MAIN COLUMN: Rich Text Content */}
        <div className="flex-1 w-full min-w-0">
          {!isContentEmpty ? (
            <div 
              className="prose prose-gray sm:prose-base max-w-none text-gray-600 leading-relaxed text-justify [&_a]:text-[#008DD2] hover:[&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_p]:mb-4"
              dangerouslySetInnerHTML={{ __html: content }} 
            />
          ) : (
            <div className="h-full flex items-center justify-center lg:justify-start bg-gray-50 rounded-lg p-6 border border-dashed border-gray-200">
               <p className="text-gray-500 italic text-sm sm:text-base">Support information will be updated soon.</p>
            </div>
          )}
        </div>

{/*        
        {(email || phone || person) && (
          <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-3 sm:gap-4">
            
            {email && (
              <a 
                href={`mailto:${email}`} 
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-[#008DD2] hover:shadow-md transition-all group bg-slate-50/50 overflow-hidden"
              >
                <div className="bg-white p-2.5 rounded-full shadow-sm border border-gray-100 text-gray-400 group-hover:text-[#008DD2] transition-colors shrink-0">
                  <Mail size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wide">Email Us</p>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-[#008DD2] transition-colors truncate">
                    {email}
                  </p>
                </div>
              </a>
            )}

         
            {phone && (
              <a 
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`} 
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-[#008DD2] hover:shadow-md transition-all group bg-slate-50/50 overflow-hidden"
              >
                <div className="bg-white p-2.5 rounded-full shadow-sm border border-gray-100 text-gray-400 group-hover:text-[#008DD2] transition-colors shrink-0">
                  <Phone size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wide">Call Us</p>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-[#008DD2] transition-colors truncate">
                    {phone}
                  </p>
                </div>
              </a>
            )}

        
            {person && (
              <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-slate-50/50 overflow-hidden">
                <div className="bg-white p-2.5 rounded-full shadow-sm border border-gray-100 text-gray-400 shrink-0">
                  <User size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wide">Contact Person</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {person}
                  </p>
                </div>
              </div>
            )}
            
          </div>
        )} */}

      </div>
    </section>
  );
}
