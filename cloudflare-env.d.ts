declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BLOG_EDITOR_EMAILS?: string;
    BUCKET?: R2Bucket;
  }
}
