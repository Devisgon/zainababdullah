# Architecture

## Boundaries

The application uses the Next.js App Router convention under `src/app`. Reusable layout, media and JSON-LD elements live in `src/components`. Business capabilities are organized as feature modules under `src/features`:

| Module     | Responsibility                                                           |
| ---------- | ------------------------------------------------------------------------ |
| `home`     | Independent landing-page sections; the route composes them               |
| `services` | JSON-backed service content and interactive service tabs                 |
| `leads`    | Guided form, shared Zod validation and server submission handler         |
| `blog`     | Article models, Markdown rendering, editor, repository and authorization |
| `work`     | Filterable approved project gallery                                      |
| `reviews`  | Authentic client-review display and honest empty states                  |

Shared runtime resources enter through `src/lib/server/runtime.ts`, using request-scoped AsyncLocalStorage. Feature modules do not import `cloudflare:workers`. The Sites Worker supplies D1 and runtime secrets at the boundary. Actual Next.js can compile and prerender the same source without Cloudflare's runtime.

The source is framework-portable; the live authentication/storage adapters are host-specific. Moving to an independent Next.js host requires its trusted session validation and a persistent database adapter. Never accept spoofable identity headers directly from the public internet.

## Static generation and regeneration

Native `next build` produces standard `.next` artifacts and a prerender manifest. Marketing pages and JSON service slugs are generated at build time. The homepage and article routes declare `revalidate = 60`. Article `dynamicParams = true` allows a newly published slug without rebuilding the site; known source-authored articles are enumerated by `generateStaticParams`.

The existing Sites publication uses Vinext's `prerender: true`. It emits HTML/RSC snapshots for static routes and the same Next.js route configuration enables on-demand ISR. This is a compatibility deployment of the Next.js source, not a claim that Vinext and Next.js are identical runtimes.

`src/lib/platform/cache/d1-cache.ts` implements the adapter's CacheHandler contract. HTML and binary RSC payloads survive Worker isolate restarts in D1. It preserves request-start timestamps and revalidate/expiry policy. A render that started before an invalidation cannot restore stale content after that invalidation, even if its cache write finishes later. Tags and path invalidation are shared across isolates. A hash of application source separates each deployment's cache namespace, preventing old HTML from referencing new chunks. Overlarge entries are rendered rather than persisted.

No shared response cache is used for the owner editor or write APIs. Public pages contain no visitor-specific data. Publishing and unpublishing invalidate the homepage, article and discovery routes. The 60-second ISR window provides the fallback refresh policy; empty/filtered blog searches and feeds remain dynamic.

## Storage and schema

D1 stores `leads`, `blog_posts`, `site_render_cache` and `site_cache_tags`. Static business content belongs in JSON; incoming personal contact details and live drafts belong in the database, not committed files. SQL uses prepared bindings. Existing migration files are immutable.

Local D1 is separate from production. After a build, apply **only pending** local migrations:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_colossal_may_parker.sql
# Repeat for the other pending SQL files in ascending order.
```

Sites applies hosted schema migrations before the new Worker is published. Do not manually recreate tables in request handlers. No migration backfills historical phone numbers or inserts sample client content.

## Forms and editor

Lead submission requires work email, an international WhatsApp number and explicit enquiry consent. Client and server use the same Zod schema. Source hashing, a honeypot, bounded input sizes, an hourly submission limit and idempotency protect the endpoint. Successful delivery means the database write succeeded; notifications are a separate future integration.

Blog writes require the platform identity and the server-only owner allowlist. Writes enforce same-origin JSON requests, valid content and optimistic concurrency. Once published, article URLs are stable. Drafts are excluded from public views, RSS, sitemap and machine-readable discovery. Raw HTML is disabled in Markdown; unsafe link protocols are sanitized.

## Dependencies

Runtime libraries are React, Next.js, Lucide, Zod, Drizzle, react-markdown and remark-gfm. Avoid adding a second client state, query, animation or UI framework without a specific need. The unused starter component library was removed. Formatting uses Prettier; tests use Node's test runner with TypeScript loaded by tsx.
