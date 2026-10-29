import type { Metadata } from "next";
import { SITE_URL } from "@/lib/content/site";
export function pageMetadata(
  title: string,
  description: string,
  path: string,
  index = true,
): Metadata {
  return {
    title: `${title} | Zainab Abdullah`,
    description,
    alternates: { canonical: SITE_URL + path },
    robots: { index, follow: true },
    openGraph: {
      title: `${title} | Zainab Abdullah`,
      description,
      url: SITE_URL + path,
      siteName: "Zainab Abdullah",
      type: "website",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Zainab Abdullah`,
      description,
      images: ["/og-image.png"],
    },
  };
}
