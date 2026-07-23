"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Volume2, VolumeX, ArrowUpRight } from "lucide-react";
import { normalizeRichTextWrapping } from "../utils";

const youtubeEmbedBaseUrl = process.env.NEXT_PUBLIC_YOUTUBE_EMBED_BASE_URL;

// Helper: YouTube URL to Embed URL converter
const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return "";
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
  
  if (match && match[1]) {
    const videoId = match[1];
    // Exactly like gallery - no autoplay to prevent blocking
    return youtubeEmbedBaseUrl
      ? `${youtubeEmbedBaseUrl.replace(/\/$/, "")}/${videoId}?controls=1&modestbranding=1&rel=0`
      : "";
  }
  return url;
};

// Sub-Component: Har video ko individually handle karne ke liye
const SponsoredVideoCard = ({ item }: { item: any }) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isString = typeof item === 'string';
  
  // Extract URL safely
  const url = isString ? item : (item?.videoUrl || item?.url || item?.video || item?.link || "");
  const companyName = isString ? "" : (item?.companyName || "");
  let websiteLink = isString ? "" : (item?.websiteLink || "");

  if (websiteLink && !/^https?:\/\//i.test(websiteLink)) {
    websiteLink = `https://${websiteLink}`;
  }

  const isYouTube = url?.includes("youtube.com") || url?.includes("youtu.be");

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (!url) return null;

  return (
    <div className="flex flex-col items-center w-full group relative">
      <div className="relative w-full h-56 md:h-64 rounded-xl overflow-hidden shadow-sm bg-black border border-slate-200">
        
        {/* Uploaded Local Videos ke liye hi Mute button aayega */}
        {!isYouTube && (
          <button
            onClick={toggleMute}
            className="absolute top-3 right-3 z-30 bg-black/60 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/80 flex items-center justify-center cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        )}

        {/* Company Name Overlay */}
        {companyName && (
          <div className="absolute top-3 left-3 z-30 pointer-events-auto"> 
            {websiteLink ? (
              <a 
                href={websiteLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-black/80 transition-colors no-underline shadow-lg"
              >
                {companyName}
                <ArrowUpRight size={16} />
              </a>
            ) : (
              <span className="bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-semibold inline-block shadow-lg">
                {companyName}
              </span>
            )}
          </div>
        )}

        {/* DYNAMIC VIDEO RENDERER */}
        {isYouTube ? (
          // EXACTLY same as Gallery
          <iframe
            src={getYouTubeEmbedUrl(url)}
            className="w-full h-full border-0"
            allow="encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            title="Sponsored Video"
          />
        ) : (
          // EXACTLY same for Local Uploaded Videos
          <video
            ref={videoRef}
            src={url}
            autoPlay
            loop
            muted 
            playsInline
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default function OverviewTab({ overview }: { overview: any }) {
  const hasGallery = overview.gallery?.length > 0 || overview.videoGallery?.length > 0;

  return (
    <div className="space-y-12">
      {/* Main Description */}
      {overview.mainDescription && (
        <div className="mt-8">
            <div 
              className="prose prose-gray sm:prose-base max-w-none text-gray-600 leading-relaxed text-justify [&_p]:mb-4 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-[#008DD2] hover:[&_a]:underline"
              dangerouslySetInnerHTML={{ __html: overview.mainDescription.replace(/&nbsp;/g, ' ') }}
            />
          </div>
      )}

      {/* Highlight Blocks */}
      {overview.highlightBlocks?.length > 0 && (
        <div className="space-y-6">
          {overview.highlightBlocks.map(
            (item: any, index: number) =>
              (item.title || item.content) && (
                <div key={index} className="bg-blue-50 border-l-4 border-[#008DD2] p-6 rounded-r-lg">
                  {item.title && <h3 className="font-bold text-[#0b1c2e] text-lg mb-4">{item.title}</h3>}
                  {item.content && (
                    <div
                      className="event-rich-text space-y-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:ml-2"
                      dangerouslySetInnerHTML={{
                        __html: normalizeRichTextWrapping(item.content),
                      }}
                    />
                  )}
                </div>
              )
          )}
        </div>
      )}

      {/* Content Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {overview.featureBlocks?.map((block: any, index: number) => (
          <div key={index} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition">
            {block.image && (
              <div className="relative w-full h-64">
                <Image src={block.image} alt={`Feature ${index}`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
            )}
            {block.content && (
              <div className="p-6">
                <div
                  className="event-rich-text space-y-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:ml-2 [&_p]:mb-2"
                  dangerouslySetInnerHTML={{
                    __html: normalizeRichTextWrapping(block.content),
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sponsored Videos Section */}
      {overview.sponsoredVideos?.length > 0 && (
        <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h3 className="font-bold text-[#0b1c2e] text-xl mb-2">
            Sponsored Videos
          </h3>
          {/* Grid updated to show 3 videos (grid-cols-3) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Slice changed to 3 */}
            {overview.sponsoredVideos.slice(0, 3).map((item: any, index: number) => (
              <SponsoredVideoCard key={index} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Scrolling Gallery */}
      {hasGallery && (
        <div className="bg-blue-50 border-l-4 border-[#008DD2] p-6 rounded-r-xl shadow-sm">
          <h3 className="font-bold text-[#0b1c2e] text-lg mb-5">Past Event Gallery</h3>
          <div className="flex overflow-x-auto gap-5 pb-3 snap-x snap-mandatory hide-scrollbar">
            
            {/* Images */}
            {overview.gallery?.map((url: string, index: number) => (
              <div key={`img-${index}`} className="relative w-60 h-40 shrink-0 snap-center overflow-hidden rounded-xl bg-white border border-slate-200 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <Image src={url} alt={`Gallery ${index + 1}`} fill sizes="240px" className="object-cover transition-transform duration-500 hover:scale-110" />
              </div>
            ))}

            {/* Videos */}
            {overview.videoGallery?.map((url: string, index: number) => {
              const isYouTube = url?.includes("youtube.com") || url?.includes("youtu.be");

              return (
                <div key={`vid-${index}`} className="relative w-60 h-40 shrink-0 snap-center overflow-hidden rounded-xl bg-black border border-slate-200 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  {isYouTube ? (
                    <iframe
                      src={getYouTubeEmbedUrl(url)}
                      className="w-full h-full border-0"
                      allow="encrypted-media; fullscreen; picture-in-picture"
                      allowFullScreen
                      title="Gallery Video"
                    />
                  ) : (
                    <video src={url} controls className="w-full h-full object-cover" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
}
