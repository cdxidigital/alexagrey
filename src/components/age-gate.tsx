import { BadgeCheck, Sparkles } from "lucide-react";
import { profile } from "@/lib/site-data";

export function AgeGate({ onEnter }: { onEnter: () => void }) {
  return (
    <div
      data-testid="age-verification-gate"
      className="fixed inset-0 z-[100] flex items-center justify-center px-6"
      style={{ background: "rgba(5,5,5,0.96)", backdropFilter: "blur(24px)" }}
    >
      <div className="glass w-full max-w-lg rounded-2xl p-10 text-center md:p-14">
        <div className="mb-6 flex items-center justify-center gap-2 text-gold">
          <Sparkles size={16} />
          <span className="label-text text-gold-dark">Strictly 18+</span>
          <Sparkles size={16} />
        </div>
        <h1 className="heading-serif text-5xl font-light md:text-6xl">{profile.name}</h1>
        <p className="mt-3 font-sans text-sm tracking-wide text-muted">
          Independent companion · {profile.location}
        </p>
        <div className="mx-auto my-8 h-px w-24 hair-line" />
        <p className="mx-auto max-w-md font-sans text-sm leading-relaxed text-cream/80">
          This website contains adult-oriented material intended for mature audiences
          only. By entering you confirm that you are at least
          <span className="text-gold"> 18 years of age</span> (or the age of majority
          in your jurisdiction) and consent to viewing such content.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            data-testid="age-gate-enter-btn"
            onClick={onEnter}
            className="btn-gold w-full sm:w-auto"
          >
            <BadgeCheck size={18} />
            I am 18 or older — Enter
          </button>
          <a
            data-testid="age-gate-exit-btn"
            href="https://www.google.com"
            className="btn-ghost w-full sm:w-auto"
          >
            Leave
          </a>
        </div>
        <p className="mt-7 text-xs leading-relaxed text-muted/70">
          Legal adult services provided by an independent professional.
        </p>
      </div>
    </div>
  );
}
