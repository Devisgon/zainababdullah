import { readFileSync } from "node:fs";
import { z } from "zod";
import { blogInputSchema } from "../src/features/blog/schema";
const read = (name: string) =>
  JSON.parse(readFileSync(`src/content/${name}.json`, "utf8"));
const nonempty = z.string().min(1);
const slug = nonempty.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const site = z.object({
  name: nonempty,
  siteUrl: z.string().url(),
  linkedInUrl: z.string().url(),
  description: nonempty,
  navigation: z.array(z.tuple([nonempty, nonempty])),
  socialProfiles: z.array(
    z.object({ name: nonempty, url: z.string().url().nullable() }),
  ),
});
site.parse(read("site"));
const service = z.object({
  slug,
  name: nonempty,
  number: nonempty,
  short: nonempty,
  title: nonempty,
  description: nonempty,
  tags: z.array(nonempty),
  fit: nonempty,
  seoTitle: nonempty,
  intro: nonempty,
  deliverables: z.array(z.tuple([nonempty, nonempty])),
  questions: z.array(z.tuple([nonempty, nonempty])),
});
const services = z.array(service).parse(read("services"));
if (new Set(services.map((s) => s.slug)).size !== services.length)
  throw new Error("Duplicate service URL");
z.array(z.tuple([nonempty, nonempty])).parse(read("faqs"));
const reviews = z
  .array(
    z.object({
      id: nonempty,
      quote: nonempty,
      clientName: nonempty,
      platform: z.enum(["Fiverr", "Upwork", "Direct"]),
      rating: z.number().min(1).max(5).optional(),
      service: nonempty.optional(),
      sourceUrl: z.string().url().optional(),
    }),
  )
  .parse(read("reviews"));
if (new Set(reviews.map((review) => review.id)).size !== reviews.length)
  throw new Error("Duplicate review ID");
z.array(
  z.object({
    slug,
    title: nonempty,
    category: z.enum(["Paid media", "Content marketing", "Business analysis"]),
    service: nonempty,
    summary: nonempty,
    challenge: nonempty,
    approach: nonempty,
    deliverables: z.array(nonempty),
  }),
).parse(read("work"));
const portrait = z.object({
  src: nonempty.startsWith("/assets/"),
  alt: nonempty,
  width: z.number().positive(),
  height: z.number().positive(),
  sample: z.boolean().optional(),
  objectPosition: z.string().optional(),
});
z.object({
  primary: portrait.nullable(),
  secondary: portrait.nullable(),
}).parse(read("media"));
for (const image of Object.values(read("media")) as { src: string }[])
  if (image) readFileSync(`public${image.src}`);
const record = blogInputSchema
  .innerType()
  .omit({ expectedUpdatedAt: true })
  .extend({
    id: z.string().uuid(),
    author: nonempty,
    createdAt: z.number().int().positive(),
    updatedAt: z.number().int().positive(),
    publishedAt: z.number().int().positive().nullable(),
  });
const posts = z.array(record).parse(read("blog"));
for (const post of posts) {
  const { author, createdAt, updatedAt, publishedAt, ...input } = post;
  blogInputSchema.parse(input);
  if (post.status === "published" && !post.publishedAt)
    throw new Error("Published articles need a publication date");
}
if (new Set(posts.map((p) => p.slug)).size !== posts.length)
  throw new Error("Duplicate blog URL");
const settings = read("blog-settings");
z.object({
  categories: z.array(nonempty).min(1),
  author: nonempty,
  timeZone: nonempty,
  wordsPerMinute: z.number().positive(),
  revalidateSeconds: z.number().positive(),
}).parse(settings);
console.log("JSON content and referenced media validated.");

const markets = z
  .array(
    z.object({
      slug,
      name: nonempty,
      label: nonempty,
      code: z.string().length(2),
      currency: nonempty,
      timezone: nonempty,
      title: nonempty,
      description: nonempty,
      intro: nonempty,
      sections: z.array(z.tuple([nonempty, nonempty])).min(3),
      questions: z.array(z.tuple([nonempty, nonempty])).min(1),
    }),
  )
  .parse(read("markets"));
if (new Set(markets.map((m) => m.slug)).size !== markets.length)
  throw new Error("Duplicate market URL");
