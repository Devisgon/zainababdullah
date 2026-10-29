import { publishedSlugs } from "@/features/blog/server/repository";
export const dynamic = "force-dynamic";
import { SITE_URL } from "@/lib/content/site";
import { services } from "@/features/services/content";
import { workProjects, clientReviews } from "@/lib/content/trust";
export async function GET() {
  const posts = await publishedSlugs();
  const paths = [
    "/",
    "/services",
    "/about",
    "/contact",
    "/faq",
    ...services.map((s) => `/services/${s.slug}`),
    ...(workProjects.length
      ? ["/work", ...workProjects.map((p) => `/work/${p.slug}`)]
      : []),
    ...(clientReviews.length ? ["/reviews"] : []),
    ...(posts.length ? ["/blog"] : []),
  ];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>${SITE_URL}${p === "/" ? "" : p}</loc></url>`).join("")}${posts.map((p) => `<url><loc>${SITE_URL}/blog/${p.slug}</loc><lastmod>${new Date(p.updatedAt).toISOString()}</lastmod></url>`).join("")}</urlset>`,
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "no-store",
      },
    },
  );
}
