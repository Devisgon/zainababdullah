import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { SOCIAL_IMAGE } from "@/lib/seo/metadata";
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
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zainab Abdullah | Paid Ads & Growth Strategy",
    description: SITE_DESCRIPTION,
    images: [{ url: SOCIAL_IMAGE.url, alt: SOCIAL_IMAGE.alt }],
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
        <script
          id="microsoft-clarity"
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "z5y761zglb");`,
          }}
        />
      </head>
      <body>
        {children}
        <Script
          id="google-tag"
          src="https://www.googletagmanager.com/gtag/js?id=G-ECJMGJY90E"
          strategy="afterInteractive"
        />
        <Script id="ga4-config" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-ECJMGJY90E');`}
        </Script>
      </body>
    </html>
  );
}
