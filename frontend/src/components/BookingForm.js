import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check, Loader2, MessageCircleHeart } from "lucide-react";
import Reveal from "./Reveal";
import { DURATION_OPTIONS, EXTRAS } from "../data";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const initial = {
  name: "",
  email: "",
  phone: "",
  duration: DURATION_OPTIONS[1],
  date: "",
  location: "",
  message: "",
};

export default function BookingForm() {
  const [form, setForm] = useState(initial);
  const [extras, setExtras] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggleExtra = (name) =>
    setExtras((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.phone || !form.location) {
      setError("Please fill in your name, contact details and location.");
      return;
    }
    setStatus("loading");
    try {
      await axios.post(`${BACKEND}/api/bookings`, { ...form, extras });
      setStatus("success");
      setForm(initial);
      setExtras([]);
    } catch (err) {
      setStatus("error");
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
        <Reveal>
          <p className="label-text">Booking Enquiry</p>
          <h2 className="mt-3 heading-serif text-4xl font-light md:text-5xl">
            Let’s see how much trouble{" "}
            <span className="italic text-cream">we can get into</span>
          </h2>
          <p className="mt-5 max-w-md font-sans text-sm font-light leading-relaxed text-muted">
            When booking, please share your preferred location, the length of
            booking, and any extras you’d like. I’ll get back to you discreetly.
          </p>
          <div className="mt-8 flex items-center gap-3 rounded-xl border border-gold/15 bg-black/40 p-4">
            <MessageCircleHeart className="shrink-0 text-gold" size={20} />
            <p className="font-sans text-xs leading-relaxed text-muted">
              Outcall only. All enquiries are kept strictly confidential.
              Screening may be required for new clients.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex h-full flex-col items-start justify-center rounded-2xl border border-gold/25 bg-black/40 p-10"
                data-testid="booking-success"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-ink">
                  <Check size={28} />
                </span>
                <h3 className="mt-6 heading-serif text-3xl font-light">
                  Enquiry received
                </h3>
                <p className="mt-3 max-w-sm font-sans text-sm font-light text-muted">
                  Thank you, gorgeous. Your enquiry has landed safely. I’ll be in
                  touch soon — keep an eye on your messages. xx
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="btn-ghost mt-8"
                  data-testid="booking-reset-btn"
                >
                  Send another enquiry
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-gold/15 bg-black/30 p-7 md:p-10"
              >
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  <div>
                    <label className="field-label">Your name</label>
                    <input
                      data-testid="booking-name"
                      className="field-input"
                      value={form.name}
                      onChange={update("name")}
                      placeholder="How should I call you?"
                    />
                  </div>
                  <div>
                    <label className="field-label">Phone</label>
                    <input
                      data-testid="booking-phone"
                      className="field-input"
                      value={form.phone}
                      onChange={update("phone")}
                      placeholder="Best number to text"
                    />
                  </div>
                  <div>
                    <label className="field-label">Email</label>
                    <input
                      data-testid="booking-email"
                      type="email"
                      className="field-input"
                      value={form.email}
                      onChange={update("email")}
                      placeholder="you@email.com"
                    />
                  </div>
                  <div>
                    <label className="field-label">Preferred date / time</label>
                    <input
                      data-testid="booking-date"
                      className="field-input"
                      value={form.date}
                      onChange={update("date")}
                      placeholder="e.g. Fri 9pm"
                    />
                  </div>
                  <div>
                    <label className="field-label">Length of booking</label>
                    <select
                      data-testid="booking-duration"
                      className="field-input appearance-none"
                      value={form.duration}
                      onChange={update("duration")}
                    >
                      {DURATION_OPTIONS.map((d) => (
                        <option key={d} value={d} className="bg-ink text-cream">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Location (outcall)</label>
                    <input
                      data-testid="booking-location"
                      className="field-input"
                      value={form.location}
                      onChange={update("location")}
                      placeholder="Suburb / hotel"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <label className="field-label">Extras you’d like</label>
                  <div className="mt-2 flex flex-wrap gap-2.5">
                    {EXTRAS.map((ex) => {
                      const on = extras.includes(ex.name);
                      return (
                        <button
                          type="button"
                          key={ex.name}
                          data-testid={`booking-extra-${ex.name.toLowerCase()}`}
                          onClick={() => toggleExtra(ex.name)}
                          className={`rounded-full border px-4 py-2 text-sm transition-[background-color,border-color,color,transform] duration-300 hover:-translate-y-0.5 ${
                            on
                              ? "border-gold bg-gold text-ink"
                              : "border-gold/25 bg-transparent text-cream/80 hover:border-gold/60"
                          }`}
                        >
                          {ex.name} {ex.price}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-8">
                  <label className="field-label">Message</label>
                  <textarea
                    data-testid="booking-message"
                    rows={3}
                    className="field-input resize-none"
                    value={form.message}
                    onChange={update("message")}
                    placeholder="Tell me anything else…"
                  />
                </div>

                {error && (
                  <p
                    className="mt-5 text-sm text-red-400"
                    data-testid="booking-error"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  data-testid="booking-submit-btn"
                  className="btn-gold mt-9 w-full disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="animate-spin" size={18} /> Sending…
                    </>
                  ) : (
                    <>
                      <Send size={17} /> Send enquiry
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
