import { JsonLd } from "@/components/seo/json-ld";
import { PageShell, PageIntro, PageCTA } from "@/components/layout/page-shell";
import { faqs } from "@/lib/content/faqs";
import { SITE_URL } from "@/lib/content/site";
import { pageMetadata } from "@/lib/seo/metadata";
export const metadata = pageMetadata(
  "Frequently Asked Questions",
  "Answers about working with Zainab Abdullah: advertising channels, budgets, scope, business analysis and international collaboration.",
  "/faq",
);
export default function FAQ() {
  const extra = [
    ...faqs,
    [
      "Can I hire you just for diagrams or documentation?",
      "Yes. Business analysis can be a separate engagement. Share the process or system you need to explain and the audience the documentation is intended for. The scope can include UML, BPMN, swimlanes, workflows, architecture diagrams and technical documentation.",
    ],
    [
      "Is a WhatsApp number required with my enquiry?",
      "Yes. The last step of the enquiry form requires your WhatsApp number. Include your country code. Your details are used to review and discuss this enquiry; submitting the form does not subscribe you to marketing messages.",
    ],
    [
      "What should I prepare before we speak?",
      "A short description of your business, the problem you want to solve, your target market and any existing website, campaigns or documentation is a useful start. You do not need to share passwords or account access in the project form.",
    ],
  ];
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: SITE_URL + "/faq",
    mainEntity: extra.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
  return (
    <PageShell>
      <JsonLd data={schema} />
      <PageIntro
        name="FAQs"
        eyebrow="A LITTLE CLARITY BEFORE WE BEGIN"
        title="Good questions."
        accent="Useful answers."
        description="The practical details of working together, from choosing a channel to agreeing on a scope."
      />
      <section className="container faq-page-list">
        {extra.map(([q, a], i) => (
          <details className="faq-item" key={q}>
            <summary>
              <span className="faq-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{q}</span>
              <span className="faq-plus" aria-hidden="true">
                +
              </span>
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
      <PageCTA
        title="Still thinking it through?"
        accent="Let’s talk about your situation."
      />
    </PageShell>
  );
}
