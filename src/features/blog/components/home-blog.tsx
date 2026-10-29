import { ArrowUpRight } from "lucide-react";
import { listBlogPosts } from "@/features/blog/server/repository";
import { BlogCard } from "./blog-card";
export async function HomeBlog() {
  const { posts } = await listBlogPosts({ limit: 3 });
  return (
    <section className="section container home-blog">
      <div className="section-heading">
        <div>
          <span className="eyebrow">FROM THE BLOG</span>
          <h2>
            Ideas with
            <br />
            <span className="serif">somewhere to go.</span>
          </h2>
        </div>
        <a className="text-link" href="/blog">
          Explore the blog <ArrowUpRight size={17} />
        </a>
      </div>
      {posts.length ? (
        <div className="blog-grid">
          {posts.map((p) => (
            <BlogCard key={p.id} post={p} />
          ))}
        </div>
      ) : (
        <div className="home-blog-pending">
          <p>
            New thoughts on paid ads, content and business clarity are on their
            way.
          </p>
          <a href="/blog">
            Visit the blog <ArrowUpRight size={18} />
          </a>
        </div>
      )}
    </section>
  );
}
