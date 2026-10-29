import { AsyncLocalStorage } from "node:async_hooks";

/** Hosting-specific resources enter here; feature modules stay portable Next.js. */
export type RuntimeEnv = {
  DB?: D1Database;
  BLOG_EDITOR_EMAILS?: string;
  BUCKET?: R2Bucket;
};
type RequestRuntime = { env: RuntimeEnv; startedAt: number };
const runtime = new AsyncLocalStorage<RequestRuntime>();
export function runWithRuntimeEnv<T>(env: RuntimeEnv, action: () => T): T {
  return runtime.run({ env, startedAt: Date.now() }, action);
}
export function getRuntimeEnv(): RuntimeEnv {
  return (
    runtime.getStore()?.env ?? {
      BLOG_EDITOR_EMAILS: process.env.BLOG_EDITOR_EMAILS,
    }
  );
}
export function getRequestStartedAt(): number | undefined {
  return runtime.getStore()?.startedAt;
}
export function getDatabase(): D1Database | undefined {
  return getRuntimeEnv().DB;
}
