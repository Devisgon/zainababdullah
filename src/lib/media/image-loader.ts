"use client";
import manifest from "./image-manifest.json";
import type { ImageLoaderProps } from "next/image";
type ImageManifest = Record<
  string,
  {
    width: number;
    height: number;
    variants: { width: number; src: string; bytes: number }[];
  }
>;

/** Prebuilt responsive assets work on both Next.js and Sites without a paid image service. */
export default function imageLoader({ src, width }: ImageLoaderProps): string {
  const asset = (manifest as ImageManifest)[src];
  if (!asset) return src;
  return (asset.variants.find((variant) => variant.width >= width) ||
    asset.variants.at(-1))!.src;
}
