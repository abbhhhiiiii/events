import type { Metadata, Viewport } from "next";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://events.company.com"),
  title: {
    default: "Master Events Platform",
    template: "%s | Master Events Platform"
  },
  description: "Premium enterprise event platform for conferences, summits, forums, and business gatherings.",
  openGraph: {
    title: "Master Events Platform",
    description: "Discover, book, and attend world-class business events.",
    url: "https://events.company.com",
    siteName: "Master Events Platform",
    images: ["/og-image.jpg"],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Master Events Platform",
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
