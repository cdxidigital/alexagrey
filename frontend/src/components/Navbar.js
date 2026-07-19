import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { PROFILE } from "../data";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Services", href: "#services" },
  { label: "Rates", href: "#rates" },
  { label: "Availability", href: "#availability" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      data-testid="navbar"
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,padding] duration-500 ${
        scrolled ? "glass py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-10">
        <button
          onClick={() => go("#top")}
          data-testid="nav-logo"
          className="heading-serif text-xl tracking-[0.22em] transition-colors hover:text-gold-light"
        >
          {PROFILE.name.toUpperCase()}
        </button>

        <nav className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <button
              key={l.href}
              data-testid={`nav-${l.label.toLowerCase()}`}
              onClick={() => go(l.href)}
              className="label-text text-muted transition-colors hover:text-gold"
            >
              {l.label}
            </button>
          ))}
          <button
            data-testid="nav-book-btn"
            onClick={() => go("#booking")}
            className="btn-gold px-6 py-2.5 text-xs"
          >
            Book Now
          </button>
        </nav>

        <button
          className="text-gold md:hidden"
          data-testid="nav-mobile-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="glass mx-6 mt-3 rounded-xl p-6 md:hidden" data-testid="nav-mobile-menu">
          <div className="flex flex-col gap-5">
            {LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className="label-text text-left text-cream"
              >
                {l.label}
              </button>
            ))}
            <button onClick={() => go("#booking")} className="btn-gold mt-1">
              Book Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
