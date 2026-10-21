// Anonymous funnel counters: a handful of named steps, counted per day, with nothing that identifies a person.
// Safe for client and server. The server side is app/api/event/route.ts; the table is funnel_daily.
//
// Each count also carries a coarse "source": a label from the fixed list below saying which channel the visit came from
// (Google, TikTok, a school email...). It is worked out in memory from the current page's own referrer or utm_source and
// sent with the event. It is not stored in the browser, so a full page reload on a later page loses it.

export const FUNNEL_EVENTS = [
  "landing_view", // a new visitor was shown the landing page
  "hero_signup_submit", // they pressed Get started free
  "hero_try_practice", // retired: the practice test now needs an account
  "gate_view", // someone without an account reached a tool that needs one
  "link_sent", // we sent a sign-in email
  "signed_in", // they arrived back from the email and are signed in
  "first_practice", // first practice test completed on a device
  "first_mock", // first mock interview completed on a device
  "visit_home", // a visit began on the home page
  "visit_employer", // ...on an employer guide
  "visit_guide", // ...on an advice or learning page
  "visit_tool", // ...on a practice test, mock, tracker or other tool page
  "visit_other", // ...anywhere else
  "pricing_view", // the Plans page was opened
  "limit_hit", // a free allowance was used up and the upgrade prompt was shown
  "checkout_start", // they pressed Continue to payment
  "apply_click", // they followed an Apply link in the tracker
  "share_click", // they pressed a share button
  "tracker_prompt_view", // the tracker showed a suggested next step
  "tracker_prompt_click", // they followed it
  "parent_share_click", // they pressed the button to send the plan to a parent or guardian
] as const;

export type FunnelEvent = (typeof FUNNEL_EVENTS)[number];

export const isFunnelEvent = (v: unknown): v is FunnelEvent => typeof v === "string" && (FUNNEL_EVENTS as readonly string[]).includes(v);

/**
 * The only source labels that are counted. A fixed list keeps the table small and means nobody can fill it with junk.
 * Use one of these as utm_source on links you share (for example ?utm_source=school or ?utm_source=tiktok).
 */
export const SOURCES = [
  "direct",
  "google",
  "bing",
  "duckduckgo",
  "ecosia",
  "tiktok",
  "instagram",
  "facebook",
  "youtube",
  "reddit",
  "linkedin",
  "x",
  "whatsapp",
  "snapchat",
  "discord",
  "studentroom",
  "email",
  "school",
  "college",
  "careers",
  "share", // the share buttons on this site
  "other",
] as const;

export type Source = (typeof SOURCES)[number];

export const isSource = (v: unknown): v is Source => typeof v === "string" && (SOURCES as readonly string[]).includes(v);

// Referrer host fragment -> source. The first match wins.
const REFERRER_HOSTS: [RegExp, Source][] = [
  [/(^|\.)google\./, "google"],
  [/(^|\.)bing\.com$/, "bing"],
  [/(^|\.)duckduckgo\.com$/, "duckduckgo"],
  [/(^|\.)ecosia\.org$/, "ecosia"],
  [/(^|\.)(tiktok\.com)$/, "tiktok"],
  [/(^|\.)(instagram\.com|l\.instagram\.com)$/, "instagram"],
  [/(^|\.)(facebook\.com|fb\.com|l\.facebook\.com|m\.facebook\.com)$/, "facebook"],
  [/(^|\.)(youtube\.com|youtu\.be)$/, "youtube"],
  [/(^|\.)reddit\.com$/, "reddit"],
  [/(^|\.)(linkedin\.com|lnkd\.in)$/, "linkedin"],
  [/(^|\.)(twitter\.com|x\.com|t\.co)$/, "x"],
  [/(^|\.)(whatsapp\.com|wa\.me)$/, "whatsapp"],
  [/(^|\.)snapchat\.com$/, "snapchat"],
  [/(^|\.)discord(app)?\.com$/, "discord"],
  [/(^|\.)thestudentroom\.co\.uk$/, "studentroom"],
];

/**
 * Which channel a visit came from. A utm_source on the link wins (when it is on the list, otherwise "other"); then the
 * referrer's host; an empty referrer is "direct". Referrers from our own site are "direct" too: they are not a source.
 */
export function sourceFrom(referrer: string, search: string, ownHost = ""): Source {
  const utm = new URLSearchParams(search).get("utm_source")?.trim().toLowerCase();
  if (utm) return isSource(utm) ? utm : "other";
  if (!referrer) return "direct";
  let host = "";
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return "direct";
  }
  if (!host || host === ownHost) return "direct";
  return REFERRER_HOSTS.find(([re]) => re.test(host))?.[1] ?? "other";
}

/**
 * A campaign label cleaned to lowercase letters, digits, - and _, at most 40 characters. Applied in the browser and again
 * on the server, so the table only ever holds short harmless labels.
 */
export const cleanCampaign = (v: unknown): string =>
  typeof v === "string" ? v.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) : "";

/** The link's utm_campaign (which TikTok video or bio link brought them), cleaned. Empty when there is none. */
export const campaignFrom = (search: string): string => cleanCampaign(new URLSearchParams(search).get("utm_campaign"));

/** Which kind of page a visit began on, from its path. */
export function entryEvent(pathname: string): FunnelEvent {
  if (pathname === "/" || pathname === "") return "visit_home";
  if (pathname.startsWith("/employers/")) return "visit_employer";
  if (/^\/(learn|guide|tips|timeline|faq|sectors|deadlines)(\/|$)/.test(pathname)) return "visit_guide";
  if (/^\/(tests|practice|mock|interview|review|cv|stories|progress|opportunities)(\/|$)/.test(pathname)) return "visit_tool";
  return "visit_other";
}

const sent = new Set<string>();
let currentSource: Source | null = null;
let currentCampaign: string | null = null;

/** The source of this page load, worked out once from the browser's own referrer and URL. */
function source(): Source {
  if (currentSource) return currentSource;
  currentSource = sourceFrom(document.referrer, window.location.search, window.location.hostname);
  return currentSource;
}

const campaign = () => (currentCampaign ??= campaignFrom(window.location.search));

/**
 * Count one step. Fire and forget; failures are ignored. Nothing is stored in the browser: the same event is only sent
 * once per page load (a module-level Set), and the request carries no identifier, only the coarse source label.
 */
export function track(event: FunnelEvent, opts: { oncePerLoad?: boolean } = {}) {
  if (typeof window === "undefined") return;
  if (opts.oncePerLoad) {
    if (sent.has(event)) return;
    sent.add(event);
  }
  try {
    void fetch("/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, source: source(), campaign: campaign() }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* counting must never get in the way */
  }
}

/** Count the start of a visit on the page it began on. Once per page load. */
export function trackVisit() {
  if (typeof window === "undefined") return;
  track(entryEvent(window.location.pathname), { oncePerLoad: true });
}
