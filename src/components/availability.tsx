import { Clock } from "lucide-react";
import { weeklyHours } from "@/lib/site-data";
import { FadeIn } from "@/components/fade-in";
import { cn } from "@/lib/utils";

function schedule() {
  const todayIdx = new Date().getDay();
  const today = weeklyHours[todayIdx]!;
  const rest = [
    ...weeklyHours.slice(todayIdx + 1),
    ...weeklyHours.slice(0, todayIdx),
  ];
  return [{ day: "Today", hours: today.hours, isToday: true }, ...rest.map((d) => ({ ...d, isToday: false }))];
}

function isOpenNow(hours: string) {
  if (hours.includes("24")) return true;
  const match = hours.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return false;
  let h = Number(match[1]);
  const m = Number(match[2]);
  const ap = match[3].toUpperCase();
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const start = h * 60 + m;
  // till late — treat as open until 4am next morning
  return minutes >= start || minutes < 4 * 60;
}

export function Availability() {
  const rows = schedule();
  const open = isOpenNow(rows[0]!.hours);

  return (
    <section
      id="availability"
      data-testid="availability-section"
      className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32"
    >
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <FadeIn>
          <p className="label-text">Availability</p>
          <h2 className="mt-3 heading-serif text-4xl font-light md:text-5xl">
            When you can <span className="italic text-cream">see me</span>
          </h2>
          <p className="mt-4 max-w-sm font-sans text-sm font-light leading-relaxed text-muted">
            Outcall only. Late nights are my favourite — weekends I’m available around
            the clock. Please book ahead to secure your time.
          </p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-ink/40 px-4 py-2 text-xs text-gold">
            <Clock size={14} /> Times shown in Perth (AWST)
          </p>
        </FadeIn>
        <FadeIn delay={0.08}>
          <div className="overflow-hidden rounded-2xl border border-gold/15">
            {rows.map((row, i) => {
              const allDay = row.hours.includes("24");
              return (
                <div
                  key={row.day}
                  data-testid={`availability-${row.day.toLowerCase()}`}
                  className={cn(
                    "flex items-center justify-between px-6 py-5 transition-colors duration-300 hover:bg-gold/5 md:px-8",
                    i !== rows.length - 1 && "border-b border-white/5",
                    open && i === 0 && "bg-gold/5",
                  )}
                >
                  <span className="flex items-center gap-3 font-serif text-xl font-light text-cream">
                    {row.day}
                    {open && i === 0 && (
                      <span className="rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">
                        Now
                      </span>
                    )}
                  </span>
                  <span
                    className={cn(
                      "font-sans text-sm",
                      allDay ? "font-semibold text-gold" : "text-muted",
                    )}
                  >
                    {row.hours}
                  </span>
                </div>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
