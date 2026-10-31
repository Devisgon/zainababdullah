import images from "@/content/blog-images.json";

type ImageAsset = { width: number; height: number; srcSet: string };
export function blogImageAsset(src: string) {
  return (images as Record<string, ImageAsset>)[src];
}
export function BlogImage({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 860px) 92vw, 800px",
}: {
  src?: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
}) {
  const asset = src ? blogImageAsset(src) : undefined;
  return (
    // Local variants are generated before publication, without runtime image work.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={asset?.width}
      height={asset?.height}
      srcSet={asset?.srcSet}
      sizes={asset ? sizes : undefined}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}
