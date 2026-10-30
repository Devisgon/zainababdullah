"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { BrandLogo } from "./brand-logo";
import { site } from "@/lib/content/site";
const navigation = site.navigation;
export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const header = useRef<HTMLElement>(null);
  const active = (url: string) =>
    url === "/"
      ? pathname === "/"
      : pathname === url || pathname.startsWith(url + "/");
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  return (
    <header
      ref={header}
      className="site-header"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          toggle.current?.focus();
        }
      }}
    >
      <div className="container header-inner">
        <a href="/" className="brand" aria-label="Zainab Abdullah home">
          <BrandLogo />
        </a>
        <nav aria-label="Main navigation" className="desktop-nav">
          {[["Home", "/"], ...navigation].map(([label, url]) => (
            <a
              key={url}
              href={url}
              aria-current={active(url) ? "page" : undefined}
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
            ["Home", "/"],
            ...navigation,
            ["Markets", "/markets"],
            ["FAQs", "/faq"],
            ["Let’s talk growth", "/contact"],
          ].map(([label, url]) => (
            <a
              key={url}
              href={url}
              className={url === "/contact" ? "mobile-contact" : undefined}
              aria-current={active(url) ? "page" : undefined}
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
