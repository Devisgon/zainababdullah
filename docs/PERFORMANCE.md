# Performance and search verification

## Implemented

- Real Next.js production build with React Server Components and build-time static generation.
- Known service slugs prebuilt; missing slugs return 404.
- Homepage and published-article ISR at 60 seconds, with publish/unpublish path invalidation.
- Durable HTML/RSC caching in the Sites deployment, namespaced per build.
- Fingerprinted responsive WebP portraits delivered with `next/image`, `sizes`, intrinsic dimensions, a high-priority hero and lazy secondary images.
- Self-hosted fonts with swap rendering; no third-party font request or mandatory animation framework.
- Client components limited to interactive controls; server-rendered marketing content.
- Editor-only stylesheet separated from public pages. The blog-writing/Markdown editor bundle is not an initial homepage dependency.
- Explicit canonical URLs, page metadata, Open Graph/Twitter, escaped structured data, XML sitemap, robots, RSS and `llms.txt`.
- Private/draft content excluded from discovery, with explicit uncached editor/API routes.
- Responsive CSS, reduced-motion support, keyboard service tabs, visible focus and mobile-friendly touch targets/form fields.

## Required checks

```sh
pnpm validate:content
pnpm typecheck
pnpm check
pnpm build
node scripts/check-build.mjs
```

`check-build.mjs` asserts actual Next.js static/ISR output, verifies rendered titles/canonicals/headings, checks the hosted prerendered service files, and reports referenced homepage script/CSS transfer sizes. These are build measurements, not field Core Web Vitals.

The automated tests execute real SQLite SQL against isolated in-memory databases. They cover required WhatsApp, normalized persistence, submission idempotency, draft isolation, cache persistence, binary RSC serialization, stale/expired entries, cross-build separation, invalidation, protection against older renders completing after invalidation, and concurrent request isolation. They also check structured-data escaping and responsive image selection. Production client records are never test fixtures.

## Limits and follow-up

A performance score is only valid after measuring the final deployed public URL on representative devices and networks. This private preview's sign-in gate prevents an ordinary public Lighthouse/PageSpeed crawl. There is no measured Lighthouse or CrUX score to claim yet. After public launch, run mobile Lighthouse/PageSpeed and review real LCP, INP and CLS as traffic becomes available.

Search-friendly markup makes pages understandable; it does not guarantee indexing, ranking or AI recommendations. Crawlers need public access. Keep content useful and factual, publish real work/reviews, and register the final domain with Google Search Console and Bing Webmaster Tools after launch.
