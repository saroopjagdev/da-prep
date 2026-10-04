// Decides between the landing page and the dashboard. Client-safe: imports no employer data.

/** The saved lists (see useCollection) whose presence means someone has already used the app on this device. */
export const LOCAL_COLLECTIONS = ["sessions", "practice", "applications", "stories", "mocks"] as const;

/** True when any of those lists holds at least one item. `read` returns the raw stored text for a key, or null. */
export function hasLocalActivity(read: (key: string) => string | null): boolean {
  return LOCAL_COLLECTIONS.some((c) => {
    const raw = read(`da-prep:${c}`);
    if (!raw) return false;
    try {
      const v = JSON.parse(raw);
      return Array.isArray(v) && v.length > 0;
    } catch {
      return false;
    }
  });
}

/** Signed-in users and anyone returning with saved activity get the dashboard; everyone else gets the pitch. */
export const shouldShowDashboard = (o: { signedIn: boolean; localActivity: boolean }) => o.signedIn || o.localActivity;

/**
 * Runs in <head> before the page paints, so a returning visitor never sees the pitch flash first. It only sets a
 * data attribute that CSS reads; the real decision is confirmed by HomeSwitch once the session has loaded.
 * Crawlers have no storage, so they always get the landing page.
 */
export const RETURNING_HINT_SCRIPT = `try{if(/[?&]pitch=1/.test(location.search))throw 0;var r=false,k=Object.keys(localStorage);for(var i=0;i<k.length;i++){if(/^sb-.*-auth-token$/.test(k[i])){r=true;break}}if(!r){var c=${JSON.stringify(
  LOCAL_COLLECTIONS.map((c) => `da-prep:${c}`),
)};for(var j=0;j<c.length;j++){var v=localStorage.getItem(c[j]);if(v&&v!=="[]"){r=true;break}}}if(r)document.documentElement.setAttribute("data-returning","1")}catch(e){}`;
