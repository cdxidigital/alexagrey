import React from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowDown, BadgeCheck } from "lucide-react";
import { MEDIA, PROFILE } from "../data";

const scrollTo = (id) =>
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

export default function Hero() {
  return (
    <section
      id="top"
      data-testid="hero-section"
      className="relative flex min-h-screen items-end overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={MEDIA.heroImage}
          alt="Alexa Grey"
          className="h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-transparent to-transparent" />
        <div
          className="absolute inset-0"
          style={{ boxShadow: "inset 0 0 240px 60px rgba(5,5,5,0.9)" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-32 md:px-10 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-black/40 px-3 py-1 label-text text-gold">
              <BadgeCheck size={13} /> Verified · {PROFILE.account}
            </span>
            <span className="inline-flex items-center gap-1.5 label-text text-muted">
              <MapPin size={13} /> {PROFILE.location}
            </span>
          </div>

          <h1 className="heading-serif text-[18vw] font-light leading-[0.86] sm:text-8xl md:text-[8.5rem]">
            Alexa
            <span className="block italic text-cream">Grey</span>
          </h1>

          <p className="mt-6 max-w-xl font-serif text-2xl font-light italic leading-snug text-cream/90 md:text-3xl">
            “{PROFILE.tagline} — equal parts charm & chaos.”
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-sm text-muted">
            <span>23</span>
            <span className="text-gold-dark">·</span>
            <span>Petite · 5'1"</span>
            <span className="text-gold-dark">·</span>
            <span className="tracking-wide text-gold">OUTCALL ONLY</span>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              data-testid="hero-book-btn"
              onClick={() => scrollTo("#booking")}
              className="btn-gold"
            >
              Book an Enquiry
            </button>
            <button
              data-testid="hero-gallery-btn"
              onClick={() => scrollTo("#gallery")}
              className="btn-ghost"
            >
              View Gallery
            </button>
          </div>
        </motion.div>
      </div>

      <button
        onClick={() => scrollTo("#facts")}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-gold/70 transition-colors hover:text-gold"
        aria-label="Scroll down"
      >
        <ArrowDown className="animate-bounce" size={22} />
      </button>
    </section>
  );
}
