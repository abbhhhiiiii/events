import { SectionHeading } from "../../section-heading"; // Apna path verify kar lena

export function GeneralInfoSection({ info }: { info: any }) {
  if (!info) return null;

  let content = "";

  if (Array.isArray(info)) {
    if (info.length === 0) return null;
    content = `<ul class="list-disc pl-5 space-y-2">` + info.map((item) => `<li>${item}</li>`).join("") + `</ul>`;
  } else if (typeof info === "object" && info !== null) {
    content = info.content || "";
  } else if (typeof info === "string") {
    content = info;
  }

 
  const isContentEmpty = !content || content.replace(/<[^>]*>?/gm, '').trim() === '';
  
  if (isContentEmpty) return null;

  return (
    <section id="general-info" className="scroll-mt-32 bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
      
      {/* Top Heading Component */}
      <SectionHeading
        eyebrow="General Info"
        title="Important Information"
        copy="Everything you need to know before attending the event."
      />

      {/* Rich Text Content Container */}
      <div className="mt-8 bg-slate-50/50 border border-slate-100 rounded-xl p-5 sm:p-8 shadow-sm">
        <div 
          className="prose prose-gray sm:prose-base max-w-none text-gray-700 leading-relaxed text-justify [&_a]:text-[#008DD2] hover:[&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-2 [&_p]:mb-4"
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      </div>
      
    </section>
  );
}