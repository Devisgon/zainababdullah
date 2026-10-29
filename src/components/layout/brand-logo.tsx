import branding from "@/content/branding.json";
/** Both files preserve the supplied artwork; theme selection is handled by CSS. */
export function BrandLogo() {
  return (
    <span className="brand-logo" aria-hidden="true">
      {/* Local optimised WebP logos need no runtime image transformation. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="brand-logo-light"
        src={branding.logo.light}
        width={branding.logo.width}
        height={branding.logo.height}
        alt=""
        decoding="async"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="brand-logo-dark"
        src={branding.logo.dark}
        width={branding.logo.width}
        height={branding.logo.height}
        alt=""
        decoding="async"
      />
    </span>
  );
}
