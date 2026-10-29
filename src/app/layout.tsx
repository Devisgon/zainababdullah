import type { Metadata, Viewport } from "next";
import { SITE_URL, SITE_DESCRIPTION } from "@/lib/content/site";
import "./globals.css";
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f8fc" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1D3A" },
  ],
};
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Zainab Abdullah | Meta, TikTok & Google Ads Specialist",
    template: "%s",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Zainab Abdullah",
  authors: [{ name: "Zainab Abdullah", url: SITE_URL }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Zainab Abdullah",
    title: "Meta, TikTok & Google Ads | Zainab Abdullah",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zainab Abdullah — Paid ads. Human insight.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zainab Abdullah | Paid Ads & Growth Strategy",
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Zainab Abdullah — Blog"
          href="/feed.xml"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var saved;try{saved=localStorage.getItem("zainab-theme")}catch(e){}var theme=saved==="light"||saved==="dark"?saved:(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme})()`,
          }}
        />
        <link
          rel="preload"
          href="/fonts/nimbus-sans-regular.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
