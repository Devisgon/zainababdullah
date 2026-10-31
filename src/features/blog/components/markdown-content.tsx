import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArticleWorkflow } from "./article-workflow";
import { BlogImage } from "./blog-image";
export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="article-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          h1: ({ children }) => <h2>{children}</h2>,
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <BlogImage
              src={typeof src === "string" ? src : undefined}
              alt={alt || ""}
            />
          ),
          pre: ({ children, node }) => {
            const code = node?.children[0];
            if (
              code?.type === "element" &&
              code.tagName === "code" &&
              Array.isArray(code.properties.className) &&
              code.properties.className.includes("language-growth-workflow")
            ) {
              const source = code.children
                .map((child) => (child.type === "text" ? child.value : ""))
                .join("");
              return <ArticleWorkflow source={source} />;
            }
            return <pre>{children}</pre>;
          },
          table: ({ children }) => (
            <div
              className="article-table"
              role="region"
              aria-label="Article comparison table"
              tabIndex={0}
            >
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
