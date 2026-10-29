"use client";
import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { site } from "@/lib/content/site";
const navigation = site.navigation;
export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="/" className="brand" aria-label="Zainab Abdullah home">
          <span className="brand-mark">
            za<span>✳</span>
          </span>
          <span className="brand-name">
            zainab abdullah<span>PAID ADS. HUMAN INSIGHT.</span>
          </span>
        </a>
        <nav aria-label="Main navigation" className="desktop-nav">
          {navigation.map(([label, url]) => (
            <a
              key={url}
              href={url}
              aria-current={pathname === url ? "page" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <a className="button button-small header-cta" href="/contact">
            Let’s talk growth <ArrowUpRight size={17} />
          </a>
          <button
            ref={toggle}
            className="menu-toggle icon-button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          className="mobile-nav"
          id="mobile-nav"
          aria-label="Mobile navigation"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              toggle.current?.focus();
            }
          }}
        >
          {[
            ...navigation,
            ["FAQs", "/faq"],
            ["Let’s talk growth", "/contact"],
          ].map(([label, url]) => (
            <a
              key={url}
              href={url}
              aria-current={pathname === url ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
              <ArrowUpRight size={17} />
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
