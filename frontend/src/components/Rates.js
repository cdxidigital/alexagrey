import React from "react";
import { Sparkles, Plus } from "lucide-react";
import Reveal from "./Reveal";
import { RATES, EXTRAS } from "../data";

export default function Rates() {
  return (
    <section
      id="rates"
      data-testid="rates-table"
      className="relative bg-surface/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <p className="label-text">Investment</p>
          <h2 className="mt-3 heading-serif text-4xl font-light md:text-5xl">
            Rates &amp; extras
          </h2>
          <p className="mt-3 font-sans text-sm font-light text-muted">
            Outcall rates. A deposit may be requested to confirm your booking.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Rates */}
          <Reveal>
            <div className="h-full rounded-2xl border border-gold/15 bg-black/40 p-8 md:p-10">
              <p className="flex items-center gap-2 label-text text-gold-dark">
                <Sparkles size={14} /> Outcalls
              </p>
              <div className="mt-6">
                {RATES.map((r, i) => (
                  <div
                    key={r.duration}
                    data-testid={`rate-${i}`}
                    className={`flex items-baseline justify-between py-5 ${
                      i !== RATES.length - 1 ? "border-b border-white/5" : ""
                    }`}
                  >
                    <span className="font-serif text-2xl font-light text-cream">
                      {r.duration}
                    </span>
                    <span className="font-sans text-2xl font-semibold text-gold">
                      {r.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Extras */}
          <Reveal delay={0.08}>
            <div className="h-full rounded-2xl border border-gold/15 bg-black/40 p-8 md:p-10">
              <p className="flex items-center gap-2 label-text text-gold-dark">
                <Plus size={14} /> Extras
              </p>
              <div className="mt-6">
                {EXTRAS.map((e, i) => (
                  <div
                    key={e.name}
                    data-testid={`extra-${i}`}
                    className={`flex items-baseline justify-between py-5 ${
                      i !== EXTRAS.length - 1 ? "border-b border-white/5" : ""
                    }`}
                  >
                    <span className="font-serif text-xl font-light text-cream">
                      {e.name}
                    </span>
                    <span className="font-sans text-xl font-semibold text-gold-light">
                      {e.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
