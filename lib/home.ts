// Real numbers and live data for the home page (server side). The landing/dashboard decision is in lib/home-gate.ts.

import { FIRMS } from "@/lib/firms";
import { ALL_MOCKS } from "@/lib/mockprocess/definitions";
import { TESTS } from "@/lib/assess/tests";
import { opportunityRows, type OpportunityRow } from "@/lib/opportunities";
import type { SectorId } from "@/lib/sectors";

/** Depth numbers for the landing page. All counted from the data, none typed in. */
export function homeStats() {
  return {
    guides: FIRMS.filter((f) => f.slug !== "civil-service-fast-track").length,
    mocks: ALL_MOCKS.length,
    tests: TESTS.length,
    employers: opportunityRows().length,
  };
}

export type OpenNow = Pick<OpportunityRow, "name" | "slug" | "sectors" | "closes" | "rolling">;

/** Employers with applications open right now that have a guide, soonest-closing first, for the landing page and the dashboard. */
export function openNow(today = new Date(), limit = 8): OpenNow[] {
  return opportunityRows(today)
    .filter((r) => r.status === "open" && r.slug)
    .slice(0, limit)
    .map(({ name, slug, sectors, closes, rolling }) => ({ name, slug, sectors: sectors as SectorId[], closes, rolling }));
}
