import React from "react";
import Reveal from "./Reveal";
import { QUICK_FACTS } from "../data";

export default function QuickFacts() {
  return (
    <section
      id="facts"
      data-testid="quick-facts-grid"
      className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32"
    >
      <Reveal>
        <p className="label-text">Quick Facts</p>
        <h2 className="mt-3 max-w-xl heading-serif text-4xl font-light md:text-5xl">
          Know her at a glance
        </h2>
      </Reveal>

      <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-gold/15 bg-gold/10 sm:grid-cols-3 lg:grid-cols-4">
        {QUICK_FACTS.map((f, i) => (
          <Reveal key={f.label} delay={i * 0.04}>
            <div
              data-testid={`fact-${f.label.toLowerCase()}`}
              className="group h-full bg-ink p-6 transition-colors duration-300 hover:bg-surface md:p-8"
            >
              <p className="label-text text-muted transition-colors group-hover:text-gold-dark">
                {f.label}
              </p>
              <p className="mt-2 font-serif text-2xl font-light text-cream md:text-[1.7rem]">
                {f.value}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
