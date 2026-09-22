import { Flame, Heart } from "lucide-react";
import { aboutParagraphs, media, pseIncludes } from "@/lib/site-data";
import { FadeIn } from "@/components/fade-in";

export function About() {
  return (
    <section
      id="about"
      data-testid="about-me-section"
      className="relative overflow-hidden bg-surface/40 py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <FadeIn className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] border border-gold/20" />
            <div className="relative overflow-hidden rounded-[1.6rem]">
              <img
                src={media.aboutImage}
                alt="Alexa Grey portrait"
                className="aspect-[3/4] w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            </div>
            <div className="absolute bottom-5 left-5 rounded-full border border-gold/40 bg-ink/60 px-4 py-1.5 label-text text-gold backdrop-blur">
              GFE · PSE Specialist
            </div>
          </div>
        </FadeIn>
        <div>
          <FadeIn>
            <p className="label-text">About Me</p>
            <h2 className="mt-3 heading-serif text-5xl font-light md:text-6xl">
              Sweet, <span className="italic text-cream">sinful</span> & unforgettable
            </h2>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-ink/40 px-4 py-1.5 text-xs font-semibold tracking-wide text-gold">
              <Flame size={13} /> OUTCALL ONLY
            </p>
          </FadeIn>
          <div className="mt-8 space-y-5">
            {aboutParagraphs.map((p, i) => (
              <FadeIn key={i} delay={0.05 * i}>
                <p className="about-copy">{p}</p>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.1}>
            <div className="mt-12 rounded-2xl border border-gold/15 bg-ink/40 p-7">
              <p className="flex items-center gap-2 label-text text-gold-dark">
                <Heart size={14} /> My PSE includes
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {pseIncludes.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-gold/25 bg-gold/5 px-3.5 py-1.5 text-[13px] text-gold-light"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
