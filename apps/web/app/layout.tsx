import type { Metadata, Viewport } from "next";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
if (!siteUrl) throw new Error("NEXT_PUBLIC_SITE_URL is not configured");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SME Events",
    template: "%s | SME Events"
  },
  description: "Discover India's most relevant business events, summits, forums, and conversations.",
  openGraph: {
    title: "SME Events",
    description: "Discover, book, and attend world-class business events.",
    url: siteUrl,
    siteName: "SME Events",
    images: ["/og-image.jpg"],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "SME Events",
    description: "Discover, book, and attend world-class business events."
  },
  alternates: {
    canonical: "/"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b1220"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
