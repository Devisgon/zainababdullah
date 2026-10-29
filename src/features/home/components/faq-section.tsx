import { ArrowUpRight } from "lucide-react";
import { faqs } from "@/lib/content/faqs";
export function FAQSection() {
  return (
    <section className="section container faq-section" id="faq">
      <div className="faq-intro">
        <span className="eyebrow">
          <span className="section-number">05 /</span>GOOD QUESTIONS
        </span>
        <h2>
          A little clarity
          <br />
          <span className="serif">before we begin.</span>
        </h2>
        <p>
          Something else on your mind?
          <br />
          <a href="#project" className="text-link">
            Let’s talk it through <ArrowUpRight size={16} />
          </a>
        </p>
      </div>
      <div className="faq-list">
        {faqs.map(([q, a], i) => (
          <details className="faq-item" key={q}>
            <summary>
              <span className="faq-number">0{i + 1}</span>
              <span>{q}</span>
              <span className="faq-plus" aria-hidden="true">
                +
              </span>
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
