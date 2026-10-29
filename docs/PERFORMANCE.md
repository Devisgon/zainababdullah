# Rendering and performance

| Route | Technique | Reason |
| --- | --- | --- |
| Home | ISR, 60 seconds | Fast HTML with refreshed published articles |
| Services, markets, about, contact, FAQ | SSG | JSON content changes on deployment |
| Blog article | ISR, 60 seconds; known slugs prerendered; unknown published slugs generated on demand | Daily publishing without rebuilding every article |
| Blog list/search/pagination | SSR | Query parameters determine results; searches excluded from indexing |
| Sitemap, feed, llms.txt | ISR, one hour | Server-generated discovery documents |
| Studio, authenticated APIs, form submission | Dynamic, private/no-store | User identity, drafts and writes must remain current |

Publishing/unpublishing calls revalidatePath for home, blog, the article, sitemap, feed and llms.txt. Regeneration occurs on the next request; the timed ISR window is a fallback, not a cron job. JSON edits need a deployment. Never use static export (`output: export`), which would remove runtime publishing and ISR.

Next.js handles HTML caching on Vercel. Responsive portrait assets are generated with sharp and named by content hash; a custom next/image loader chooses existing WebP widths. Above-the-fold imagery uses responsive preloading; below-the-fold images are lazy. Local fonts avoid a remote font request. Fingerprinted image variants have immutable cache headers.

Do not cache editor or API responses through an external CDN. Search and studio access do not make the entire public site dynamic because authentication is only read on private routes.

Verify with `pnpm build` route output and inspect `.next/prerender-manifest.json`. Actual Lighthouse, Core Web Vitals and regional latency must be measured against the configured production deployment; build success is not a speed score or a ranking guarantee.
