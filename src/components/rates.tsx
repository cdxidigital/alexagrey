import { Plus, Sparkles } from "lucide-react";
import { extras, rates } from "@/lib/site-data";
import { FadeIn } from "@/components/fade-in";
import { cn } from "@/lib/utils";

export function Rates() {
  return (
    <section
      id="rates"
      data-testid="rates-table"
      className="relative bg-surface/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <FadeIn>
          <p className="label-text">Investment</p>
          <h2 className="mt-3 heading-serif text-4xl font-light md:text-5xl">
            Rates & extras
          </h2>
          <p className="mt-3 font-sans text-sm font-light text-muted">
            Outcall rates. A deposit may be requested to confirm your booking.
          </p>
        </FadeIn>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <FadeIn>
            <div className="h-full rounded-2xl border border-gold/15 bg-ink/40 p-8 md:p-10">
              <p className="flex items-center gap-2 label-text text-gold-dark">
                <Sparkles size={14} /> Outcalls
              </p>
              <div className="mt-6">
                {rates.map((rate, i) => (
                  <div
                    key={rate.duration}
                    data-testid={`rate-${i}`}
                    className={cn(
                      "flex items-baseline justify-between py-5",
                      i !== rates.length - 1 && "border-b border-white/5",
                    )}
                  >
                    <span className="font-serif text-2xl font-light text-cream">
                      {rate.duration}
                    </span>
                    <span className="font-sans text-2xl font-semibold text-gold">
                      {rate.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="h-full rounded-2xl border border-gold/15 bg-ink/40 p-8 md:p-10">
              <p className="flex items-center gap-2 label-text text-gold-dark">
                <Plus size={14} /> Extras
              </p>
              <div className="mt-6">
                {extras.map((extra, i) => (
                  <div
                    key={extra.name}
                    data-testid={`extra-${i}`}
                    className={cn(
                      "flex items-baseline justify-between py-5",
                      i !== extras.length - 1 && "border-b border-white/5",
                    )}
                  >
                    <span className="font-serif text-xl font-light text-cream">
                      {extra.name}
                    </span>
                    <span className="font-sans text-xl font-semibold text-gold-light">
                      {extra.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
