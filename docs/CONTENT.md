# Editing content

Public copy lives in `src/content/*.json`. Services and market URLs are generated from stable slugs. Edit `markets.json` for USA, Saudi Arabia, Kuwait and Qatar scope; keep market content useful and specific. Changing JSON requires a new deployment. Run `pnpm validate:content` and `pnpm build` before pushing.

Add real portraits through media.json, then regenerate variants with `node scripts/optimize-images.mjs`. Existing images remain labelled samples until replaced. Populate work.json and reviews.json with real, permissioned material. Do not invent results, local offices, certifications or reviews.

Daily posts: sign in at `/studio/blog` using an allowlisted Supabase Auth account. Save drafts, preview, set SEO fields and publish. Published URLs remain stable. Unpublishing a database article also suppresses any JSON article with the same slug. CMS data remains in Supabase and is not committed to Git.

The eight Fiverr reviews in `reviews.json` are transcribed from owner-supplied screenshots. Preserve each buyer’s wording, username and rating; `bady_90` has two separate project reviews. Service labels describe the work mentioned in the feedback. The homepage shows excerpts and links to complete reviews on `/reviews`. Optional `projectValueUsd` values appear inside the corresponding review card, including homepage excerpts. The owner supplied project values for all eight reviews, using the original screenshot order: $700, $500, $2,250, $1,200, $550, $1,380, $1,250 and $1,000 USD. Review dates and buyer locations have not been supplied. Add project values and original review links only when provided. Ratings are displayed as content, without self-serving aggregate-rating structured data.

Social URLs are edited in site.json. Only real supplied URLs should become links. The contact form requires email, international WhatsApp and contact consent. Notifications are not yet configured.

## Brand assets and themes

Brand green is `#92C948`; brand navy is `#0B1D3A`. Shared theme tokens live in `src/styles/site.css`; logo URLs live in `src/content/branding.json`. The reusable BrandLogo component selects the supplied light/dark logo with CSS, avoiding a hydration flash. Logos have transparent backgrounds. Dark surfaces use the supplied green and blue logo (`logo-dark-colour.webp`) without a colour filter or backing badge. Optimised transparent WebP files are used in navigation and footer; original PNGs are retained as source assets.

The blog editor, form states, illustrations, favicon and social preview use the same palette. Semantic error colours and recognisable third-party platform colours are retained. The owner-supplied default social preview is `public/og-zainab-abdullah.jpg`; its actual dimensions, MIME type and alt text are configured in `src/content/seo.json`. Shared Open Graph and Twitter metadata use this image. Articles with a cover use that cover for their own previews. The legacy social-card generator does not overwrite this supplied image.

The presentation refresh is defined in `src/styles/modern.css`, loaded after the shared layout CSS. It provides a compact floating navbar, active navigation pills, softer cards, updated typography, responsive spacing and transparent logos. Header and footer logo sizes are intentionally smaller on phones.
