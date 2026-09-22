import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Archive,
  Check,
  Inbox,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Search,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import {
  listEnquiries,
  lockInbox,
  updateEnquiry,
  type Enquiry,
  type EnquiryStatus,
} from "@/lib/bookings";
import { clearInboxToken, readInboxTabToken } from "@/lib/inbox-session";
import { cn, relativeTime } from "@/lib/utils";
import { profile } from "@/lib/site-data";

const FILTERS: { id: "all" | EnquiryStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "confirmed", label: "Confirmed" },
  { id: "declined", label: "Declined" },
  { id: "archived", label: "Archived" },
];

const STATUS_STYLE: Record<EnquiryStatus, string> = {
  new: "bg-gold text-ink",
  contacted: "border border-gold/40 text-gold-light",
  confirmed: "bg-gold/20 text-gold-light",
  declined: "border border-white/15 text-muted",
  archived: "border border-white/10 text-muted/70",
};

export function StudioInbox() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Enquiry[] | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = async () => {
    try {
      const data = await listEnquiries({ data: { token: readInboxTabToken() } });
      setRows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load enquiries.");
      setRows([]);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const visible = useMemo(() => {
    if (!rows) return [];
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (filter !== "all" && row.status !== filter) return false;
      if (!q) return true;
      return [row.name, row.email, row.phone, row.location, row.message]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [rows, filter, query]);

  const counts = useMemo(() => {
    const all = rows ?? [];
    return {
      total: all.length,
      new: all.filter((r) => r.status === "new").length,
    };
  }, [rows]);

  const patch = async (id: number, patchData: { status?: EnquiryStatus; notes?: string }) => {
    setBusyId(id);
    try {
      const updated = await updateEnquiry({
        data: { id, ...patchData, token: readInboxTabToken() },
      });
      if (updated) {
        setRows((list) =>
          (list ?? []).map((row) => (row.id === id ? updated : row)),
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setBusyId(null);
    }
  };

  const leave = (to: "/" | "/login") => {
    clearInboxToken();
    void lockInbox().finally(() => navigate({ to }));
  };

  return (
    <div className="min-h-screen bg-ink text-cream">
      <header className="sticky top-0 z-40 border-b border-gold/10 bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div>
            <button
              type="button"
              onClick={() => leave("/")}
              className="heading-serif text-xl tracking-[0.18em]"
            >
              {profile.name.toUpperCase()}
            </button>
            <p className="mt-1 label-text text-gold-dark">Admin inbox</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => leave("/")}
              className="label-text text-muted hover:text-gold"
              data-testid="admin-leave"
            >
              View site
            </button>
            <button
              type="button"
              className="label-text text-muted hover:text-gold"
              onClick={() => leave("/login")}
            >
              Lock
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label-text">Booking inbox</p>
            <h1 className="mt-2 heading-serif text-4xl font-light md:text-5xl">
              Enquiries
            </h1>
            <p className="mt-3 max-w-lg font-sans text-sm font-light text-muted">
              New requests from the public booking form land here. Contact details stay
              private to the admin inbox.
            </p>
          </div>
          <div className="flex gap-3">
            <Stat label="New" value={counts.new} />
            <Stat label="Total" value={counts.total} />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs tracking-wide uppercase",
                  filter === f.id
                    ? "bg-gold text-ink"
                    : "border border-gold/20 text-muted hover:border-gold/50 hover:text-gold",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <label className="relative block w-full md:max-w-xs">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, phone, suburb"
              className="field-input border-b-0 rounded-full border border-gold/20 bg-surface/40 py-2.5 pl-9 pr-4"
            />
          </label>
        </div>

        {error && <p className="mt-6 text-sm text-danger">{error}</p>}

        {rows === null ? (
          <div className="mt-16 flex justify-center text-muted">
            <LoaderCircle className="animate-spin" />
          </div>
        ) : visible.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-gold/15 bg-surface/40 px-8 py-16 text-center">
            <Inbox className="mx-auto text-gold" size={28} />
            <p className="mt-4 font-serif text-2xl font-light text-cream">
              No enquiries in this view
            </p>
            <p className="mt-2 text-sm text-muted">
              New bookings from the public form will appear here.
            </p>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {visible.map((row) => {
              const open = openId === row.id;
              return (
                <li
                  key={row.id}
                  className={cn(
                    "overflow-hidden rounded-2xl border bg-surface/40 transition-colors",
                    row.status === "new" ? "border-gold/40" : "border-gold/15",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : row.id)}
                    className="flex w-full flex-col gap-3 px-5 py-4 text-left md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-serif text-2xl font-light text-cream">
                        {row.name}
                      </p>
                      <p className="mt-1 font-sans text-sm text-muted">
                        {row.duration} · {row.location}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs text-muted">
                        {relativeTime(row.created_at)}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
                          STATUS_STYLE[row.status],
                        )}
                      >
                        {row.status}
                      </span>
                    </div>
                  </button>
                  {open && (
                    <div className="border-t border-gold/10 px-5 py-5 md:px-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Detail
                          icon={<Phone size={14} />}
                          label="Phone"
                          href={`tel:${row.phone}`}
                          value={row.phone}
                        />
                        <Detail
                          icon={<Mail size={14} />}
                          label="Email"
                          href={`mailto:${row.email}`}
                          value={row.email}
                        />
                        <Detail
                          icon={<MapPin size={14} />}
                          label="When"
                          value={row.preferred_at || "Flexible"}
                        />
                        <Detail
                          icon={<MapPin size={14} />}
                          label="Where"
                          value={row.location}
                        />
                      </div>
                      {row.extras.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {row.extras.map((ex) => (
                            <span
                              key={ex}
                              className="rounded-full border border-gold/25 px-3 py-1 text-xs text-gold-light"
                            >
                              {ex}
                            </span>
                          ))}
                        </div>
                      )}
                      {row.message && (
                        <p className="mt-5 font-sans text-sm font-light leading-relaxed text-cream/80">
                          {row.message}
                        </p>
                      )}
                      <label className="mt-6 block">
                        <span className="field-label">Private notes</span>
                        <textarea
                          defaultValue={row.notes}
                          rows={3}
                          className="field-input resize-none"
                          onBlur={(e) => {
                            if (e.target.value !== row.notes) {
                              void patch(row.id, { notes: e.target.value });
                            }
                          }}
                        />
                      </label>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <StatusBtn
                          busy={busyId === row.id}
                          onClick={() => patch(row.id, { status: "contacted" })}
                          label="Mark contacted"
                        />
                        <StatusBtn
                          busy={busyId === row.id}
                          onClick={() => patch(row.id, { status: "confirmed" })}
                          label="Confirm"
                          icon={<Check size={14} />}
                        />
                        <StatusBtn
                          busy={busyId === row.id}
                          onClick={() => patch(row.id, { status: "declined" })}
                          label="Decline"
                        />
                        <StatusBtn
                          busy={busyId === row.id}
                          onClick={() => patch(row.id, { status: "archived" })}
                          label="Archive"
                          icon={<Archive size={14} />}
                        />
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-24 rounded-2xl border border-gold/15 bg-surface/40 px-5 py-3">
      <p className="label-text text-gold-dark">{label}</p>
      <p className="mt-1 font-serif text-3xl font-light text-gold">{value}</p>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <>
      <p className="flex items-center gap-2 label-text text-gold-dark">
        {icon} {label}
      </p>
      <p className="mt-1 font-sans text-sm text-cream">{value}</p>
    </>
  );
  if (href) {
    return (
      <a href={href} className="block rounded-xl border border-gold/10 p-4 hover:border-gold/30">
        {inner}
      </a>
    );
  }
  return <div className="rounded-xl border border-gold/10 p-4">{inner}</div>;
}

function StatusBtn({
  label,
  onClick,
  busy,
  icon,
}: {
  label: string;
  onClick: () => void;
  busy: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={busy}
      onClick={onClick}
      className="btn-ghost px-4 py-2 text-xs"
    >
      {busy ? <LoaderCircle size={14} className="animate-spin" /> : icon}
      {label}
    </button>
  );
}
