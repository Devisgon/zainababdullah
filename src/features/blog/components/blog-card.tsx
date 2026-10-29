import { ArrowUpRight, FileText } from "lucide-react";
import { articleDate, type BlogSummary } from "@/features/blog/schema";
export function BlogCard({ post }: { post: BlogSummary }) {
  return (
    <article className="blog-card">
      <a
        href={`/blog/${post.slug}`}
        className={`blog-card-image ${post.coverImage ? "" : "blog-no-cover"}`}
        aria-label={`Read ${post.title}`}
      >
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.coverAlt}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <>
            <FileText size={38} />
            <span>{post.category}</span>
            <ArrowUpRight size={24} />
          </>
        )}
      </a>
      <div className="blog-card-copy">
        <div className="blog-card-meta">
          <span>{post.category}</span>
          <time
            dateTime={new Date(
              post.publishedAt || post.createdAt,
            ).toISOString()}
          >
            {articleDate(post.publishedAt || post.createdAt)}
          </time>
        </div>
        <h2>
          <a href={`/blog/${post.slug}`}>{post.title}</a>
        </h2>
        <p>{post.excerpt}</p>
        <a className="text-link" href={`/blog/${post.slug}`}>
          Read the article <ArrowUpRight size={16} />
        </a>
      </div>
    </article>
  );
}
