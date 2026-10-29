import { getRequestStartedAt } from "@/lib/server/runtime";
import { Buffer } from "node:buffer";
import {
  MemoryCacheHandler,
  type CacheHandler,
  type CacheHandlerValue,
  type IncrementalCacheValue,
} from "vinext/shims/cache-handler";

type CacheRow = {
  payload: string;
  modified_at: number;
  revalidate_seconds: number | null;
  expire_seconds: number | null;
  tags: string;
  cache_control: string | null;
};
const strings = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
const encode = (value: unknown) =>
  JSON.stringify(value, (_, item) =>
    item instanceof ArrayBuffer
      ? { __siteBinary: Buffer.from(item).toString("base64") }
      : item,
  );
const decode = (value: string) =>
  JSON.parse(value, (_, item) =>
    item && typeof item === "object" && typeof item.__siteBinary === "string"
      ? Uint8Array.from(Buffer.from(item.__siteBinary, "base64")).buffer
      : item,
  );

/** Durable ISR storage shared across Worker isolates; no user-specific routes enter this cache. */
export class D1RenderCache implements CacheHandler {
  constructor(
    private db: D1Database,
    private namespace: string,
  ) {}
  async get(
    key: string,
    context: Record<string, unknown> = {},
  ): Promise<CacheHandlerValue | null> {
    const row = await this.db
      .prepare(
        "SELECT payload,modified_at,revalidate_seconds,expire_seconds,tags,cache_control FROM site_render_cache WHERE namespace = ? AND cache_key = ?",
      )
      .bind(this.namespace, key)
      .first<CacheRow>();
    if (!row) return null;
    const tags = [
      ...new Set([
        ...strings(JSON.parse(row.tags)),
        ...strings(context.softTags),
      ]),
    ];
    if (tags.length) {
      const invalid = await this.db
        .prepare(
          `SELECT 1 AS invalid FROM site_cache_tags WHERE namespace = ? AND tag IN (${tags.map(() => "?").join(",")}) AND invalidated_at >= ? LIMIT 1`,
        )
        .bind(this.namespace, ...tags, row.modified_at)
        .first();
      if (invalid) return null;
    }
    const age = Date.now() - row.modified_at;
    const requested =
      typeof context.revalidate === "number" && context.revalidate > 0
        ? context.revalidate
        : null;
    const ttl =
      requested === null
        ? row.revalidate_seconds
        : row.revalidate_seconds === null
          ? requested
          : Math.min(row.revalidate_seconds, requested);
    return {
      value: decode(row.payload),
      lastModified: row.modified_at,
      cacheControl: row.cache_control
        ? JSON.parse(row.cache_control)
        : undefined,
      ...(row.expire_seconds !== null && age > row.expire_seconds * 1000
        ? { cacheState: "expired" }
        : ttl !== null && age > ttl * 1000
          ? { cacheState: "stale" }
          : {}),
    };
  }
  async set(
    key: string,
    data: IncrementalCacheValue | null,
    context: Record<string, unknown> = {},
  ): Promise<void> {
    const control = (
      context.cacheControl && typeof context.cacheControl === "object"
        ? context.cacheControl
        : context
    ) as Record<string, unknown>;
    const revalidate =
      data && "revalidate" in data ? data.revalidate : control.revalidate;
    if (revalidate === 0) return;
    const payload = encode(data);
    // D1 rows are bounded. Oversize content falls back to rendering rather than failing a request.
    if (Buffer.byteLength(payload) > 900_000) return;
    const tags = [
      ...new Set([
        ...strings(context.tags),
        ...strings(context.softTags),
        ...(data && "tags" in data ? strings(data.tags) : []),
      ]),
    ];
    const cacheControl =
      typeof revalidate === "number" || revalidate === false
        ? {
            revalidate,
            ...(typeof control.expire === "number"
              ? { expire: control.expire }
              : {}),
          }
        : null;
    await this.db
      .prepare(
        "INSERT INTO site_render_cache (namespace,cache_key,payload,modified_at,revalidate_seconds,expire_seconds,tags,cache_control) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(namespace,cache_key) DO UPDATE SET payload=excluded.payload,modified_at=excluded.modified_at,revalidate_seconds=excluded.revalidate_seconds,expire_seconds=excluded.expire_seconds,tags=excluded.tags,cache_control=excluded.cache_control",
      )
      .bind(
        this.namespace,
        key,
        payload,
        getRequestStartedAt() ?? Date.now(),
        typeof revalidate === "number" ? revalidate : null,
        typeof control.expire === "number" ? control.expire : null,
        JSON.stringify(tags),
        cacheControl ? JSON.stringify(cacheControl) : null,
      )
      .run();
  }
  async revalidateTag(value: string | string[]): Promise<void> {
    const tags = [...new Set(Array.isArray(value) ? value : [value])];
    if (!tags.length) return;
    await this.db.batch(
      tags.map((tag) =>
        this.db
          .prepare(
            "INSERT INTO site_cache_tags (namespace,tag,invalidated_at) VALUES (?,?,?) ON CONFLICT(namespace,tag) DO UPDATE SET invalidated_at=excluded.invalidated_at",
          )
          .bind(this.namespace, tag, Date.now()),
      ),
    );
  }
  resetRequestCache() {}
}
export default function createCache({
  env,
  options,
}: {
  env?: { DB?: D1Database };
  options?: { namespace?: string };
}): CacheHandler {
  return env?.DB
    ? new D1RenderCache(env.DB, options?.namespace || "zainab")
    : new MemoryCacheHandler({ maxMemoryCacheSize: 4 * 1024 * 1024 });
}
