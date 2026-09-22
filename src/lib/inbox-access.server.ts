import { getRequestProtocol, setCookie } from "@tanstack/react-start/server";
import { codesMatch, issueInboxToken, readInboxToken } from "@/lib/inbox-token";

const COOKIE = "admin_inbox";

function cookieBase() {
  let secure = false;
  try {
    secure = getRequestProtocol() === "https";
  } catch {
    secure = false;
  }
  return {
    path: "/",
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
  };
}

export function grantInboxAccess(code: string): string | null {
  if (!codesMatch(code)) return null;
  setCookie(COOKIE, "", { ...cookieBase(), maxAge: 0 });
  return issueInboxToken();
}

export function assertInboxToken(token: string): void {
  if (!readInboxToken(token)) throw new Error("Unauthorized");
}

export function clearInboxAccess(): void {
  setCookie(COOKIE, "", { ...cookieBase(), maxAge: 0 });
}
