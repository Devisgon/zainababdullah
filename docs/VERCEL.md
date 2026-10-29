# Vercel enquiry form setup

Cloudflare D1 is not available on Vercel. The enquiry API now supports Supabase when D1 is absent. Existing D1 records are not migrated.

1. Choose or create a Supabase project.
2. Run `supabase/001_website_leads.sql` in its SQL editor. This creates a private table and a service-role-only submission function.
3. In Vercel → Project → Settings → Environment Variables, add `SUPABASE_URL` (your project HTTPS URL) and `SUPABASE_SERVICE_ROLE_KEY` (server-only service-role key). Enable them for Production. Never use a NEXT_PUBLIC_ prefix or commit the key.
4. Redeploy the latest main commit after saving the variables.
5. Submit one real enquiry through `/contact`. Check Supabase → Table Editor → `website_leads` for its brief.

Success is shown only after persistence. WhatsApp remains required. The function retains idempotency and a transactional five-submissions-per-hour source limit. Enquiries are stored, not emailed; notifications need a separate integration.

The canonical URL is https://www.zainababdullah.tech, matching the observed apex-to-www redirect. The Vercel configuration builds native Next.js without running the Sites Worker build.

This fixes the enquiry storage adapter only. The daily blog CMS still needs its own database/authentication migration before it works independently of Sites.
