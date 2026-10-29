import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { D1RenderCache } from "../src/lib/platform/cache/d1-cache";
import { runWithRuntimeEnv, getRuntimeEnv } from "../src/lib/server/runtime";
import { submitLead } from "../src/features/leads/server/handler";
import {
  listBlogPosts,
  getPublishedPost,
} from "../src/features/blog/server/repository";
import { databaseFixture } from "./d1-fixture";
import { serializeJsonLd } from "../src/components/seo/json-ld";
import imageLoader from "../src/lib/media/image-loader";

test("ISR persists HTML and binary RSC across cache instances, then invalidates tags", async () => {
  const f = databaseFixture();
  try {
    const first = new D1RenderCache(f.db, "build-a");
    await first.set(
      "app:/blog/example",
      {
        kind: "APP_PAGE",
        html: "<h1>Public article</h1>",
        rscData: new TextEncoder().encode("rsc payload").buffer,
        headers: undefined,
        postponed: undefined,
        status: 200,
      },
      { revalidate: 60, tags: ["article:example"] },
    );
    const next = new D1RenderCache(f.db, "build-a");
    const hit = await next.get("app:/blog/example");
    assert.equal(hit?.value?.kind, "APP_PAGE");
    assert.equal(
      new TextDecoder().decode((hit?.value as any).rscData),
      "rsc payload",
    );
    assert.equal(
      await new D1RenderCache(f.db, "build-b").get("app:/blog/example"),
      null,
    );
    await next.revalidateTag("article:example");
    assert.equal(await first.get("app:/blog/example"), null);
  } finally {
    f.close();
  }
});
test("ISR marks stale content and never stores no-store entries", async () => {
  const f = databaseFixture();
  try {
    const cache = new D1RenderCache(f.db, "stale");
    await cache.set(
      "page",
      { kind: "REDIRECT", props: {} },
      { revalidate: 60, expire: 120 },
    );
    f.sqlite
      .prepare("UPDATE site_render_cache SET modified_at=?")
      .run(Date.now() - 61000);
    assert.equal((await cache.get("page"))?.cacheState, "stale");
    f.sqlite
      .prepare("UPDATE site_render_cache SET modified_at=?")
      .run(Date.now() - 121000);
    assert.equal((await cache.get("page"))?.cacheState, "expired");
    await cache.set(
      "private",
      { kind: "REDIRECT", props: {} },
      { revalidate: 0 },
    );
    assert.equal(await cache.get("private"), null);
  } finally {
    f.close();
  }
});
test("Runtime bindings stay isolated across concurrent requests", async () => {
  await Promise.all(
    ["first", "second"].map((email) =>
      runWithRuntimeEnv({ BLOG_EDITOR_EMAILS: email }, async () => {
        await new Promise((resolve) => setImmediate(resolve));
        assert.equal(getRuntimeEnv().BLOG_EDITOR_EMAILS, email);
      }),
    ),
  );
  assert.equal(getRuntimeEnv().DB, undefined);
});
test("Required WhatsApp is enforced by the server and valid submissions stay idempotent", async () => {
  const f = databaseFixture();
  const data = {
    requestId: crypto.randomUUID(),
    services: ["Meta Ads"],
    goal: "More qualified leads",
    budget: "Under $500",
    timeline: "Within a month",
    business: "Test business",
    website: "",
    country: "Pakistan",
    context: "A local test enquiry with enough details.",
    name: "QA Client",
    email: "client@example.com",
    whatsapp: "+92 300 1234567",
    consent: true,
    companyFax: "",
  };
  const request = (body: unknown) =>
    new Request("https://example.test/api/leads", {
      method: "POST",
      headers: {
        origin: "https://example.test",
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
  try {
    await runWithRuntimeEnv({ DB: f.db }, async () => {
      for (const whatsapp of [undefined, "", "  ", "03001234567"])
        assert.equal(
          (await submitLead(request({ ...data, whatsapp }))).status,
          400,
        );
      assert.equal((await submitLead(request(data))).status, 201);
      assert.equal((await submitLead(request(data))).status, 200);
      const row = f.sqlite
        .prepare("SELECT whatsapp,COUNT(*) AS total FROM leads")
        .get();
      assert.equal(row?.whatsapp, "+923001234567");
      assert.equal(row?.total, 1);
    });
  } finally {
    f.close();
  }
});
test("Only published database content enters public lists and article reads", async () => {
  const f = databaseFixture();
  try {
    await runWithRuntimeEnv({ DB: f.db }, async () => {
      for (const status of ["draft", "published"])
        f.sqlite
          .prepare(
            "INSERT INTO blog_posts(id,slug,title,excerpt,content,category,status,author,created_at,updated_at,published_at,edited_by) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
          )
          .run(
            crypto.randomUUID(),
            status,
            `An example ${status} title`,
            "A helpful article summary",
            "A useful test body with enough text for a future publication.",
            "Meta Ads",
            status,
            "Zainab Abdullah",
            1,
            2,
            status === "published" ? 1 : null,
            "test-owner",
          );
      const publicList = await listBlogPosts();
      assert.equal(publicList.total, 1);
      assert.equal(publicList.posts[0].slug, "published");
      assert.equal(await getPublishedPost("draft"), null);
      assert.equal((await getPublishedPost("published"))?.status, "published");
    });
  } finally {
    f.close();
  }
});
test("JSON-LD escapes script endings and remains valid JSON", () => {
  const data = { name: "</script><script>alert(1)</script>" };
  const serialized = serializeJsonLd(data);
  assert.equal(serialized.includes("</script>"), false);
  assert.deepEqual(JSON.parse(serialized), data);
});
test("Image loader serves an appropriately sized, fingerprinted local variant", () => {
  const src = imageLoader({
    src: "/assets/sample-female-portrait.webp",
    width: 480,
    quality: 75,
  });
  assert.match(
    src,
    /\/assets\/optimized\/sample-female-portrait\.[a-f0-9]{12}\.480\.webp$/,
  );
  assert.ok(readFileSync("public" + src).length < 40000);
});

test("A render started before invalidation cannot resurrect stale content", async () => {
  const f = databaseFixture();
  try {
    const cache = new D1RenderCache(f.db, "race");
    await runWithRuntimeEnv({ DB: f.db }, async () => {
      await cache.revalidateTag("article:race");
      await cache.set(
        "page",
        { kind: "REDIRECT", props: {} },
        { revalidate: 60, tags: ["article:race"] },
      );
    });
    assert.equal(await cache.get("page"), null);
  } finally {
    f.close();
  }
});
