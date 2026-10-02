import type { NextConfig } from "next";
import { supabaseOrigin } from "./lib/supabase-url";

const isDev = process.env.NODE_ENV !== "production";
const supabase = supabaseOrigin(process.env.NEXT_PUBLIC_SUPABASE_URL);

// Static CSP: a per-request nonce would force every page to render dynamically. Inline scripts are still needed
// for Next's hydration data, so script-src allows 'unsafe-inline'; the rest of the policy locks down framing,
// plugins, form targets and where the app can connect.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self' blob:",
  `connect-src 'self'${supabase ? ` ${supabase} ${supabase.replace(/^https/, "wss")}` : ""}${isDev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  // The interview needs the microphone and camera (self-view only); nothing else is used.
  { key: "Permissions-Policy", value: "microphone=(self), camera=(self), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
