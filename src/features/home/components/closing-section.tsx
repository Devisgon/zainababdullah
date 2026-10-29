import { ArrowUpRight } from "lucide-react";

export function ClosingSection() {
  return (
    <section className="closing-strip">
      <div className="container">
        <h2>
          A little human insight.
          <br />
          <span className="serif">A lot of possibility.</span>
        </h2>
        <a
          href="#project"
          className="closing-arrow"
          aria-label="Start your project"
        >
          <ArrowUpRight size={45} />
        </a>
      </div>
    </section>
  );
}
