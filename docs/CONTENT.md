# Editing content

Public copy lives in `src/content/*.json`. Services and market URLs are generated from stable slugs. Edit `markets.json` for USA, Saudi Arabia, Kuwait and Qatar scope; keep market content useful and specific. Changing JSON requires a new deployment. Run `pnpm validate:content` and `pnpm build` before pushing.

Add real portraits through media.json, then regenerate variants with `node scripts/optimize-images.mjs`. Existing images remain labelled samples until replaced. Populate work.json and reviews.json with real, permissioned material. Do not invent results, local offices, certifications or reviews.

Daily posts: sign in at `/studio/blog` using an allowlisted Supabase Auth account. Save drafts, preview, set SEO fields and publish. Published URLs remain stable. Unpublishing a database article also suppresses any JSON article with the same slug. CMS data remains in Supabase and is not committed to Git.

Social URLs are edited in site.json. Only real supplied URLs should become links. The contact form requires email, international WhatsApp and contact consent. Notifications are not yet configured.

## Brand assets and themes

Brand green is `#92C948`; brand navy is `#0B1D3A`. Shared theme tokens live in `src/styles/site.css`; logo URLs live in `src/content/branding.json`. The reusable BrandLogo component selects the supplied light/dark logo with CSS, avoiding a hydration flash. Logos have transparent backgrounds. Dark surfaces use a white treatment for legibility, without a backing badge. Optimised transparent WebP files are used in navigation and footer; original PNGs are retained as source assets.

The blog editor, form states, illustrations, favicon and social preview use the same palette. Semantic error colours and recognisable third-party platform colours are retained. Run `python scripts/generate-social-image.py` to regenerate `public/og-image.png` from the original light logo (Pillow and URW Nimbus fonts required).

The presentation refresh is defined in `src/styles/modern.css`, loaded after the shared layout CSS. It provides a compact floating navbar, active navigation pills, softer cards, updated typography, responsive spacing and transparent logos. Header and footer logo sizes are intentionally smaller on phones.
