import React from "react";
import Reveal from "./Reveal";
import { SERVICES } from "../data";

export default function Services() {
  return (
    <section
      id="services"
      data-testid="services-tags-list"
      className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32"
    >
      <Reveal>
        <p className="label-text">In Private</p>
        <h2 className="mt-3 max-w-2xl heading-serif text-4xl font-light md:text-5xl">
          Things I prefer &amp; adore
        </h2>
        <p className="mt-4 max-w-xl font-sans text-sm font-light leading-relaxed text-muted">
          A curated glimpse of what we can explore together. Every booking is
          discreet, consensual and tailored to you.
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-12 flex flex-wrap gap-3">
          {SERVICES.map((s, i) => (
            <span
              key={s + i}
              data-testid="service-tag"
              className="cursor-default rounded-full border border-gold/25 bg-black/40 px-4 py-2 font-sans text-sm text-cream/85
                transition-[transform,background-color,border-color,color] duration-300
                hover:-translate-y-0.5 hover:border-gold/60 hover:bg-gold/10 hover:text-gold-light"
            >
              {s}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
