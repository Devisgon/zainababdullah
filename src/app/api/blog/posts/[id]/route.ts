import { getRequestEditor } from "@/features/blog/server/auth";
import { getEditorPost } from "@/features/blog/server/repository";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = getRequestEditor(request);
  if (!auth.user)
    return Response.json(
      {
        error:
          auth.status === 401
            ? "Sign in to open this article."
            : "Publishing access is required.",
      },
      { status: auth.status, headers: { "Cache-Control": "no-store" } },
    );
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id))
    return Response.json(
      { error: "Article not found." },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  try {
    const post = await getEditorPost(id);
    return Response.json(post ? { post } : { error: "Article not found." }, {
      status: post ? 200 : 404,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json(
      { error: "This article could not be loaded." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
