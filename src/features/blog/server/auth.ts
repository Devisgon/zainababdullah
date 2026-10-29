import { cookies } from "next/headers";
type Identity = { userId: string; email: string };
export function isBlogEditor(user: Identity | null) {
  return (
    !!user?.userId &&
    (process.env.BLOG_EDITOR_EMAILS || "")
      .split(",")
      .map((x) => x.trim().toLowerCase())
      .includes(user.email.toLowerCase())
  );
}
export async function verifyEditorToken(
  token?: string,
): Promise<Identity | null> {
  if (
    !token ||
    !process.env.SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  )
    return null;
  try {
    const result = await fetch(
      new URL("/auth/v1/user", process.env.SUPABASE_URL),
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!result.ok) return null;
    const user = await result.json();
    return typeof user.id === "string" && typeof user.email === "string"
      ? { userId: user.id, email: user.email }
      : null;
  } catch {
    return null;
  }
}
export async function getPageEditor() {
  const user = await verifyEditorToken(
    (await cookies()).get("blog-session")?.value,
  );
  return isBlogEditor(user) ? user : null;
}
export async function getRequestEditor(_request: Request) {
  const user = await getPageEditor();
  return { user, status: user ? 200 : 401 };
}
