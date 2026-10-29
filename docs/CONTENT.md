# Editing content

Public copy lives in `src/content/*.json`. Services and market URLs are generated from stable slugs. Edit `markets.json` for USA, Saudi Arabia, Kuwait and Qatar scope; keep market content useful and specific. Changing JSON requires a new deployment. Run `pnpm validate:content` and `pnpm build` before pushing.

Add real portraits through media.json, then regenerate variants with `node scripts/optimize-images.mjs`. Existing images remain labelled samples until replaced. Populate work.json and reviews.json with real, permissioned material. Do not invent results, local offices, certifications or reviews.

Daily posts: sign in at `/studio/blog` using an allowlisted Supabase Auth account. Save drafts, preview, set SEO fields and publish. Published URLs remain stable. Unpublishing a database article also suppresses any JSON article with the same slug. CMS data remains in Supabase and is not committed to Git.

Social URLs are edited in site.json. Only real supplied URLs should become links. The contact form requires email, international WhatsApp and contact consent. Notifications are not yet configured.
