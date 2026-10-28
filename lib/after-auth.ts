// Getting people back to what they were doing after they create an account, and a shortcut to their inbox.

const KEY = "da-prep:after-auth";

/** Only a path on this site, never the login page itself, never another address. */
export function safeNext(v: string | null | undefined): string | null {
  if (!v || v.length > 200) return null;
  if (!v.startsWith("/") || v.startsWith("//") || v.startsWith("/login")) return null;
  return v;
}

/** Remember where to go once the emailed link has signed them in (the link opens a fresh page load, so memory will not do). */
export function rememberNext(v: string | null | undefined) {
  const next = safeNext(v);
  if (!next) return;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* they land on the home page instead */
  }
}

/** The remembered path, once. */
export function takeNext(): string | null {
  try {
    const v = localStorage.getItem(KEY);
    localStorage.removeItem(KEY);
    return safeNext(v);
  } catch {
    return null;
  }
}

const MAIL: [RegExp, string, string][] = [
  [/@(gmail|googlemail)\.com$/i, "Gmail", "https://mail.google.com/"],
  [/@(outlook|hotmail|live|msn)\.[a-z.]+$/i, "Outlook", "https://outlook.live.com/mail/"],
  [/@yahoo\.[a-z.]+$/i, "Yahoo Mail", "https://mail.yahoo.com/"],
  [/@(icloud|me|mac)\.com$/i, "iCloud Mail", "https://www.icloud.com/mail"],
];

/** A link to the inbox for the common providers, so confirming an address is one tap away. Null for anything else. */
export function mailLink(email: string): { name: string; url: string } | null {
  const hit = MAIL.find(([re]) => re.test(email.trim()));
  return hit ? { name: hit[1], url: hit[2] } : null;
}
