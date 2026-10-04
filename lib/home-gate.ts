// Decides between the landing page and the dashboard. Client-safe: imports no employer data.
// The dashboard is for signed-in people only. Everyone else (new visitors, and people who use the app without an
// account) sees the landing page, which is where the signup is.

export const shouldShowDashboard = (o: { signedIn: boolean }) => o.signedIn;

/**
 * Runs in <head> before the page paints, so a signed-in person never sees the pitch flash first. It only sets a
 * data attribute that CSS reads, when a saved sign-in session exists in the browser; the real decision is confirmed by
 * HomeSwitch once the session has loaded (and the attribute is cleared if the session turns out to be gone).
 * Crawlers have no storage, so they always get the landing page. /?pitch=1 always shows the landing page.
 */
export const RETURNING_HINT_SCRIPT = `try{if(/[?&]pitch=1/.test(location.search))throw 0;var k=Object.keys(localStorage);for(var i=0;i<k.length;i++){if(/^sb-.*-auth-token$/.test(k[i])){document.documentElement.setAttribute("data-returning","1");break}}}catch(e){}`;
