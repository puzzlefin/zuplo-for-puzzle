/**
 * Downloads the gateway's OpenAPI spec before the portal builds (API-3832).
 *
 * The reference pages are generated from this document. Fetching it here
 * rather than in the visitor's browser is what lets Zudoku prerender the
 * endpoint routes: deep links render immediately instead of showing a
 * not-found page for a few seconds while 700+ KB downloads and parses, and
 * crawlers see real content.
 *
 * The gateway regenerates the spec from its Zod contracts on every deploy, so
 * this stays current as long as the portal rebuilds — which happens on every
 * push here, and on the gateway's build hook ping.
 *
 * A docs deploy must never depend on the API being reachable, so a failed
 * fetch falls back to the committed copy of the spec and the build carries on
 * with a warning.
 */
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";

const SPEC_URL = "https://api.puzzle.io/rest/v0/openapi.json";
const SPEC_PATH = "openapi.json";
const TIMEOUT_MS = 30_000;

const fail = (reason) => {
  if (existsSync(SPEC_PATH)) {
    console.warn(`[spec] ${reason} — building with the committed copy of ${SPEC_PATH}`);
    process.exit(0);
  }
  console.error(`[spec] ${reason} — and no committed ${SPEC_PATH} to fall back to`);
  process.exit(1);
};

let response;
try {
  response = await fetch(SPEC_URL, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { "accept-encoding": "gzip" },
  });
} catch (error) {
  fail(`could not reach ${SPEC_URL} (${error})`);
}

if (!response.ok) {
  fail(`${SPEC_URL} returned ${response.status}`);
}

const body = await response.text();

// Parse before writing: a malformed spec should fail the build loudly here,
// not render a broken reference on the live site.
let document;
try {
  document = JSON.parse(body);
} catch (error) {
  fail(`${SPEC_URL} did not return valid JSON (${error})`);
}

const pathCount = Object.keys(document.paths ?? {}).length;
if (pathCount === 0) {
  fail(`${SPEC_URL} returned a document with no paths`);
}

await writeFile(SPEC_PATH, `${JSON.stringify(document, null, 2)}\n`);
console.log(
  `[spec] fetched ${pathCount} paths (${body.length} bytes), version ${document.info?.version}`,
);
