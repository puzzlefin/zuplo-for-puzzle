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
      type: "doc",
      file: "introduction",
      label: "Getting Started",
    },
    {
      type: "link",
      to: "/api",
      label: "API Reference",
    },
  ],
  redirects: [{ from: "/", to: "/api" }],
  apis: [
    {
      // The gateway generates this spec from its Zod contracts at startup,
      // so the reference docs always match what the API actually serves.
      type: "url",
      input: "https://api.puzzle.io/rest/v0/openapi.json",
      path: "api",
    },
  ],
  // No portal sign-in for now: the docs are fully public, and API calls
  // authenticate with OAuth bearer tokens (see Getting Started). When
  // sign-in-powered features (playground auth, self-service keys) land,
  // restore an `authentication` block with Puzzle's real Auth0 app — see
  // the zuplo-gateway repo's dev branch for the prior art.
};

export default config;
