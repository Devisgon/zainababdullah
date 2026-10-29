import { ArrowUpRight } from "lucide-react";
import { services } from "@/features/services/content";
import { ServiceTabs } from "@/features/services/components/service-tabs";
export function ServicesSection() {
  return (
    <section id="services" className="section container">
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            <span className="section-number">01 /</span>HOW I CAN HELP
          </span>
          <h2>
            Your next chapter.
            <br />
            <span className="serif">The right kind of attention.</span>
          </h2>
        </div>
        <p>
          From the first impression to the next click, give every touchpoint a
          purpose. Choose the support your business needs.
        </p>
      </div>
      <ServiceTabs
        services={services
          .slice(0, 4)
          .map(
            ({ slug, number, name, short, title, description, tags, fit }) => ({
              slug,
              number,
              name,
              short,
              title,
              description,
              tags,
              fit,
            }),
          )}
      />
      <p className="service-note">
        Not sure where to begin?{" "}
        <a href="/services">
          Explore all services <ArrowUpRight size={14} />
        </a>
      </p>
    </section>
  );
}
