# Vercel + Supabase setup

## Environment variables

In Vercel → Project → Settings → Environment Variables add:

| Variable | Value | Used for |
| --- | --- | --- |
| `SUPABASE_URL` | Project HTTPS URL | Lead RPC and editor Auth |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only service-role key | Private submission RPC and Auth verification |
| `DATABASE_URL` | Supabase PostgreSQL pooler connection with SSL | Drizzle blog reads/writes and migration CLI |
| `SUPABASE_ANON_KEY` | Anon or publishable key | Editor browser sign-in; this key is public |
| `BLOG_EDITOR_EMAILS` | Comma-separated editor emails | Server-verified publishing allowlist |

Use Production for the live domain. Use a separate database/project for Preview where practical; avoid permitting test deploys to publish into production. Redeploy after changes. Do not paste real keys into GitHub or chat. `.env.example` contains placeholders only; all `.env` files except that example are ignored. No `NEXT_PUBLIC_` variables are required.

The form requires the URL and service-role key. Full database/CMS setup requires all five values. Public JSON pages can build without a database, but publishing requires it.

## Apply migrations

Copy `DATABASE_URL` from Supabase → Connect. Runtime can use the transaction pooler on port 6543; use a direct/session connection for migrations if the transaction pooler rejects DDL. Both connect to the same PostgreSQL database. The password must be URL-encoded and SSL required. Set `DATABASE_URL` in your local shell or CI secret store, then run:

```sh
pnpm install --frozen-lockfile
pnpm db:migrate
```

Drizzle CLI does not automatically read `.env.local` in this configuration. Export the variable, or use Node's env-file support with a local ignored file:

```sh
node --env-file=.env.local node_modules/drizzle-kit/bin.cjs migrate
```

Migrations create `website_leads`, `blog_posts` and the private `submit_website_lead` RPC. They enable RLS, remove browser roles' table access and restrict the RPC to service_role. Drizzle's journal and snapshots belong in Git. The initial migration accepts an existing `website_leads` table from the previous SQL setup without deleting records; do not manually mark migrations as applied. A differently customised schema needs review before applying the baseline.

Migration credentials must own the application objects and have permission to grant/revoke Supabase roles. Neither a service-role API key nor an anon API key is a PostgreSQL password. Do not run schema migrations in the Vercel build command.

## Authorise the blog editor

Create the editor in Supabase → Authentication → Users, with a confirmed email and a strong password. Add that exact email to `BLOG_EDITOR_EMAILS`. The site does not offer public signup. Sign in at `/studio/blog` with the Supabase user's email/password. Authentication is checked with Supabase on the server; the access token is stored in an HttpOnly, Secure production cookie. Sessions expire after one hour; sign in again before further saves. Drafts and editor APIs are never publicly cached.

## Deploy and verify

Vercel framework: Next.js; install: `pnpm install --frozen-lockfile`; build: `pnpm build`; default output directory. Apply migrations before a deployment with `DATABASE_URL` configured. Keep the apex-to-www redirect so canonical URLs match https://www.zainababdullah.tech.

After deployment: submit a real brief, verify required WhatsApp and the record in `website_leads`. Sign in to the editor, save a draft, verify its URL returns 404 anonymously, publish it, check blog/sitemap/article, then unpublish and confirm removal. No live database or credential check can be claimed until these steps run against your configured project.

Old Cloudflare D1 records are not automatically transferred. Export them separately if you need previous enquiries or CMS posts. The former private ChatGPT-hosted preview is not the Vercel deployment and is not updated by these commits.
