# Zainab Abdullah — client growth website

A TypeScript, React 19 and Next.js 16 App Router application for paid advertising, content marketing and business analysis enquiries. Marketing content is versioned JSON. Daily blog posts and enquiries use durable storage.

## Development

```sh
pnpm install
pnpm dev:next
pnpm typecheck
pnpm check
pnpm validate:content
pnpm build:next
pnpm start
```

`dev:next`, `build:next` and `start` run the **actual Next.js CLI**. `pnpm build` validates content, generates responsive images, verifies the native Next.js production build, then builds the same source through the Sites Worker adapter.

The existing hosted preview runs **Vinext 1.0.0-beta.5**, which implements the Next.js API on Cloudflare Workers. It is not Vercel's Next.js server. `vite.config.ts` preserves Sites' publishing, storage and authentication integration. Both builds are checked; this distinction is intentional and explicit. Use the native Next.js build for a Vercel/Node deployment and implement that host's database and trusted authentication adapters before moving the live editor or enquiry API. A plain `next start` serves JSON content but returns an honest unavailable response for database writes until that adapter exists.

For Sites development, `pnpm dev` uses the managed adapter and local D1. Build first, then apply pending migrations using the documented commands in [the architecture guide](docs/ARCHITECTURE.md). The managed preview must be launched with `sites-preview start <checkout>`.

## Code organization

- `src/app/`: route entry points, metadata and layouts.
- `src/features/`: home, services, leads, blog, work and reviews. Each feature owns its components, validation and server behavior.
- `src/components/`: reusable layout, media and structured-data components.
- `src/content/*.json`: site settings, navigation, social profiles, services, FAQs, portraits, work, reviews, article seeds and form options.
- `src/lib/`: content access, SEO helpers, runtime adapters and database schema.
- `src/styles/`: shared responsive design; editor CSS is loaded by the editor route.
- `scripts/`: content validation, responsive image generation and builds.
- `tests/`: meaningful cache, data isolation, lead validation, published-content and structured-data checks.
- `drizzle/`: immutable database migrations.
- `docs/`: architecture, content editing and performance decisions.

Route files delegate to feature modules. Server components render public content; small client components own tabs, navigation, theme controls and forms. The editor and Markdown writing tools do not ship in the homepage's initial module graph.

## Rendering and performance

| Content                                | Strategy                                                                  |
| -------------------------------------- | ------------------------------------------------------------------------- |
| About, services, contact, FAQ, privacy | Build-time static generation                                              |
| Service detail routes                  | `generateStaticParams`; unknown slugs return 404                          |
| Homepage                               | Prerendered; 60-second ISR                                                |
| Blog article                           | Seeded articles prebuilt; new CMS slugs generate on demand; 60-second ISR |
| Blog search and category filters       | Dynamic server rendering to keep query results accurate                   |
| Blog publishing                        | Server-authorized writes and `revalidatePath` for affected public URLs    |
| Editor, API and discovery feeds        | Dynamic, uncached/private where applicable                                |

Local portraits use `next/image`, explicit dimensions, responsive `sizes` and a custom loader for pre-generated, fingerprinted WebP files. The hero is preloaded; secondary images load lazily. This avoids a paid request-time image service. Newly added external cover images remain external and should be compressed by their source or moved into the local asset pipeline.

See [architecture](docs/ARCHITECTURE.md), [content editing](docs/CONTENT.md) and [performance verification](docs/PERFORMANCE.md).

## Owner workflow

Use `/studio/blog` to draft, preview, publish and unpublish daily articles. Production `BLOG_EDITOR_EMAILS` is a server-side secret managed through Sites. Identity is supplied and verified by the hosting platform; raw user-supplied headers are not an authentication mechanism on an independently deployed Node server.

WhatsApp is required in both client and server validation. Historical rows with a null phone remain unchanged. Testimonials and case studies stay empty until authentic approved material is supplied. AI-generated sample portraits are visibly labelled and must be replaced before representing Zainab's actual likeness. See `public/assets/IMAGE-NOTES.md`.

The existing audience remains owner-private. Public search engines and AI crawlers need public access before they can index the site. There is no guarantee of rankings, recommendations or a Lighthouse score. Email/CRM forwarding and analytics are not connected.
