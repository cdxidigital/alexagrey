import { Link } from "@tanstack/react-router";
import { profile } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-gold/10 bg-ink py-14">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 md:flex-row md:items-end md:px-10">
        <div>
          <p className="heading-serif text-3xl font-light">{profile.name}</p>
          <p className="mt-2 font-sans text-sm text-muted">{profile.category}</p>
          <p className="mt-1 font-sans text-xs text-muted/70">{profile.updated}</p>
        </div>
        <div className="max-w-sm text-left md:text-right">
          <span className="inline-block rounded-full border border-gold/40 px-3 py-1 label-text text-gold">
            Strictly 18+
          </span>
          <p className="mt-4 font-sans text-xs font-light leading-relaxed text-muted">
            This site advertises the services of an independent adult professional and
            is intended for consenting adults only. All content is discreet and
            consensual.
          </p>
          <p className="mt-4 font-sans text-xs text-muted/70">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <Link
            to="/admin"
            className="mt-3 inline-block font-sans text-xs tracking-wide text-gold/50 transition-colors hover:text-gold"
          >
            Admin inbox
          </Link>
        </div>
      </div>
    </footer>
  );
}
