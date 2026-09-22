import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { durationOptions, extras as extraMenu } from "@/lib/site-data";

export const STATUSES = ["new", "contacted", "confirmed", "declined", "archived"] as const;
export type EnquiryStatus = (typeof STATUSES)[number];

export type Enquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  duration: string;
  preferred_at: string;
  location: string;
  extras: string[];
  message: string;
  status: EnquiryStatus;
  notes: string;
  created_at: string;
};

export type EnquiryInput = {
  name: string;
  email: string;
  phone: string;
  duration: string;
  date: string;
  location: string;
  extras: string[];
  message: string;
};

const EXTRA_NAMES = new Set(extraMenu.map((e) => e.name));
const DURATION_SET = new Set(durationOptions);
const STATUS_SET = new Set<string>(STATUSES);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clip(value: unknown, max: number): string {
  return String(value ?? "")
    .trim()
    .slice(0, max);
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v));
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? parsed.map((v) => String(v)) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function asStatus(value: unknown): EnquiryStatus {
  const s = String(value ?? "new");
  return STATUS_SET.has(s) ? (s as EnquiryStatus) : "new";
}

function mapRow(row: Record<string, unknown>): Enquiry {
  return {
    id: Number(row.id),
    name: String(row.name ?? ""),
    email: String(row.email ?? ""),
    phone: String(row.phone ?? ""),
    duration: String(row.duration ?? ""),
    preferred_at: String(row.preferred_at ?? ""),
    location: String(row.location ?? ""),
    extras: asStringArray(row.extras),
    message: String(row.message ?? ""),
    status: asStatus(row.status),
    notes: String(row.notes ?? ""),
    created_at: String(row.created_at ?? ""),
  };
}

function parseEnquiryInput(raw: EnquiryInput): EnquiryInput {
  const name = clip(raw.name, 80);
  const email = clip(raw.email, 120).toLowerCase();
  const phone = clip(raw.phone, 40);
  const duration = clip(raw.duration, 80);
  const date = clip(raw.date, 80);
  const location = clip(raw.location, 200);
  const message = clip(raw.message, 2000);
  const extras = (Array.isArray(raw.extras) ? raw.extras : [])
    .map((e) => clip(e, 40))
    .filter((e) => EXTRA_NAMES.has(e))
    .slice(0, 8);

  if (!name || !email || !phone || !location) {
    throw new Error("Please fill in your name, contact details and location.");
  }
  if (!EMAIL_RE.test(email)) {
    throw new Error("Please enter a valid email address.");
  }
  if (phone.replace(/\D/g, "").length < 6) {
    throw new Error("Please enter a valid phone number.");
  }
  if (!DURATION_SET.has(duration)) {
    throw new Error("Please choose a booking length.");
  }

  return { name, email, phone, duration, date, location, extras, message };
}

export const submitEnquiry = createServerFn({ method: "POST" })
  .validator((raw: EnquiryInput) => parseEnquiryInput(raw))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql.query<{ id: number }>(
      `insert into bookings
        (name, email, phone, duration, preferred_at, location, extras, message)
       values ($1, $2, $3, $4, $5, $6, $7::jsonb, $8)
       returning id`,
      [
        data.name,
        data.email,
        data.phone,
        data.duration,
        data.date,
        data.location,
        JSON.stringify(data.extras),
        data.message,
      ],
    );
    return { id: Number(rows[0]?.id ?? 0) };
  });

export const unlockInbox = createServerFn({ method: "POST" })
  .validator((raw: { code: string }) => ({ code: String(raw?.code ?? "").trim() }))
  .handler(async ({ data }) => {
    const { grantInboxAccess } = await import("@/lib/inbox-access.server");
    const token = grantInboxAccess(data.code);
    if (!token) throw new Error("Incorrect code.");
    return { token };
  });

export const lockInbox = createServerFn({ method: "POST" }).handler(async () => {
  const { clearInboxAccess } = await import("@/lib/inbox-access.server");
  clearInboxAccess();
  return { ok: true as const };
});

export const listEnquiries = createServerFn({ method: "POST" })
  .validator((raw: { token?: string }) => ({ token: String(raw?.token ?? "") }))
  .handler(async ({ data }): Promise<Enquiry[]> => {
    const { assertInboxToken } = await import("@/lib/inbox-access.server");
    assertInboxToken(data.token);
    const sql = await getSql();
  const rows = await sql.query<Record<string, unknown>>(
    `select id, name, email, phone, duration, preferred_at, location,
            extras, message, status, notes, created_at::text as created_at
       from bookings
      order by created_at desc`,
  );
  return rows.map(mapRow);
});

export const updateEnquiry = createServerFn({ method: "POST" })
  .validator((raw: { id: number; status?: EnquiryStatus; notes?: string; token?: string }) => {
    const id = Number(raw.id);
    if (!Number.isInteger(id) || id < 1) throw new Error("Invalid enquiry.");
    const status = raw.status ? asStatus(raw.status) : undefined;
    const notes = raw.notes !== undefined ? clip(raw.notes, 2000) : undefined;
    return { id, status, notes, token: String(raw.token ?? "") };
  })
  .handler(async ({ data }): Promise<Enquiry | null> => {
    const { assertInboxToken } = await import("@/lib/inbox-access.server");
    assertInboxToken(data.token);
    const sql = await getSql();
    const rows = await sql.query<Record<string, unknown>>(
      `update bookings
          set status = coalesce($2, status),
              notes = coalesce($3, notes)
        where id = $1
        returning id, name, email, phone, duration, preferred_at, location,
                  extras, message, status, notes, created_at::text as created_at`,
      [data.id, data.status ?? null, data.notes ?? null],
    );
    return rows[0] ? mapRow(rows[0]) : null;
  });
