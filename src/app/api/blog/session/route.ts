import { cookies } from "next/headers";
import { verifyEditorToken, isBlogEditor } from "@/features/blog/server/auth";
export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return new Response(null, { status: 403 });
  let token: unknown;
  try {
    const body = await request.text();
    if (body.length > 16000) return new Response(null, { status: 413 });
    token = JSON.parse(body).accessToken;
  } catch {
    return new Response(null, { status: 400 });
  }
  if (typeof token !== "string") return new Response(null, { status: 400 });
  const user = await verifyEditorToken(token);
  if (!isBlogEditor(user))
    return Response.json(
      { error: "This account does not have publishing access." },
      { status: 403 },
    );
  (await cookies()).set("blog-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 3600,
  });
  return Response.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export async function DELETE(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return new Response(null, { status: 403 });
  (await cookies()).delete("blog-session");
  return Response.json({ ok: true });
}
