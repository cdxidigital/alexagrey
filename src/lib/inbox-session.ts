const KEY = "admin_inbox_token";

export function saveInboxToken(token: string) {
  sessionStorage.setItem(KEY, token);
}

export function readInboxTabToken(): string {
  try {
    return sessionStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

export function clearInboxToken() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* private mode */
  }
}
