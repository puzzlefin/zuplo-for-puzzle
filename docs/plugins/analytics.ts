/**
 * Portal analytics (API-3841).
 *
 * Zudoku is a single-page app, so the browser only counts one page view per
 * session. The framework emits a `location` event on every route change
 * instead, which is what this subscribes to.
 *
 * Events go to PostHog, which is where the rest of Puzzle's web behavior
 * already lands, so docs traffic can be joined with product behavior in the
 * warehouse rather than sitting in its own silo.
 *
 * The plugin is dormant until it is configured: with no
 * ZUDOKU_PUBLIC_POSTHOG_KEY set, nothing is sent anywhere and events are
 * logged to the console instead. Turning analytics on is therefore setting two
 * environment variables in the Zuplo portal, not a code change — and a missing
 * or wrong key can never quietly send partner browsing data somewhere
 * unintended.
 */
import posthog from "posthog-js";
import { createPlugin } from "zudoku";

const KEY = process.env.ZUDOKU_PUBLIC_POSTHOG_KEY;
const HOST = process.env.ZUDOKU_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

export type AnalyticsEvent =
  | "$pageview"
  /** Someone searched the docs. `query`, and `resultCount` when known. */
  | "docs_search"
  /** Someone landed on a path we do not have a page for. */
  | "docs_not_found"
  /** Someone copied a code sample — the closest thing docs have to a conversion. */
  | "docs_copy_code";

type Properties = Record<string, unknown>;

let enabled = false;

/** The single seam between this portal and whatever collects the events. */
export const capture = (event: AnalyticsEvent, properties: Properties = {}) => {
  if (!enabled) {
    // eslint-disable-next-line no-console
    console.info("[analytics:unconfigured]", event, properties);
    return;
  }
  posthog.capture(event, properties);
};

/** Paths that belong to the generated API reference rather than a guide. */
const isReferencePath = (path: string) => path === "/api" || path.startsWith("/api/");

export const analyticsPlugin = createPlugin(() => ({
  initialize: () => {
    if (!KEY) return;
    posthog.init(KEY, {
      api_host: HOST,
      // The portal has no sign-in, so every visitor is anonymous and there is
      // nothing to identify. Pageviews are captured from the framework's
      // route-change event below, not by posthog-js, which would only see the
      // first load of a single-page app.
      capture_pageview: false,
      capture_pageleave: true,
      persistence: "localStorage+cookie",
    });
    enabled = true;
  },
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
