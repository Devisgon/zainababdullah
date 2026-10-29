import form from "@/content/lead-form.json";
import { z } from "zod";
export const serviceOptions = form.serviceOptions as [string, ...string[]];
export const goalOptions = form.goalOptions as [string, ...string[]];
export const budgetOptions = form.budgetOptions as [string, ...string[]];
export const timelineOptions = form.timelineOptions as [string, ...string[]];
export function normalizeWhatsApp(value: string) {
  const cleaned = value.trim().replace(/[\s().-]/g, "");
  return cleaned.startsWith("00") ? "+" + cleaned.slice(2) : cleaned;
}
const whatsappSchema = z
  .string({ required_error: "Please enter your WhatsApp number." })
  .trim()
  .min(1, "Please enter your WhatsApp number.")
  .max(40, "Please use a number with a country code.")
  .refine(
    (value) => /^\+[1-9]\d{7,14}$/.test(normalizeWhatsApp(value)),
    "Include the country code, for example +92 300 1234567.",
  )
  .transform(normalizeWhatsApp);
export const leadSchema = z
  .object({
    requestId: z.string().uuid(),
    services: z
      .array(z.enum(serviceOptions))
      .min(1)
      .max(6)
      .refine((a) => new Set(a).size === a.length),
    goal: z.enum(goalOptions),
    budget: z.enum(budgetOptions),
    timeline: z.enum(timelineOptions),
    business: z
      .string()
      .trim()
      .min(2, "Please enter your business name.")
      .max(120),
    website: z
      .string()
      .trim()
      .max(300)
      .refine(
        (v) => !v || /^https?:\/\/[^\s]+$/i.test(v),
        "Use a full URL, such as https://yourbrand.com.",
      ),
    country: z
      .string()
      .trim()
      .min(2, "Please enter your country or target market.")
      .max(100),
    context: z
      .string()
      .trim()
      .min(15, "Add a little more detail (at least 15 characters).")
      .max(2000),
    name: z.string().trim().min(2, "Please enter your name.").max(100),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address.")
      .max(200),
    whatsapp: whatsappSchema,
    consent: z.literal(true),
    companyFax: z.string().max(200).optional().default(""),
  })
  .strict();
export type LeadInput = z.infer<typeof leadSchema>;
