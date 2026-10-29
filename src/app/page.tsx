import { PageShell } from "@/components/layout/page-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { homeSchema } from "@/lib/seo/home-schema";
import { SITE_URL } from "@/lib/content/site";
import { HomeBlog } from "@/features/blog/components/home-blog";
import { TrustSections } from "@/features/home/components/trust-sections";
import { HeroSection } from "@/features/home/components/hero-section";
import { ChannelStrip } from "@/features/home/components/channel-strip";
import { ServicesSection } from "@/features/home/components/services-section";
import { AboutSection } from "@/features/home/components/about-section";
import { ProcessSection } from "@/features/home/components/process-section";
import { AnalysisSection } from "@/features/home/components/analysis-section";
import { ProjectSection } from "@/features/home/components/project-section";
import { FAQSection } from "@/features/home/components/faq-section";
import { ClosingSection } from "@/features/home/components/closing-section";

export const revalidate = 60;
export const metadata = { alternates: { canonical: SITE_URL } };
export default function Home() {
  return (
    <PageShell>
      <JsonLd data={homeSchema()} />
      <HeroSection />
      <ChannelStrip />
      <ServicesSection />
      <AboutSection />
      <ProcessSection />
      <TrustSections />
      <AnalysisSection />
      <HomeBlog />
      <ProjectSection />
      <FAQSection />
      <ClosingSection />
    </PageShell>
  );
}
