import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="site-shell">
        <div className="footer-grid">
          <div>
            <h3>Master Events Platform</h3>
            <p>
              Enterprise-grade event discovery, ticketing, payments, and attendee experience for modern organizations.
            </p>
            <Link className="btn btn-ghost" href="/#newsletter">
              Subscribe <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <div>
            <h4>Quick Links</h4>
            <Link href="/#upcoming">Upcoming Events</Link>
            <Link href="/#categories">Categories</Link>
            <Link href="/#speakers">Speakers</Link>
            <Link href="/#faq">FAQ</Link>
          </div>
          <div>
            <h4>Support</h4>
            <Link href="/book/global-growth-summit-2026">My Bookings</Link>
            <Link href="/#contact">Contact Information</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms</Link>
          </div>
          <div>
            <h4>Contact</h4>
            <span>events@company.com</span>
            <span>+91 22 4000 2026</span>
            <span>Mumbai, Bengaluru, Dubai</span>
            <span>LinkedIn / X / Instagram</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Copyright 2026 Master Events Platform. All rights reserved.</span>
          <span>Privacy Policy · Terms · Support</span>
        </div>
      </div>
    </footer>
  );
}
