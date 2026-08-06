/**
 * Portal analytics (API-3841).
 *
 * Zudoku is a single-page app, so a page view only happens once per session as
 * far as the browser is concerned. The framework emits a `location` event on
 * every route change instead, which is what this subscribes to.
 *
 * The destination is deliberately pluggable. Until we have the PostHog project
 * key and host, `capture` logs to the console: that is enough to verify that
 * events fire where we expect and carry the properties we want. Swapping in
 * PostHog is then a change to one function — see `capture` below.
 */
import { createPlugin } from "zudoku";

export type AnalyticsEvent =
  | "$pageview"
  /** Someone searched the docs. `query`, and `resultCount` when known. */
  | "docs_search"
  /** Someone landed on a path we do not have a page for. */
  | "docs_not_found"
  /** Someone copied a code sample — the closest thing docs have to a conversion. */
  | "docs_copy_code";

type Properties = Record<string, unknown>;

/**
 * The single seam between this portal and whatever collects the events.
 *
 * To send to PostHog: add `posthog-js` to package.json, initialize it in the
 * plugin's `initialize` hook with ZUDOKU_PUBLIC_POSTHOG_KEY and
 * ZUDOKU_PUBLIC_POSTHOG_HOST, and replace the body of this function with
 * `posthog.capture(event, properties)`.
 */
export const capture = (event: AnalyticsEvent, properties: Properties = {}) => {
  // eslint-disable-next-line no-console
  console.info("[analytics]", event, properties);
};

/** Paths that belong to the generated API reference rather than a guide. */
const isReferencePath = (path: string) => path === "/api" || path.startsWith("/api/");

export const analyticsPlugin = createPlugin(() => ({
  events: {
    location: ({ from, to }) => {
      capture("$pageview", {
        path: to.pathname,
        section: isReferencePath(to.pathname) ? "reference" : "guides",
        // Absent on the first view of a session, which is how we tell entry
        // points from onward navigation.
        from: from?.pathname,
      });
    },
  },
}));
