import { services } from "@/lib/site-data";
import { FadeIn } from "@/components/fade-in";

export function Services() {
  return (
    <section
      id="services"
      data-testid="services-tags-list"
      className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32"
    >
      <FadeIn>
        <p className="label-text">In Private</p>
        <h2 className="mt-3 max-w-2xl heading-serif text-4xl font-light md:text-5xl">
          Things I prefer & adore
        </h2>
        <p className="mt-4 max-w-xl font-sans text-sm font-light leading-relaxed text-muted">
          A curated glimpse of what we can explore together. Every booking is discreet,
          consensual and tailored to you.
        </p>
      </FadeIn>
      <FadeIn delay={0.05}>
        <div className="mt-12 flex flex-wrap gap-3">
          {services.map((tag, i) => (
            <span key={tag + i} data-testid="service-tag" className="chip">
              {tag}
            </span>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
