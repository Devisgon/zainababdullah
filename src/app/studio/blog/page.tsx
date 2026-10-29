import "@/features/blog/styles/editor.css";
import { PageShell } from "@/components/layout/page-shell";
import { BlogEditor } from "@/features/blog/components/blog-editor";
import { getChatGPTUser, chatGPTSignInPath } from "@/lib/platform/chatgpt-auth";
import { isBlogEditor } from "@/features/blog/server/auth";
import { listBlogPosts } from "@/features/blog/server/repository";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Blog Editor | Zainab Abdullah",
  robots: { index: false, follow: false },
};
export default async function BlogStudio() {
  const user = await getChatGPTUser();
  if (!user)
    return (
      <PageShell>
        <section className="container studio-access">
          <span className="eyebrow">A SPACE FOR YOUR IDEAS</span>
          <h1>
            Your writing room.
            <br />
            <span className="serif">One sign-in away.</span>
          </h1>
          <p>
            Sign in with the ChatGPT account authorised to manage this website’s
            articles.
          </p>
          <a
            href={chatGPTSignInPath("/studio/blog")}
            target="_top"
            className="button"
          >
            Sign in to the blog editor ↗
          </a>
        </section>
      </PageShell>
    );
  if (!isBlogEditor(user))
    return (
      <PageShell>
        <section className="container studio-access">
          <span className="eyebrow">PUBLISHING ACCESS REQUIRED</span>
          <h1>
            This is the
            <br />
            <span className="serif">editor’s space.</span>
          </h1>
          <p>
            This account does not have permission to manage articles. Use the
            account authorised by the website owner.
          </p>
          <a href="/blog" className="button">
            Read the blog ↗
          </a>
        </section>
      </PageShell>
    );
  const { posts } = await listBlogPosts({ editor: true, limit: 100 });
  return (
    <PageShell>
      <BlogEditor initialPosts={posts} />
    </PageShell>
  );
}
