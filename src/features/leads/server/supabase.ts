import type { LeadInput } from "../schema";
/** Server-only database adapter for Vercel. */
export async function saveSupabaseLead(data: LeadInput, sourceHash: string) {
  const url = process.env.SUPABASE_URL,
    key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Lead database not configured");
  const response = await fetch(
    new URL("/rest/v1/rpc/submit_website_lead", url),
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: key,
        authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        brief: { ...data, email: data.email.toLowerCase(), sourceHash },
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    },
  );
  if (!response.ok) throw new Error("Lead storage unavailable");
  const result = (await response.json()) as { id?: string; limited?: boolean };
  if (!result.id && !result.limited)
    throw new Error("Invalid storage response");
  return result;
}
