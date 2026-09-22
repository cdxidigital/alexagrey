import { useEffect, useState } from "react";
import { BadgeCheck, ChevronDown, MapPin } from "lucide-react";
import { media, profile, scrollToId } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export function Hero() {
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % media.heroVideos.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section id="top" className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={media.heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        {media.heroVideos.map((src, i) =>
          failed[i] ? null : (
            <video
              key={src}
              src={src}
              muted
              loop
              playsInline
              autoPlay
              className="absolute inset-0 h-full w-full object-cover object-top"
              style={{
                opacity: i === active ? 1 : 0,
                transition: "opacity 1600ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onError={() => setFailed((m) => ({ ...m, [i]: true }))}
            />
          ),
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-transparent to-transparent" />
        <div
          className="absolute inset-0"
          style={{ boxShadow: "inset 0 0 240px 60px rgba(5,5,5,0.9)" }}
        />
      </div>

      <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-2.5 md:flex">
        {media.heroVideos.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show clip ${i + 1}`}
            data-testid={`hero-clip-dot-${i}`}
            onClick={() => setActive(i)}
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-500",
              i === active ? "scale-125 bg-gold" : "bg-cream/25 hover:bg-cream/50",
            )}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-end px-6 pb-20 pt-32 md:px-10 md:pb-28">
        <div className="max-w-2xl">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-ink/40 px-3 py-1 label-text text-gold">
              <BadgeCheck size={13} /> Verified · {profile.account}
            </span>
            <span className="inline-flex items-center gap-1.5 label-text text-muted">
              <MapPin size={13} /> {profile.location}
            </span>
          </div>
          <h1 className="hero-display">
            Alexa
            <span className="block italic text-cream">Grey</span>
          </h1>
          <p className="mt-6 max-w-xl font-serif text-2xl font-light italic leading-snug text-cream/90 md:text-3xl">
            “{profile.tagline} — equal parts charm & chaos.”
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
              type="button"
              data-testid="hero-book-btn"
              onClick={() => scrollToId("#booking")}
              className="btn-gold"
            >
              Book an Enquiry
            </button>
            <button
              type="button"
              data-testid="hero-gallery-btn"
              onClick={() => scrollToId("#gallery")}
              className="btn-ghost"
            >
              View Gallery
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => scrollToId("#facts")}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-gold/70 transition-colors hover:text-gold"
        aria-label="Scroll down"
      >
        <ChevronDown className="animate-bounce" size={22} />
      </button>
    </section>
  );
}
