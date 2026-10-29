# Architecture

Next.js App Router renders public HTML on the server. JSON content supplies home/services/markets and initial blog posts. Feature modules own services, markets, blog, leads, work and reviews; shared components own navigation, media and JSON-LD.

Supabase PostgreSQL holds private website enquiries and CMS articles. Drizzle defines the schema and versioned migrations. The lead endpoint uses the Supabase service-role-only RPC to retain transactional advisory locking, idempotent retries and a five-per-source/hour cap. The blog repository uses Drizzle with postgres-js, prepared statements disabled for the transaction pooler and a small per-instance connection pool.

Editor sign-in uses Supabase email/password Auth. The server validates the token with Supabase and enforces BLOG_EDITOR_EMAILS. The verified token is kept in a one-hour HttpOnly session cookie. POSTs require a same-origin request. No caller-supplied ChatGPT identity headers grant access. RLS and revoked browser-role privileges prevent direct anonymous database access.

Vercel provides native Next.js rendering and cache persistence. There are no Cloudflare Workers, D1 bindings, custom ISR implementations or ChatGPT connector modules. The original hosting preview has a separate source repository and is outside this Vercel migration.
