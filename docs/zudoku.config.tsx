import type { ZudokuConfig } from "zudoku";

/**
 * Developer Portal Configuration
 * For more information, see:
 * https://zuplo.com/docs/dev-portal/zudoku/configuration/overview
 */
const config: ZudokuConfig = {
  site: {
    title: "Puzzle API",
  },
  metadata: {
    title: "Puzzle API Reference",
    description: "API reference for the Puzzle external REST API",
  },
  navigation: [
    {
      type: "category",
      label: "Getting Started",
      items: [
        { type: "doc", file: "welcome" },
        { type: "doc", file: "what-is-puzzle" },
        { type: "doc", file: "getting-started" },
        { type: "doc", file: "scopes" },
        { type: "doc", file: "errors" },
      ],
    },
    {
      type: "category",
      label: "Onboarding",
      items: [
        { type: "doc", file: "use-cases" },
        { type: "doc", file: "embedding-puzzle" },
        { type: "doc", file: "one-click-onboarding" },
        { type: "doc", file: "one-click-onboarding-with-journal-entry-sync" },
        { type: "doc", file: "accounting-integration" },
      ],
    },
    {
      type: "category",
      label: "Guides",
      items: [
        { type: "doc", file: "bookkeeping" },
        { type: "doc", file: "accounts-payable" },
        { type: "doc", file: "accounts-receivable" },
        { type: "doc", file: "payroll" },
        { type: "doc", file: "transactions" },
        { type: "doc", file: "account-balances" },
        { type: "doc", file: "write-api" },
      ],
    },
    {
      type: "category",
      label: "Reports & Metrics",
      items: [
        { type: "doc", file: "balance-sheet" },
        { type: "doc", file: "income-statements" },
        { type: "doc", file: "cash-activity" },
        { type: "doc", file: "metric-formulas" },
      ],
    },
    {
      type: "link",
      to: "/api",
      label: "API Reference",
    },
  ],
  redirects: [{ from: "/", to: "/welcome" }],
  apis: [
    {
      // The gateway generates this spec from its Zod contracts at startup,
      // so the reference docs always match what the API actually serves.
      type: "url",
      input: "https://api.puzzle.io/rest/v0/openapi.json",
      path: "api",
      options: {
        // Hidden until the spec carries securitySchemes and a sandbox
        // server (API-3831). Without them the playground has nowhere to
        // put a token and points only at production, so every request it
        // sends comes back 401.
        disablePlayground: true,
      },
    },
  ],
  // No portal sign-in for now: the docs are fully public, and API calls
  // authenticate with OAuth bearer tokens (see Getting Started). When
  // sign-in-powered features (playground auth, self-service keys) land,
  // restore an `authentication` block with Puzzle's real Auth0 app — see
  // the zuplo-gateway repo's dev branch for the prior art.
};

export default config;
