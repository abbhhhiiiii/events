"use client";

import Link from "next/link";
import { CalendarDays, Menu, Search, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  ["Upcoming Events", "/#upcoming"],
  ["Categories", "/#categories"],
  ["About", "/#why-attend"],
  ["Contact", "/#contact"],
  ["My Bookings", "/book/global-growth-summit-2026"]
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="header" style={{ background: compact ? "rgba(11, 18, 32, 0.88)" : undefined }}>
      <div className="site-shell">
        <div className="header-inner" style={{ minHeight: compact ? 64 : undefined }}>
          <Link href="/" className="brand" aria-label="Master Events Platform home">
            <span className="brand-mark">
              <CalendarDays size={19} aria-hidden />
            </span>
            <span>Master Events</span>
          </Link>
          <div className="search-pill" aria-label="Search events">
            <Search size={16} aria-hidden />
            <span>Search events</span>
          </div>
          <nav className="desktop-nav" aria-label="Primary navigation">
            {links.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
            <Link className="btn btn-ghost" href="/#featured">
              <UserRound size={16} aria-hidden />
              Login
            </Link>
          </nav>
          <button
            className="mobile-toggle"
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        <nav className={`mobile-drawer ${open ? "open" : ""}`} aria-label="Mobile navigation">
          {links.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <Link href="/#featured" onClick={() => setOpen(false)}>
            Login / Profile
          </Link>
        </nav>
      </div>
    </header>
  );
}
