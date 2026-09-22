import { createHmac, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const TTL_MS = 12 * 60 * 60 * 1000;

function fromEnvFile(name: string): string {
  try {
    const text = readFileSync(resolve(process.cwd(), ".env"), "utf8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 1 || trimmed.slice(0, eq) !== name) continue;
      return trimmed
        .slice(eq + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
    }
  } catch {
    /* no local env file */
  }
  return "";
}

function envValue(name: string): string {
  return (process.env[name] ?? "").trim() || fromEnvFile(name);
}

export function codesMatch(input: string): boolean {
  const expectedCode = envValue("INBOX_ACCESS_CODE");
  if (!expectedCode || !input) return false;
  const given = Buffer.from(input);
  const expected = Buffer.from(expectedCode);
  if (given.length !== expected.length) return false;
  return timingSafeEqual(given, expected);
}

function tokenSecret(): string {
  const secret = envValue("INBOX_TOKEN_SECRET");
  if (!secret) throw new Error("Inbox access is not configured.");
  return secret;
}

export function issueInboxToken(now = Date.now()): string {
  const exp = String(now + TTL_MS);
  const sig = createHmac("sha256", tokenSecret()).update(exp).digest("base64url");
  return `${exp}.${sig}`;
}

export function readInboxToken(token: string | undefined, now = Date.now()): boolean {
  if (!token) return false;
  let secret: string;
  try {
    secret = tokenSecret();
  } catch {
    return false;
  }
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const exp = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", secret).update(exp).digest("base64url");
  const givenBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  if (givenBuf.length !== expectedBuf.length) return false;
  if (!timingSafeEqual(givenBuf, expectedBuf)) return false;
  const expMs = Number(exp);
  return Number.isFinite(expMs) && expMs > now;
}
