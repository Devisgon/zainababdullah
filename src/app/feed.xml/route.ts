export const revalidate = 3600;
import { listBlogPosts } from "@/features/blog/server/repository";
import { SITE_URL } from "@/lib/content/site";
const xml = (v: string) =>
  v.replace(
    /[<>&'\"]/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[c]!,
  );
export async function GET() {
  const { posts } = await listBlogPosts({ limit: 20 });
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Zainab Abdullah — Blog</title><link>${SITE_URL}/blog</link><description>Paid ads, content and business clarity.</description><language>en</language>${posts.map((p) => `<item><title>${xml(p.title)}</title><link>${SITE_URL}/blog/${p.slug}</link><guid isPermaLink="true">${SITE_URL}/blog/${p.slug}</guid><description>${xml(p.excerpt)}</description><pubDate>${new Date(p.publishedAt!).toUTCString()}</pubDate><category>${xml(p.category)}</category></item>`).join("")}</channel></rss>`,
    {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=60",
      },
    },
  );
}
