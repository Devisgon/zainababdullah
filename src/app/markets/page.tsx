import { PageShell, PageIntro } from "@/components/layout/page-shell";
import { MarketLinks } from "@/features/markets/components/market-links";
import { pageMetadata } from "@/lib/seo/metadata";
export const metadata = pageMetadata(
  "Paid Ads Services: USA, KSA, Kuwait & Qatar",
  "Remote paid advertising support for US, Saudi, Kuwaiti and Qatari businesses. Explore campaign planning, budgets, languages and enquiry journeys.",
  "/markets",
);
export default function Markets() {
  return (
    <PageShell>
      <PageIntro
        name="Markets"
        eyebrow="CLEAR PLANS. RELEVANT AUDIENCES."
        title="Your market."
        accent="Your customer journey."
        description="Explore how remote paid advertising engagements are scoped for each market, with realistic budgets and agreed deliverables."
      />
      <MarketLinks />
    </PageShell>
  );
}
