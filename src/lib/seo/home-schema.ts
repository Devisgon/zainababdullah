import { SITE_URL, LINKEDIN_URL, site } from "@/lib/content/site";
import { services } from "@/features/services/content";
import { faqs } from "@/lib/content/faqs";
export function homeSchema() {
  const structured = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#zainab`,
        name: "Zainab Abdullah",
        url: SITE_URL,
        sameAs: [LINKEDIN_URL],
        jobTitle: "Digital Marketing Expert & Business Analyst",
        description:
          "Digital marketing professional since July 2026, with a psychology background and more than two years of business analysis experience.",
        knowsAbout: [
          "Meta Ads",
          "TikTok Ads",
          "Google Ads",
          "Content Marketing",
          "Psychology",
          "Business Analysis",
          "UML",
          "BPMN",
          "Process Mapping",
        ],
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#business`,
        name: "Zainab Abdullah — Paid Ads & Growth Strategy",
        url: SITE_URL,
        description:
          "Remote paid advertising, content marketing and business analysis services for clients worldwide.",
        founder: { "@id": `${SITE_URL}/#zainab` },
        areaServed: "Worldwide",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.name,
              url: `${SITE_URL}/services/${s.slug}`,
              provider: { "@id": `${SITE_URL}/#business` },
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Zainab Abdullah",
        url: SITE_URL,
        inLanguage: "en",
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map(([q, a]) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  };
  return structured;
}
