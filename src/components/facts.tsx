import { facts } from "@/lib/site-data";
import { FadeIn } from "@/components/fade-in";

export function Facts() {
  return (
    <section
      id="facts"
      data-testid="quick-facts-grid"
      className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32"
    >
      <FadeIn>
        <p className="label-text">Quick Facts</p>
        <h2 className="mt-3 max-w-xl heading-serif text-4xl font-light md:text-5xl">
          Know her at a glance
        </h2>
      </FadeIn>
      <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-gold/15 bg-gold/10 sm:grid-cols-3 lg:grid-cols-4">
        {facts.map((fact, i) => (
          <FadeIn key={fact.label} delay={0.04 * i}>
            <div
              data-testid={`fact-${fact.label.toLowerCase()}`}
              className="group h-full bg-ink p-6 transition-colors duration-300 hover:bg-surface md:p-8"
            >
              <p className="label-text text-muted transition-colors group-hover:text-gold-dark">
                {fact.label}
              </p>
              <p className="mt-2 font-serif text-2xl font-light text-cream">
                {fact.value}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
