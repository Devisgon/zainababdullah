import Link from "next/link";
import { SITE_URL } from "@/lib/content/site";
import { JsonLd } from "./json-ld";

export function SectionBreadcrumb({
  name,
  path,
}: {
  name: string;
  path: string;
}) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name, item: SITE_URL + path },
          ],
        }}
      />
      <Link href="/" prefetch={false}>Home</Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{name}</span>
    </nav>
  );
}
