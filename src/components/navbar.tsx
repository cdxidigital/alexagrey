import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks, profile, scrollToId } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    scrollToId(href);
  };

  return (
    <header
      data-testid="navbar"
      className={cn(
        "fixed inset-x-0 top-0 z-50 text-cream transition-[background-color,border-color] duration-300",
        scrolled || open
          ? "border-b border-gold/10 bg-ink/90 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center px-5 md:px-10">
        <button
          type="button"
          onClick={() => go("#top")}
          data-testid="nav-logo"
          className="heading-serif shrink-0 text-xl tracking-[0.16em] transition-colors hover:text-gold-light"
        >
          {profile.name}
        </button>

        <nav className="ml-auto hidden items-center lg:flex">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                type="button"
                data-testid={`nav-${link.label.toLowerCase()}`}
                onClick={() => go(link.href)}
                className="nav-link"
              >
                {link.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            data-testid="nav-book-btn"
            onClick={() => go("#booking")}
            className="btn-gold nav-book ml-8"
          >
            Book
          </button>
        </nav>

        <div className="ml-auto lg:hidden">
          <button
            type="button"
            className="flex size-11 items-center justify-center text-cream"
            data-testid="nav-mobile-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div
          data-testid="nav-mobile-menu"
          className="border-t border-gold/10 bg-ink lg:hidden"
        >
          <nav className="flex flex-col px-5 pb-8 pt-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => go(link.href)}
                className="min-h-12 border-b border-gold/10 py-3 text-left font-serif text-2xl font-light text-cream"
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => go("#booking")}
              className="btn-gold mt-6 w-full"
            >
              Book an enquiry
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
