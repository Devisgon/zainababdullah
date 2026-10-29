import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { getRequestEditor } from "@/features/blog/server/auth";
import { blogInputSchema } from "@/features/blog/schema";
import {
  getEditorPost,
  listBlogPosts,
} from "@/features/blog/server/repository";
const json = (data: unknown, status = 200) =>
  Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
export async function listEditorArticles(request: Request) {
  const auth = await getRequestEditor(request);
  if (!auth.user)
    return json(
      {
        error:
          auth.status === 401
            ? "Sign in to open the blog editor."
            : "This account does not have publishing access.",
      },
      auth.status,
    );
  try {
    const query = (new URL(request.url).searchParams.get("q") || "").slice(
      0,
      150,
    );
    const data = await listBlogPosts({ query, editor: true, limit: 100 });
    return json(data);
  } catch {
    return json(
      { error: "The articles could not be loaded. Please try again." },
      503,
    );
  }
}
export async function saveArticle(request: Request) {
  const db = getDb();
  const auth = await getRequestEditor(request);
  if (!auth.user)
    return json(
      {
        error:
          auth.status === 401
            ? "Sign in to save an article."
            : "This account does not have publishing access.",
      },
      auth.status,
    );
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return json({ error: "Please save articles from this website." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return json({ error: "Use the article editor to save this post." }, 415);
  if (Number(request.headers.get("content-length") || 0) > 180000)
    return json({ error: "This article is too long to save." }, 413);
  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > 180000)
      return json({ error: "This article is too long to save." }, 413);
    raw = JSON.parse(text);
  } catch {
    return json({ error: "The article could not be read." }, 400);
  }
  const parsed = blogInputSchema.safeParse(raw);
  if (!parsed.success)
    return json(
      {
        error: parsed.error.issues[0].message,
        fields: parsed.error.flatten().fieldErrors,
      },
      400,
    );
  if (!db)
    return json(
      {
        error:
          "Publishing is temporarily unavailable. Your writing is still in the editor.",
      },
      503,
    );
  const data = parsed.data;
  try {
    const prior = data.id ? await getEditorPost(data.id) : null;
    if (data.id && !prior)
      return json({ error: "That article could not be found." }, 404);
    if (prior && prior.updatedAt !== data.expectedUpdatedAt)
      return json(
        {
          error:
            "This article changed in another tab. Reload it before saving so those edits are preserved.",
        },
        409,
      );
    if (prior?.publishedAt && prior.slug !== data.slug)
      return json(
        {
          error:
            "A published article keeps its original URL. Update the title and content without changing its slug.",
        },
        409,
      );
    const id = prior?.id || crypto.randomUUID();
    const now = Math.max(Date.now(), (prior?.updatedAt || 0) + 1);
    const publishedAt =
      data.status === "published"
        ? prior?.publishedAt || now
        : prior?.publishedAt || null;
    const values = {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      status: data.status,
      coverImage: data.coverImage || null,
      coverAlt: data.coverAlt || null,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      author: "Zainab Abdullah",
      createdAt: prior?.createdAt || now,
      updatedAt: now,
      publishedAt,
      editedBy: auth.user.userId,
    };
    if (prior) {
      const changed = await db
        .update(blogPosts)
        .set(values)
        .where(
          and(eq(blogPosts.id, id), eq(blogPosts.updatedAt, prior.updatedAt)),
        )
        .returning({ id: blogPosts.id });
      if (!changed.length)
        return json(
          {
            error:
              "This article changed while saving. Reload before trying again.",
          },
          409,
        );
    } else await db.insert(blogPosts).values({ ...values, id });
    if (data.status === "published" || prior?.status === "published") {
      try {
        for (const path of [
          "/",
          "/blog",
          `/blog/${data.slug}`,
          "/sitemap.xml",
          "/feed.xml",
          "/llms.txt",
        ])
          revalidatePath(path);
      } catch {
        console.error(
          "Article saved; route invalidation will retry through the 60-second revalidation window.",
        );
      }
    }
    return json({ post: await getEditorPost(id) }, prior ? 200 : 201);
  } catch (error) {
    if (
      String(error).includes("unique") ||
      (error as { cause?: { code?: string } })?.cause?.code === "23505"
    )
      return json(
        {
          error: "That article URL is already in use. Choose a different slug.",
        },
        409,
      );
    return json(
      {
        error:
          "The article was not saved. Your writing is still here—please try again.",
      },
      503,
    );
  }
}
