import { useState, type FormEvent } from "react";
import { Check, LoaderCircle, MessageCircleHeart, Send, Shield } from "lucide-react";
import { durationOptions, extras } from "@/lib/site-data";
import { submitEnquiry } from "@/lib/bookings";
import { FadeIn } from "@/components/fade-in";
import { cn } from "@/lib/utils";

const empty = {
  name: "",
  email: "",
  phone: "",
  duration: durationOptions[1]!,
  date: "",
  location: "",
  message: "",
};

export function BookingForm() {
  const [form, setForm] = useState(empty);
  const [picked, setPicked] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState("");

  const set =
    (key: keyof typeof empty) =>
    (e: { target: { value: string } }) => {
      setError("");
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

  const toggle = (name: string) => {
    setPicked((list) =>
      list.includes(name) ? list.filter((x) => x !== name) : [...list, name],
    );
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.phone || !form.location) {
      setError("Please fill in your name, contact details and location.");
      return;
    }
    setStatus("loading");
    try {
      await submitEnquiry({ data: { ...form, extras: picked } });
      setStatus("success");
      setForm(empty);
      setPicked([]);
    } catch {
      setStatus("idle");
      setError("Something went wrong. Please try again in a moment.");
    }
  };

  return (
    <section
      id="booking"
      data-testid="booking-enquiry-form"
      className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32"
    >
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <FadeIn>
          <p className="label-text">Booking Enquiry</p>
          <h2 className="mt-3 heading-serif text-4xl font-light md:text-5xl">
            Let’s see how much trouble{" "}
            <span className="italic text-cream">we can get into</span>
          </h2>
          <p className="mt-4 max-w-sm font-sans text-sm font-light leading-relaxed text-muted">
            When booking, please share your preferred location, the length of booking,
            and any extras you’d like. I’ll get back to you discreetly.
          </p>
          <div className="mt-8 flex items-center gap-3 rounded-xl border border-gold/15 bg-ink/40 p-4">
            <Shield size={20} className="shrink-0 text-gold" />
            <p className="font-sans text-sm font-light leading-relaxed text-cream/80">
              Outcall only. All enquiries are kept strictly confidential. Screening may
              be required for new clients.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          {status === "success" ? (
            <div
              data-testid="booking-success"
              className="flex flex-col items-start rounded-2xl border border-gold/15 bg-ink/40 p-7 md:p-10"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-ink">
                <Check size={26} />
              </div>
              <p className="mt-6 label-text text-gold">Enquiry received</p>
              <p className="mt-3 max-w-sm font-sans text-sm font-light text-muted">
                Thank you, gorgeous. Your enquiry has landed safely. I’ll be in touch
                soon — keep an eye on your messages. xx
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="btn-ghost mt-8"
                data-testid="booking-reset-btn"
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="rounded-2xl border border-gold/15 bg-ink/40 p-7 md:p-10"
            >
              <div className="mb-8 flex items-start justify-between gap-4 border-b border-gold/10 pb-6">
                <div>
                  <p className="label-text text-gold">Private enquiry</p>
                  <p className="mt-2 text-sm font-light text-muted">
                    Share the details that help me reply with availability.
                  </p>
                </div>
                <span className="hidden rounded-full border border-gold/20 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted sm:block">
                  Confidential
                </span>
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div>
                  <label className="field-label" htmlFor="booking-name">
                    Your name
                  </label>
                  <input
                    id="booking-name"
                    data-testid="booking-name"
                    className="field-input"
                    required
                    value={form.name}
                    onChange={set("name")}
                    placeholder="How should I call you?"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="booking-phone">
                    Phone
                  </label>
                  <input
                    id="booking-phone"
                    data-testid="booking-phone"
                    className="field-input"
                    required
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="Best number to text"
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="booking-email">
                    Email
                  </label>
                  <input
                    id="booking-email"
                    data-testid="booking-email"
                    className="field-input"
                    type="email"
                    required
                    value={form.email}
                    onChange={set("email")}
                    placeholder="you@email.com"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="booking-date">
                    Preferred date / time
                  </label>
                  <input
                    id="booking-date"
                    data-testid="booking-date"
                    className="field-input"
                    value={form.date}
                    onChange={set("date")}
                    placeholder="Friday after 9pm"
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="booking-duration">
                    Length of booking
                  </label>
                  <select
                    id="booking-duration"
                    data-testid="booking-duration"
                    className="field-input appearance-none"
                    value={form.duration}
                    onChange={set("duration")}
                  >
                    {durationOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-ink text-cream">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="field-label" htmlFor="booking-location">
                    Location (outcall)
                  </label>
                  <input
                    id="booking-location"
                    data-testid="booking-location"
                    className="field-input"
                    required
                    value={form.location}
                    onChange={set("location")}
                    placeholder="Suburb or hotel"
                  />
                </div>
              </div>

              <div className="mt-8">
                <p className="field-label">Extras you’d like</p>
                <div className="mt-2 flex flex-wrap gap-2.5">
                  {extras.map((extra) => {
                    const on = picked.includes(extra.name);
                    return (
                      <button
                        key={extra.name}
                        type="button"
                        data-testid={`booking-extra-${extra.name.toLowerCase()}`}
                        onClick={() => toggle(extra.name)}
                        className={cn(
                          "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                          on
                            ? "border-gold bg-gold text-ink"
                            : "border-gold/25 bg-transparent text-cream/80 hover:border-gold/60",
                        )}
                      >
                        {extra.name} · {extra.price}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8">
                <label className="field-label" htmlFor="booking-message">
                  Message
                </label>
                <textarea
                  id="booking-message"
                  data-testid="booking-message"
                  className="field-input resize-none"
                  rows={4}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Tell me anything else…"
                />
              </div>

              {error && (
                <p data-testid="booking-error" className="mt-5 text-sm text-danger">
                  {error}
                </p>
              )}

              <button
                type="submit"
                data-testid="booking-submit-btn"
                className="btn-gold mt-9 w-full"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <LoaderCircle size={17} className="animate-spin" /> Sending
                  </>
                ) : (
                  <>
                    <Send size={17} /> Send enquiry
                    <MessageCircleHeart size={17} />
                  </>
                )}
              </button>
            </form>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
