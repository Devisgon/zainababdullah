import { saveSupabaseLead } from "./supabase";
import { leadSchema } from "@/features/leads/schema";
const reply = (data: unknown, status = 200) =>
  Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
export async function submitLead(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin)
    return reply({ error: "Please send your enquiry from this website." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return reply({ error: "Please submit the project form." }, 415);
  if (Number(request.headers.get("content-length") || 0) > 14000)
    return reply(
      { error: "Your brief is too long. Please shorten it and try again." },
      413,
    );
  let raw: unknown;
  try {
    const body = await request.text();
    if (body.length > 14000)
      return reply({ error: "Your brief is too long." }, 413);
    raw = JSON.parse(body);
  } catch {
    return reply(
      { error: "We couldn’t read your brief. Please try again." },
      400,
    );
  }
  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success)
    return reply(
      {
        error:
          "Please check your answers and contact details before submitting.",
      },
      400,
    );
  const data = parsed.data;
  if (data.companyFax) return reply({ id: data.requestId });
  if (!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY))
    return reply(
      {
        error:
          "Enquiries are temporarily unavailable. Your answers are still here. Please try again or connect on LinkedIn.",
      },
      503,
    );
  try {
    const ip =
        (process.env.VERCEL
          ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
          : request.headers.get("cf-connecting-ip")) || "unknown",
      today = new Date().toISOString().slice(0, 10);
    const bytes = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(`${today}:${ip}`),
    );
    const sourceHash = Array.from(new Uint8Array(bytes))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const result = await saveSupabaseLead(data, sourceHash);
    if (result.limited)
      return reply(
        {
          error:
            "Several briefs have been sent recently. Please try again in an hour or connect on LinkedIn.",
        },
        429,
      );
    return reply({ id: result.id }, 201);
  } catch {
    return reply(
      {
        error:
          "Your brief could not be saved just yet. Your answers are still here—please try again.",
      },
      503,
    );
  }
}
