import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/media/image-loader.ts",
    deviceSizes: [320, 480, 640, 768, 960, 1122, 1440],
    imageSizes: [64, 96, 128, 256],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/how-to-grow-small-business-on-social-media",
        destination: "/blog/how-to-grow-small-business-on-social-media",
        permanent: true,
      },
      {
        source: "/7-types-of-content-every-business-should-post",
        destination: "/blog/7-types-of-content-every-business-should-post",
        permanent: true,
      },
      {
        source: "/social-media-marketing-mistakes",
        destination: "/blog/social-media-marketing-mistakes",
        permanent: true,
      },
      {
        source: "/what-is-digital-marketing",
        destination: "/blog/what-is-digital-marketing",
        permanent: true,
      },
      {
        source: "/how-to-create-social-media-strategy-2026",
        destination: "/blog/how-to-create-social-media-strategy-2026",
        permanent: true,
      },
      {
        source: "/instagram-reach-dropping-despite-consistent-posting",
        destination: "/blog/instagram-reach-dropping-despite-consistent-posting",
        permanent: true,
      },
      {
        source: "/why-meta-ads-suddenly-stopped-working",
        destination: "/blog/why-meta-ads-suddenly-stopped-working",
        permanent: true,
      },
      {
        source: "/your-followers-are-not-your-reach-anymore",
        destination: "/blog/your-followers-are-not-your-reach-anymore",
        permanent: true,
      },
      {
        source: "/why-professional-looking-content-may-be-performing-worse",
        destination: "/blog/why-professional-looking-content-may-be-performing-worse",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/assets/optimized/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }],
      },
      {
        source: "/studio/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store" }],
      },
    ];
  },
};
export default nextConfig;
