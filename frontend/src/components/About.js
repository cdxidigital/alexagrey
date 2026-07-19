import React from "react";
import { motion } from "framer-motion";
import { Heart, Flame } from "lucide-react";
import Reveal from "./Reveal";
import { ABOUT_PARAGRAPHS, PSE_INCLUDES, MEDIA } from "../data";

export default function About() {
  return (
    <section
      id="about"
      data-testid="about-me-section"
      className="relative overflow-hidden bg-surface/40 py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* Portrait */}
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] border border-gold/20" />
            <div className="relative overflow-hidden rounded-[1.6rem]">
              <motion.img
                src={MEDIA.aboutImage}
                alt="Alexa Grey portrait"
                className="aspect-[3/4] w-full object-cover"
                initial={{ scale: 1.12 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            </div>
            <div className="absolute bottom-5 left-5 rounded-full border border-gold/40 bg-black/60 px-4 py-1.5 label-text text-gold backdrop-blur">
              GFE · PSE Specialist
            </div>
          </div>
        </Reveal>

        {/* Text */}
        <div>
          <Reveal>
            <p className="label-text">About Me</p>
            <h2 className="mt-3 heading-serif text-5xl font-light md:text-6xl">
              Sweet, <span className="italic text-cream">sinful</span> &amp;
              unforgettable
            </h2>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-black/40 px-4 py-1.5 text-xs font-semibold tracking-wide text-gold">
              <Flame size={13} /> OUTCALL ONLY
            </p>
          </Reveal>

          <div className="mt-8 space-y-5">
            {ABOUT_PARAGRAPHS.map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p className="max-w-2xl font-sans text-[15px] font-light leading-relaxed text-cream/80">
                  {p}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-12 rounded-2xl border border-gold/15 bg-black/40 p-7">
              <p className="flex items-center gap-2 label-text text-gold-dark">
                <Heart size={14} /> My PSE includes
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {PSE_INCLUDES.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-gold/25 bg-gold/5 px-3.5 py-1.5 text-[13px] text-gold-light"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
