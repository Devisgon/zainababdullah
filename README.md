# Zainab Abdullah — paid advertising website

Native Next.js App Router, React, TypeScript, JSON content, Drizzle ORM, Supabase PostgreSQL and Vercel. The production canonical is https://www.zainababdullah.tech.

## Develop

Use Node 22.13+ and the pnpm version in package.json. Run `pnpm install --frozen-lockfile`, copy `.env.example` to `.env.local`, then `pnpm dev`. Next.js reads `.env.local`; Drizzle CLI uses exported environment variables (see below).

## Database and deployment

Read [Vercel setup](docs/VERCEL.md) before deploying. Apply migrations once before the first build with database credentials. Do not run migrations automatically in Vercel builds: parallel deploys must not race schema updates.

- `pnpm db:generate`: create a migration after editing `src/lib/db/schema.ts`.
- `pnpm db:migrate`: apply reviewed migrations with an exported `DATABASE_URL`.
- `pnpm check`: migration, access-control, form and content checks.
- `pnpm typecheck`: route and TypeScript checks.
- `pnpm build`: validate content, generate responsive images and build Next.js.

Commit schema files, reviewed SQL migrations, Drizzle snapshots/journal, JSON content, source assets and the lockfile. These are application source, not temporary internal files. Ignore secrets, assistant state, dependencies, builds, editor caches and Vercel local state. Already tracked original hosting files were removed from the current Git tree; past commits remain in history.

## Structure

- `src/app`: routes, metadata, API endpoints and rendering policies.
- `src/components`: reusable layout, media and SEO components.
- `src/features`: home, services, markets, blog, leads, work and reviews.
- `src/content/*.json`: editable public content and market briefs.
- `src/lib/db`: Drizzle PostgreSQL schema and pooled connection.
- `supabase/migrations`: versioned PostgreSQL schema and private submission function.
- `scripts`: only content validation, image optimisation and social-image generation.
- `docs`: deployment, architecture, content and performance instructions.

The form stores enquiries and requires WhatsApp. It does not email notifications. The blog editor uses Supabase Auth and an explicit email allowlist; supplied authentication headers are never trusted. JSON articles and database articles share the public blog, with database rows taking precedence, including unpublished overrides.

See [architecture](docs/ARCHITECTURE.md), [performance](docs/PERFORMANCE.md), [content editing](docs/CONTENT.md) and [SEO](docs/SEO.md).
