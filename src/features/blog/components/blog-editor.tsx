"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Plus,
  Save,
  Send,
  Eye,
  PenLine,
  Search,
  Loader2,
  FileText,
  ArrowLeft,
} from "lucide-react";
import {
  blogCategories,
  blogInputSchema,
  makeSlug,
  readingMinutes,
  articleDate,
  type BlogInput,
  type BlogPost,
  type BlogSummary,
} from "@/features/blog/schema";
import { SITE_URL } from "@/lib/content/site";
import { MarkdownContent } from "./markdown-content";
function emptyPost(): BlogInput {
  return {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Strategy",
    status: "draft",
    coverImage: "",
    coverAlt: "",
    metaTitle: "",
    metaDescription: "",
  };
}
function fromPost(p: BlogPost): BlogInput {
  return {
    id: p.id,
    expectedUpdatedAt: p.updatedAt,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    content: p.content,
    category: p.category,
    status: p.status,
    coverImage: p.coverImage,
    coverAlt: p.coverAlt,
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
  };
}
export function BlogEditor({
  initialPosts,
  apiBase = "/api/blog/posts",
}: {
  initialPosts: BlogSummary[];
  apiBase?: string;
}) {
  const [posts, setPosts] = useState(initialPosts),
    [draft, setDraft] = useState<BlogInput>(emptyPost),
    [activePost, setActivePost] = useState<BlogPost | null>(null),
    [dirty, setDirty] = useState(false),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(false),
    [preview, setPreview] = useState(false),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("all"),
    [message, setMessage] = useState(""),
    [errors, setErrors] = useState<Record<string, string>>({});
  const bodyRef = useRef<HTMLTextAreaElement>(null),
    saveLock = useRef(false);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function update<K extends keyof BlogInput>(key: K, value: BlogInput[K]) {
    setDraft((d) => ({
      ...d,
      [key]: value,
      ...(key === "title" && !d.id && (!d.slug || d.slug === makeSlug(d.title))
        ? { slug: makeSlug(String(value)) }
        : {}),
    }));
    setDirty(true);
    setMessage("");
    setErrors((e) => ({ ...e, [key]: "", save: "" }));
  }
  function discardAllowed() {
    return !dirty || window.confirm("Discard your unsaved changes?");
  }
  function newArticle() {
    if (!discardAllowed()) return;
    setDraft(emptyPost());
    setActivePost(null);
    setDirty(false);
    setErrors({});
    setMessage("");
    setPreview(false);
  }
  async function openArticle(id: string) {
    if (!discardAllowed()) return;
    setLoading(true);
    setErrors({});
    setMessage("");
    try {
      const r = await fetch(`${apiBase}/${id}`, { cache: "no-store" });
      const data = (await r.json()) as { post?: BlogPost; error?: string };
      if (!r.ok || !data.post)
        throw Error(data.error || "This article could not be loaded.");
      setActivePost(data.post);
      setDraft(fromPost(data.post));
      setDirty(false);
      setPreview(false);
    } catch (error) {
      setErrors({
        save:
          error instanceof Error
            ? error.message
            : "This article could not be loaded.",
      });
    } finally {
      setLoading(false);
    }
  }
  async function findArticles(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const r = await fetch(`${apiBase}?q=${encodeURIComponent(query)}`, {
        cache: "no-store",
      });
      const data = (await r.json()) as {
        posts?: BlogSummary[];
        error?: string;
      };
      if (!r.ok || !data.posts)
        throw Error(data.error || "The articles could not be loaded.");
      setPosts(data.posts);
    } catch (error) {
      setErrors({
        save:
          error instanceof Error ? error.message : "Search failed. Try again.",
      });
    } finally {
      setLoading(false);
    }
  }
  async function save(status: "draft" | "published") {
    if (saveLock.current) return;
    const parsed = blogInputSchema.safeParse({ ...draft, status });
    if (!parsed.success) {
      const fields: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] || "save");
        if (!fields[key]) fields[key] = issue.message;
      }
      setErrors({ ...fields, save: parsed.error.issues[0].message });
      setPreview(false);
      return;
    }
    saveLock.current = true;
    setBusy(true);
    setMessage("");
    setErrors({});
    try {
      const r = await fetch(apiBase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await r.json()) as {
        post?: BlogPost;
        error?: string;
        fields?: Record<string, string[]>;
      };
      if (!r.ok || !data.post)
        throw Error(data.error || "The article was not saved.");
      const post = data.post;
      setActivePost(post);
      setDraft(fromPost(post));
      setDirty(false);
      const { content, ...summary } = post;
      setPosts((items) => [summary, ...items.filter((p) => p.id !== post.id)]);
      setMessage(
        status === "published"
          ? "Article published. It is now available on the blog."
          : "Draft saved. It is visible only in the editor.",
      );
    } catch (error) {
      setErrors({
        save:
          error instanceof Error
            ? error.message
            : "Your article could not be saved. Your writing is still here.",
      });
    } finally {
      saveLock.current = false;
      setBusy(false);
    }
  }
  function insert(before: string, after = "") {
    const el = bodyRef.current;
    if (!el) return;
    const start = el.selectionStart,
      end = el.selectionEnd;
    const selected = draft.content.slice(start, end);
    update(
      "content",
      draft.content.slice(0, start) +
        before +
        selected +
        after +
        draft.content.slice(end),
    );
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(
        start + before.length,
        start + before.length + selected.length,
      );
    });
  }
  const textField = (
    key:
      | "title"
      | "slug"
      | "coverImage"
      | "coverAlt"
      | "metaTitle"
      | "metaDescription",
    label: string,
    placeholder: string,
    max: number,
  ) => (
    <div className={`editor-field editor-field-${key}`}>
      <label htmlFor={`blog-${key}`}>{label}</label>
      <input
        id={`blog-${key}`}
        value={draft[key]}
        placeholder={placeholder}
        maxLength={max}
        readOnly={key === "slug" && !!activePost?.publishedAt}
        aria-invalid={!!errors[key]}
        onChange={(e) => update(key, e.target.value)}
      />
      {key === "slug" && (
        <p>
          {activePost?.publishedAt
            ? "Published URLs stay consistent. You can still update the title and article."
            : `${SITE_URL}/blog/${draft.slug || "your-article-url"}`}
        </p>
      )}
      {errors[key] && <span className="field-error">{errors[key]}</span>}
    </div>
  );
  const visible = posts.filter((p) => filter === "all" || p.status === filter);
  return (
    <section className="container writing-room">
      <div className="studio-top">
        <div>
          <a className="studio-back" href="/blog">
            <ArrowLeft size={14} />
            Back to the blog
          </a>
          <span className="eyebrow">YOUR WRITING ROOM</span>
          <h1>
            Good ideas.
            <br />
            <span className="serif">Ready to share.</span>
          </h1>
        </div>
        <button
          className="button"
          onClick={newArticle}
          disabled={busy || loading}
        >
          <Plus size={17} />
          New article
        </button>
      </div>
      <div className="studio-layout">
        <aside className="studio-sidebar">
          <div className="sidebar-title">
            <h2>Your articles</h2>
            <FileText size={18} />
          </div>
          <form className="studio-search" onSubmit={findArticles}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search titles & summaries"
              aria-label="Search your articles"
              maxLength={150}
            />
            <button
              type="submit"
              aria-label="Find your articles"
              disabled={loading}
            >
              <Search size={16} />
            </button>
          </form>
          <div
            className="studio-filters"
            role="group"
            aria-label="Filter article status"
          >
            {["all", "draft", "published"].map((s) => (
              <button
                type="button"
                key={s}
                aria-pressed={filter === s}
                onClick={() => setFilter(s)}
              >
                {s === "all" ? "All" : s === "draft" ? "Drafts" : "Published"}
              </button>
            ))}
          </div>
          <div className="studio-post-list">
            {visible.length ? (
              visible.map((p) => (
                <button
                  key={p.id}
                  className={`studio-post ${draft.id === p.id ? "active" : ""}`}
                  onClick={() => openArticle(p.id)}
                  disabled={busy || loading}
                >
                  <span className={`post-status post-status-${p.status}`}>
                    {p.status}
                  </span>
                  <strong>{p.title}</strong>
                  <small>Updated {articleDate(p.updatedAt)}</small>
                </button>
              ))
            ) : (
              <div className="studio-list-empty">
                <FileText size={24} />
                <p>
                  {query
                    ? "No articles match your search."
                    : "Your first article starts here."}
                </p>
                <span>
                  Write, save a draft, then publish when you’re ready.
                </span>
              </div>
            )}
          </div>
        </aside>
        <div className="studio-main" id="article-editor">
          <div className="editor-topbar">
            <div>
              <span
                className={`post-status post-status-${activePost?.status || "draft"}`}
              >
                {activePost?.status || "New draft"}
              </span>
              <small>
                {dirty
                  ? "Unsaved changes"
                  : activePost
                    ? "All changes saved"
                    : "Start with a title"}
              </small>
            </div>
            <div
              className="editor-view-tabs"
              role="group"
              aria-label="Editor view"
            >
              <button
                type="button"
                aria-pressed={!preview}
                onClick={() => setPreview(false)}
              >
                <PenLine size={14} />
                Write
              </button>
              <button
                type="button"
                aria-pressed={preview}
                onClick={() => setPreview(true)}
              >
                <Eye size={15} />
                Preview
              </button>
            </div>
          </div>
          <div aria-live="polite" role="status">
            {message && <p className="editor-message">{message}</p>}
            {errors.save && <p className="editor-error">{errors.save}</p>}
          </div>
          {loading ? (
            <div className="editor-loading">
              <Loader2 className="spin" size={25} />
              Loading your article…
            </div>
          ) : preview ? (
            <div className="editor-preview">
              <span className="eyebrow">{draft.category}</span>
              <h2>{draft.title || "Your article title"}</h2>
              <p className="article-excerpt">
                {draft.excerpt || "Your summary appears here."}
              </p>
              {draft.coverImage && (
                <img
                  className="editor-preview-cover"
                  src={draft.coverImage}
                  alt={draft.coverAlt}
                />
              )}
              <MarkdownContent
                content={draft.content || "Your article will take shape here."}
              />
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                save("draft");
              }}
              noValidate
            >
              <fieldset className="editor-fields" disabled={busy}>
                {textField(
                  "title",
                  "Article title",
                  "What would you like to share?",
                  160,
                )}
                <div className="editor-row">
                  {textField(
                    "slug",
                    "Article URL",
                    "a-clear-article-title",
                    140,
                  )}
                  <div className="editor-field">
                    <label htmlFor="blog-category">Topic</label>
                    <select
                      id="blog-category"
                      value={draft.category}
                      onChange={(e) =>
                        update(
                          "category",
                          e.target.value as BlogInput["category"],
                        )
                      }
                    >
                      {blogCategories.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="editor-field">
                  <label htmlFor="blog-excerpt">
                    Short summary <small>{draft.excerpt.length}/320</small>
                  </label>
                  <textarea
                    id="blog-excerpt"
                    value={draft.excerpt}
                    placeholder="A clear reason to read this article."
                    maxLength={320}
                    rows={3}
                    aria-invalid={!!errors.excerpt}
                    onChange={(e) => update("excerpt", e.target.value)}
                  />
                  {errors.excerpt && (
                    <span className="field-error">{errors.excerpt}</span>
                  )}
                </div>
                <div className="editor-field">
                  <label htmlFor="blog-content">
                    Article{" "}
                    <small>{readingMinutes(draft.content)} min read</small>
                  </label>
                  <div
                    className="editor-toolbar"
                    role="toolbar"
                    aria-label="Article formatting"
                  >
                    <button type="button" onClick={() => insert("\n\n## ")}>
                      Heading
                    </button>
                    <button type="button" onClick={() => insert("**", "**")}>
                      <strong>Bold</strong>
                    </button>
                    <button type="button" onClick={() => insert("*", "*")}>
                      <em>Italic</em>
                    </button>
                    <button type="button" onClick={() => insert("\n- ")}>
                      List
                    </button>
                    <button
                      type="button"
                      onClick={() => insert("[", "](https://example.com)")}
                    >
                      Link
                    </button>
                    <button type="button" onClick={() => insert("\n> ")}>
                      Quote
                    </button>
                  </div>
                  <textarea
                    ref={bodyRef}
                    id="blog-content"
                    className="editor-body-input"
                    value={draft.content}
                    onChange={(e) => update("content", e.target.value)}
                    placeholder="Start writing… Use headings, paragraphs, lists and links to make your ideas easy to follow."
                    maxLength={80000}
                    aria-invalid={!!errors.content}
                  />
                  <p>
                    Markdown formatting is supported. Use Preview to see the
                    article as readers will.
                  </p>
                  {errors.content && (
                    <span className="field-error">{errors.content}</span>
                  )}
                </div>
                <details className="editor-settings">
                  <summary>Cover image & search appearance</summary>
                  <div className="editor-settings-fields">
                    {textField(
                      "coverImage",
                      "Cover image URL (optional)",
                      "https://… or /assets/…",
                      1000,
                    )}
                    {textField(
                      "coverAlt",
                      "Describe the cover image",
                      "What does the image show?",
                      220,
                    )}
                    {textField(
                      "metaTitle",
                      "Search title (optional)",
                      "Uses your article title when left empty",
                      70,
                    )}
                    {textField(
                      "metaDescription",
                      "Search description (optional)",
                      "Uses your short summary when left empty",
                      170,
                    )}
                    <div className="search-snippet">
                      <span>
                        {SITE_URL}/blog/{draft.slug || "your-article"}
                      </span>
                      <strong>
                        {draft.metaTitle || draft.title || "Your article title"}{" "}
                        | Zainab Abdullah
                      </strong>
                      <p>
                        {draft.metaDescription ||
                          draft.excerpt ||
                          "Your short summary appears in the search preview."}
                      </p>
                    </div>
                  </div>
                </details>
              </fieldset>
            </form>
          )}
          <div className="editor-bottom-actions">
            <div>
              {activePost?.status === "published" ? (
                <a
                  href={`/blog/${activePost.slug}`}
                  className="text-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View live article <ArrowUpRight size={16} />
                </a>
              ) : (
                <span>Drafts stay private until you publish.</span>
              )}
            </div>
            <div>
              <button
                type="button"
                className="editor-save-draft"
                onClick={() => save("draft")}
                disabled={busy || loading}
              >
                {busy ? (
                  <Loader2 className="spin" size={16} />
                ) : (
                  <Save size={16} />
                )}{" "}
                {activePost?.status === "published"
                  ? "Unpublish & save draft"
                  : "Save draft"}
              </button>
              <button
                type="button"
                className="button"
                onClick={() => save("published")}
                disabled={busy || loading}
              >
                {busy ? (
                  <Loader2 className="spin" size={16} />
                ) : (
                  <Send size={16} />
                )}{" "}
                {activePost?.status === "published"
                  ? "Update article"
                  : "Publish article"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
