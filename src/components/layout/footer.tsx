import { ArrowUpRight } from "lucide-react";
import { SocialLinks } from "./social-links";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <a href="/" className="footer-brand">
            zainab abdullah<span>Strategy with a human side.</span>
          </a>
          <div className="footer-navigation">
            <a href="/services">Services</a>
            <a href="/markets">Markets</a>
            <a href="/work">My work</a>
            <a href="/about">About</a>
            <a href="/reviews">Client reviews</a>
            <a href="/blog">Blog</a>
            <a href="/faq">FAQs</a>
            <a href="/contact">
              Contact <ArrowUpRight size={13} />
            </a>
          </div>
          <div className="footer-social">
            <span>FIND ME AROUND THE WEB</span>
            <SocialLinks compact />
            <small>More profile links coming soon.</small>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Zainab Abdullah. Made for meaningful
            growth.
          </p>
          <a href="/privacy">Privacy & your data</a>
          <span>
            <span className="status-dot" />
            Working with businesses worldwide
          </span>
        </div>
      </div>
    </footer>
  );
}
