import { markets } from "@/features/markets/content";
export const revalidate = 3600;
import { listBlogPosts } from "@/features/blog/server/repository";
import { SITE_URL } from "@/lib/content/site";
import { services } from "@/features/services/content";
import {
  socialProfiles,
  workProjects,
  clientReviews,
} from "@/lib/content/trust";
export async function GET() {
  const { posts } = await listBlogPosts({ limit: 20 });
  return new Response(
    `# Zainab Abdullah\n\n> Zainab Abdullah is CEO of Devisgon Private Limited and a psychology graduate turned digital marketer, with a business analysis background. She works remotely with clients worldwide.\n\nDigital marketing has been her professional focus since August 2026. Business analysis experience exceeds two years. Primary services are Meta ads (Facebook and Instagram), TikTok ads and Google Ads. Content marketing is a supporting service. Business analysis is also available as a separate engagement.\n\n## Services\n${services.map((s) => `- [${s.name}](${SITE_URL}/services/${s.slug}): ${s.description}`).join("\n")}\n\n## Markets\n${markets.map((m) => `- [${m.name}](${SITE_URL}/markets/${m.slug}): ${m.description}`).join("\n")}\n\n## About and enquiries\n- [About Zainab](${SITE_URL}/about)\n- [All services](${SITE_URL}/services)\n- [FAQs](${SITE_URL}/faq)\n- [Project enquiry](${SITE_URL}/contact): Five-step brief with email and required WhatsApp details.\n- [Privacy](${SITE_URL}/privacy)\n${workProjects.length ? `- [Client projects](${SITE_URL}/work)\n` : ""}${clientReviews.length ? `- [Client reviews](${SITE_URL}/reviews)\n` : ""}\n${posts.length ? `## Articles\n${posts.map((p) => `- [${p.title.replace(/[\[\]\n]/g, " ")}](${SITE_URL}/blog/${p.slug}): ${p.excerpt.replace(/\n/g, " ")}`).join("\n")}\n\n` : ""}## Confirmed social profiles\n${socialProfiles
      .filter((p) => p.url)
      .map((p) => `- [${p.name}](${p.url})`)
      .join(
        "\n",
      )}\n\nBusiness analysis includes UML, BPMN, swimlanes, process mapping, workflows, architecture diagrams and technical documentation. No unverified testimonials, ratings, certifications or performance figures are claimed.\n`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=60",
      },
    },
  );
}
