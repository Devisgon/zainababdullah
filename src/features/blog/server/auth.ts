import { getRuntimeEnv } from "@/lib/server/runtime";
import { getChatGPTUser } from "@/lib/platform/chatgpt-auth";
type Identity = { userId: string; email: string };
export function isBlogEditor(user: Identity | null) {
  if (!user?.userId || !user.email) return false;
  const editors = (getRuntimeEnv().BLOG_EDITOR_EMAILS || "")
    .split(",")
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
  return editors.includes(user.email.toLowerCase());
}
export async function getPageEditor() {
  const user = await getChatGPTUser();
  return user && isBlogEditor(user) ? user : null;
}
// Sites dispatch authenticates visitors and supplies these trusted, Site-scoped identity headers.
export function getRequestEditor(request: Request): {
  user: Identity | null;
  status: number;
} {
  const userId = request.headers.get("oai-authenticated-user-id"),
    email = request.headers.get("oai-authenticated-user-email");
  if (!userId || !email) return { user: null, status: 401 };
  const user = { userId, email };
  return isBlogEditor(user)
    ? { user, status: 200 }
    : { user: null, status: 403 };
}
