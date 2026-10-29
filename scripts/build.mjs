import { spawnSync } from "node:child_process";
// Validate the real Next.js build, then package the same source for Sites' Worker runtime.
for (const args of [
  ["--import", "tsx", "scripts/validate-content.ts"],
  ["scripts/optimize-images.mjs"],
  ["node_modules/next/dist/bin/next", "build", "--webpack"],
  ["scripts/run-framework.mjs", "build"],
  // Both tools generate route types; leave the native Next.js definitions last.
  ["node_modules/next/dist/bin/next", "typegen"],
]) {
  const result = spawnSync(process.execPath, args, {
    stdio: "inherit",
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
  });
  if (result.status !== 0) process.exit(result.status || 1);
}
