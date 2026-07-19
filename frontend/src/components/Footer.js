import React from "react";
import { PROFILE } from "../data";

export default function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="border-t border-gold/10 bg-ink py-14"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="heading-serif text-3xl font-light tracking-[0.1em]">
              {PROFILE.name.toUpperCase()}
            </p>
            <p className="mt-2 font-sans text-sm text-muted">
              {PROFILE.account} · {PROFILE.location} · {PROFILE.category}
            </p>
            <p className="mt-1 font-sans text-xs text-muted/70">
              Updated {PROFILE.updated}
            </p>
          </div>

          <div className="max-w-sm text-left md:text-right">
            <span className="inline-block rounded-full border border-gold/40 px-3 py-1 label-text text-gold">
              Strictly 18+
            </span>
            <p className="mt-4 font-sans text-xs leading-relaxed text-muted/70">
              This site advertises the services of an independent adult
              professional and is intended for consenting adults only. All
              content is discreet and consensual.
            </p>
          </div>
        </div>

        <div className="mt-10 h-px w-full hair-line" />
        <p className="mt-6 text-center font-sans text-xs text-muted/60">
          © {new Date().getFullYear()} {PROFILE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
