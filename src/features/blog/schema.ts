import settings from "@/content/blog-settings.json";
import { z } from "zod";
export const blogCategories = settings.categories as [string, ...string[]];
export type BlogCategory = (typeof blogCategories)[number];
export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  status: "draft" | "published";
  coverImage: string;
  coverAlt: string;
  metaTitle: string;
  metaDescription: string;
  author: string;
  createdAt: number;
  updatedAt: number;
  publishedAt: number | null;
};
export type BlogSummary = Omit<BlogPost, "content">;
export function makeSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 130);
}
export function readingMinutes(text: string) {
  return Math.max(
    1,
    Math.ceil(
      text.trim().split(/\s+/).filter(Boolean).length / settings.wordsPerMinute,
    ),
  );
}
export function articleDate(value: number) {
  return new Intl.DateTimeFormat(settings.locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: settings.timeZone,
  }).format(new Date(value));
}
function safeCover(value: string) {
  if (!value) return true;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}
export const blogInputSchema = z
  .object({
    id: z.string().uuid().optional(),
    expectedUpdatedAt: z.number().int().positive().optional(),
    title: z.string().trim().min(1, "Add a title before saving.").max(160),
    slug: z
      .string()
      .trim()
      .min(3, "Use at least three characters for the URL.")
      .max(140)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use lowercase letters, numbers and single hyphens.",
      ),
    excerpt: z.string().trim().max(320),
    content: z.string().max(80000),
    category: z.enum(blogCategories),
    status: z.enum(["draft", "published"]),
    coverImage: z
      .string()
      .trim()
      .max(1000)
      .refine(safeCover, "Use an HTTPS image URL or a local /assets/ path."),
    coverAlt: z.string().trim().max(220),
    metaTitle: z.string().trim().max(70),
    metaDescription: z.string().trim().max(170),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.status === "published") {
      if (value.title.length < 8)
        ctx.addIssue({
          code: "custom",
          path: ["title"],
          message:
            "Give the published article a descriptive title (at least 8 characters).",
        });
      if (value.excerpt.length < 20)
        ctx.addIssue({
          code: "custom",
          path: ["excerpt"],
          message:
            "Add a short summary before publishing (at least 20 characters).",
        });
      if (value.content.trim().length < 80)
        ctx.addIssue({
          code: "custom",
          path: ["content"],
          message:
            "Add the article text before publishing (at least 80 characters).",
        });
    }
    if (value.coverImage && !value.coverAlt)
      ctx.addIssue({
        code: "custom",
        path: ["coverAlt"],
        message: "Describe the cover image for readers using screen readers.",
      });
  });
export type BlogInput = z.infer<typeof blogInputSchema>;
