# Editing content

| File                             | Edit here                                                  |
| -------------------------------- | ---------------------------------------------------------- |
| `src/content/site.json`          | Name, site URL, description, navigation and social URLs    |
| `src/content/home.json`          | Hero copy, introduction, process steps and service tags    |
| `src/content/services.json`      | Service pages, descriptions, deliverables and service FAQs |
| `src/content/faqs.json`          | Shared questions and answers                               |
| `src/content/media.json`         | Portrait source, dimensions, alt text and sample status    |
| `src/content/reviews.json`       | Actual approved client reviews                             |
| `src/content/work.json`          | Approved case studies                                      |
| `src/content/lead-form.json`     | Service, goal, budget and timeline choices                 |
| `src/content/blog-settings.json` | Categories, author and editorial defaults                  |
| `src/content/blog.json`          | Optional source-authored article records                   |

Run `pnpm validate:content` after edits. JSON validation also runs before deployment. Text labels for application controls, validation messages and empty states remain with their relevant components; business records live in content files or the database.

## Daily blog publishing

The recommended daily workflow is `/studio/blog`: create an article, choose its topic, add title/summary/Markdown, preview, save a draft, then publish. SEO title and description are optional overrides. Cover images require alt text. The private editor saves in D1 so posts persist without a source-code deployment. An article can be unpublished back to a draft. Public URLs stay unchanged after first publication.

`blog.json` is an alternative for version-controlled articles with a source deploy. Each record follows `BlogPost` in `src/features/blog/schema.ts`: UUID `id`, `slug`, `title`, `excerpt`, `content`, `category`, `status`, `coverImage`, `coverAlt`, `metaTitle`, `metaDescription`, `author`, millisecond `createdAt`/`updatedAt` and nullable `publishedAt`. Use an actual publication time and the fixed author. Draft records never appear publicly. Source-authored articles are managed in JSON, not the database editor. A database record with the same slug takes precedence, including a draft that hides a source article.

Do not put private enquiries, editor email allowlists or secrets into JSON. The runtime secret `BLOG_EDITOR_EMAILS` remains in Sites.

## Replacing the sample portraits

Place the original image under `public/assets`, edit `media.json` with its local URL, real dimensions and accurate alt text, and set `sample` to `false`. Run `node scripts/optimize-images.mjs`. The generated WebP variants and their manifest are deterministic and fingerprinted. Commit the image, the updated content file and generated variants together.

The loader chooses an appropriate width from the generated manifest. Portraits declare browser `sizes`, width and height; the hero preloads while secondary images are lazy. External blog covers are not silently resized by this pipeline: compress them at their source or add them to the local image pipeline.

Use only authentic testimonials and client-approved work. Unknown social profiles remain disabled until actual URLs are supplied. Before a public launch, replace the labelled sample images and review branding/contact details.
