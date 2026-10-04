"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import HomeDashboard from "@/components/HomeDashboard";
import type { OpenNow } from "@/lib/home";
import { track } from "@/lib/funnel";
import { shouldShowDashboard } from "@/lib/home-gate";

/**
 * Holds the dashboard slot on the home page. Only signed-in people get the dashboard. CSS (keyed on the data-returning attribute that the head script sets)
 * decides what is visible before the page loads; this confirms the real answer once the session is known, and keeps the
 * attribute honest (set when a saved session exists, cleared if the session has gone).
 * /?pitch=1 always shows the landing page, for people who want to read about Level6 again.
 */
export default function HomeSwitch({ open }: { open: OpenNow[] }) {
  const { user, ready } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const wantsPitch = /[?&]pitch=1/.test(window.location.search);
    const dash = !wantsPitch && shouldShowDashboard({ signedIn: Boolean(user) });
    const root = document.documentElement;
    if (dash) root.setAttribute("data-returning", "1");
    else root.removeAttribute("data-returning");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the answer depends on browser storage, known only after mount
    setShow(dash);
    if (!dash && !wantsPitch) track("landing_view", { oncePerLoad: true });
  }, [ready, user]);

  return (
    <div className="home-dashboard" aria-live="polite">
      {show ? <HomeDashboard open={open} /> : <div className="mx-auto h-96 max-w-6xl px-4 py-8" aria-hidden />}
    </div>
  );
}
