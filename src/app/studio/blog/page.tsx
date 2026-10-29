import "@/features/blog/styles/editor.css";
import { PageShell } from "@/components/layout/page-shell";
import { BlogEditor } from "@/features/blog/components/blog-editor";
import { getPageEditor } from "@/features/blog/server/auth";
import { BlogLogin } from "@/features/blog/components/blog-login";
import { listBlogPosts } from "@/features/blog/server/repository";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Blog Editor | Zainab Abdullah",
  robots: { index: false, follow: false },
};
export default async function BlogStudio() {
  const user = await getPageEditor();
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
          <BlogLogin url={process.env.SUPABASE_URL||""} anonKey={process.env.SUPABASE_ANON_KEY||""} />
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
