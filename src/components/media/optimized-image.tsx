"use client";
import Image, { type ImageProps } from "next/image";
import imageLoader from "@/lib/media/image-loader";
import manifest from "@/lib/media/image-manifest.json";

type Asset = { variants: { src: string; width: number }[] };
/** Explicit srcset preserves responsive loading through the Next.js image loader. */
export function OptimizedImage({
  preload = false,
  ...props
}: Omit<ImageProps, "loader">) {
  const asset =
    typeof props.src === "string"
      ? (manifest as Record<string, Asset>)[props.src]
      : undefined;
  const srcSet = asset?.variants
    .map((variant) => `${variant.src} ${variant.width}w`)
    .join(", ");
  const imageProps = {
    ...props,
    srcSet,
    preload: false,
    loading: preload ? ("eager" as const) : props.loading,
    fetchPriority: preload ? ("high" as const) : props.fetchPriority,
  };
  return (
    <>
      {preload && srcSet && (
        <link
          rel="preload"
          as="image"
          imageSrcSet={srcSet}
          imageSizes={props.sizes}
          fetchPriority="high"
        />
      )}
      <Image {...imageProps} loader={imageLoader} />
    </>
  );
}
