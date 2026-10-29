import assert from "node:assert/strict";
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
const manifest = JSON.parse(
  readFileSync(".next/prerender-manifest.json", "utf8"),
);
assert.equal(manifest.routes["/"].initialRevalidateSeconds, 60);
for (const path of [
  "/about",
  "/services",
  "/contact",
  "/faq",
  "/privacy",
  "/services/meta-ads",
  "/services/tiktok-ads",
  "/services/google-ads",
  "/services/content-marketing",
  "/services/business-analysis",
])
  assert.ok(manifest.routes[path], `Missing Next.js SSG: ${path}`);
const home = readFileSync("dist/server/prerendered-routes/index.html", "utf8");
assert.equal((home.match(/<h1[\s>]/g) || []).length, 1);
assert.ok(/<title>[^<]*Zainab/.test(home), "Missing SEO title");
assert.match(home, /rel="canonical"[^>]+zainab-abdullah-growth/);
assert.match(home, /application\/ld\+json/);
assert.match(
  home,
  /\/assets\/optimized\/sample-female-portrait\.[a-f0-9]+\.\d+\.webp/,
);
assert.ok(/src[Ss]et=/.test(home), "Missing responsive srcset");
assert.ok(!home.includes("Your writing room."));
for (const slug of [
  "meta-ads",
  "tiktok-ads",
  "google-ads",
  "content-marketing",
  "business-analysis",
])
  assert.ok(existsSync(`dist/server/prerendered-routes/services/${slug}.html`));
const urls = [
  ...new Set(
    [
      ...home.matchAll(/(?:src|href)="(\/_next\/static\/[^"?]+\.(?:js|css))"/g),
    ].map((match) => match[1]),
  ),
];
const sizes = urls.map((url) => {
  const bytes = readFileSync("dist/client" + url);
  return { url, bytes: bytes.length, gzip: gzipSync(bytes).length };
});
const output = {
  checkedAt: new Date().toISOString(),
  nativeFramework: "Next.js 16.3.4",
  hostedAdapter: "Vinext 1.0.0-beta.5",
  homepageRevalidateSeconds: 60,
  prerenderedNextRoutes: Object.keys(manifest.routes).length,
  homepageAssets: sizes,
  totals: {
    javascriptGzipBytes: sizes
      .filter((v) => v.url.endsWith(".js"))
      .reduce((sum, v) => sum + v.gzip, 0),
    cssGzipBytes: sizes
      .filter((v) => v.url.endsWith(".css"))
      .reduce((sum, v) => sum + v.gzip, 0),
  },
  notes:
    "Build-time referenced assets, excluding photos/fonts. Not a Lighthouse score or field metric.",
};
writeFileSync(
  "docs/build-verification.json",
  JSON.stringify(output, null, 2) + "\n",
);
console.log(JSON.stringify({ ...output, homepageAssets: undefined }, null, 2));
