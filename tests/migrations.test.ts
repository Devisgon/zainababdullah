import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
const migrations = ["0000_short_wild_child", "0001_secure_submission"].map(
  (name) => readFileSync(`supabase/migrations/${name}.sql`, "utf8"),
);
async function setup(legacy = false) {
  const db = new PGlite();
  await db.exec(
    "CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;",
  );
  if (legacy)
    await db.exec(
      `CREATE TABLE public.website_leads(id uuid primary key,brief jsonb not null,source_hash text not null,created_at bigint not null,status text not null default 'new'); INSERT INTO website_leads VALUES ('11111111-1111-4111-8111-111111111111','{}','legacy',1,'new');`,
    );
  for (const migration of migrations) await db.exec(migration);
  return db;
}
test("PostgreSQL migrations preserve prior enquiries and restrict anonymous access", async () => {
  const db = await setup(true);
  try {
    assert.equal(
      (
        await db.query<{ count: number }>(
          "SELECT count(*)::int FROM website_leads",
        )
      ).rows[0].count,
      1,
    );
    const permissions = await db.query<{
      lead: boolean;
      blog: boolean;
      rpc: boolean;
    }>(
      `SELECT has_table_privilege('anon','website_leads','select') as lead,has_table_privilege('authenticated','blog_posts','select') as blog,has_function_privilege('anon','submit_website_lead(jsonb)','execute') as rpc`,
    );
    assert.deepEqual(permissions.rows[0], {
      lead: false,
      blog: false,
      rpc: false,
    });
    await db.exec("SET ROLE anon");
    await assert.rejects(
      db.query("SELECT * FROM blog_posts"),
      /permission denied/,
    );
  } finally {
    await db.close();
  }
});
test("PostgreSQL submission RPC persists, deduplicates retries and limits submissions", async () => {
  const db = await setup();
  try {
    const source = "a".repeat(64);
    const brief = {
      requestId: crypto.randomUUID(),
      email: "client@example.com",
      whatsapp: "+15555555555",
      sourceHash: source,
      companyFax: "",
    };
    const submit = (value: unknown) =>
      db.query<{ result: { id?: string; limited?: boolean } }>(
        "SELECT submit_website_lead($1::jsonb) AS result",
        [JSON.stringify(value)],
      );
    assert.equal((await submit(brief)).rows[0].result.id, brief.requestId);
    assert.equal((await submit(brief)).rows[0].result.id, brief.requestId);
    for (let i = 0; i < 4; i++)
      await submit({ ...brief, requestId: crypto.randomUUID() });
    assert.equal(
      (await submit({ ...brief, requestId: crypto.randomUUID() })).rows[0]
        .result.limited,
      true,
    );
    const stored = (
      await db.query<{ brief: Record<string, unknown> }>(
        "SELECT brief FROM website_leads LIMIT 1",
      )
    ).rows[0].brief;
    assert.equal(stored.whatsapp, brief.whatsapp);
    assert.equal("sourceHash" in stored, false);
    assert.equal("companyFax" in stored, false);
  } finally {
    await db.close();
  }
});
