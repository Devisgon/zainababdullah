import type { Metadata } from "next";
import { SITE_URL } from "@/lib/content/site";
import seo from "@/content/seo.json";
const imageUrl = new URL(seo.socialImage.src, SITE_URL).toString();
export const SOCIAL_IMAGE = {
  url: imageUrl,
  secureUrl: imageUrl,
  width: seo.socialImage.width,
  height: seo.socialImage.height,
  type: seo.socialImage.type,
  alt: seo.socialImage.alt,
};
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
      locale: "en_US",
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Zainab Abdullah`,
      description,
      images: [{ url: SOCIAL_IMAGE.url, alt: SOCIAL_IMAGE.alt }],
    },
  };
}
