import React from "react";
import { Clock } from "lucide-react";
import Reveal from "./Reveal";
import { AVAILABILITY } from "../data";

export default function Availability() {
  const today = AVAILABILITY[0].day === "Today";
  return (
    <section
      id="availability"
      data-testid="availability-section"
      className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32"
    >
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <p className="label-text">Availability</p>
          <h2 className="mt-3 heading-serif text-4xl font-light md:text-5xl">
            When you can <span className="italic text-cream">see me</span>
          </h2>
          <p className="mt-4 max-w-sm font-sans text-sm font-light leading-relaxed text-muted">
            Outcall only. Late nights are my favourite — weekends I’m available
            around the clock. Please book ahead to secure your time.
          </p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-black/40 px-4 py-2 text-xs text-gold">
            <Clock size={14} /> Times shown in Perth (AWST)
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="overflow-hidden rounded-2xl border border-gold/15">
            {AVAILABILITY.map((row, i) => {
              const is24 = row.hours.includes("24");
              return (
                <div
                  key={row.day}
                  data-testid={`availability-${row.day.toLowerCase()}`}
                  className={`flex items-center justify-between px-6 py-5 transition-colors duration-300 hover:bg-gold/5 md:px-8 ${
                    i !== AVAILABILITY.length - 1 ? "border-b border-white/5" : ""
                  } ${today && i === 0 ? "bg-gold/5" : ""}`}
                >
                  <span className="flex items-center gap-3 font-serif text-xl font-light text-cream">
                    {row.day}
                    {today && i === 0 && (
                      <span className="rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">
                        Now
                      </span>
                    )}
                  </span>
                  <span
                    className={`font-sans text-sm ${
                      is24 ? "font-semibold text-gold" : "text-muted"
                    }`}
                  >
                    {row.hours}
                  </span>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
