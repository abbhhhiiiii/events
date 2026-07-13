"use client";

import { Send } from "lucide-react";

export function Newsletter() {
  return (
    <div className="newsletter">
      <div>
        <p className="eyebrow" style={{ color: "#d6f5ef" }}>
          Newsletter
        </p>
        <h2>Get curated event updates before seats open publicly.</h2>
        <p>Receive upcoming event alerts, speaker announcements, sponsor opportunities, and member-only access windows.</p>
      </div>
      <form aria-label="Subscribe to newsletter" onSubmit={(event) => event.preventDefault()}>
        <input type="email" name="email" placeholder="Work email" aria-label="Work email" required />
        <button className="btn btn-secondary" type="submit">
          Subscribe <Send size={16} aria-hidden />
        </button>
      </form>
    </div>
  );
}
