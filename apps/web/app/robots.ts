import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!baseUrl) throw new Error("NEXT_PUBLIC_SITE_URL is not configured");
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${baseUrl.replace(/\/$/, "")}/sitemap.xml`
  };
}
