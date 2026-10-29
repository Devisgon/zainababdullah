"use client";
import { FormEvent, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import {
  serviceOptions,
  goalOptions,
  budgetOptions,
  timelineOptions,
  leadSchema,
} from "@/features/leads/schema";
import { LINKEDIN_URL } from "@/lib/content/site";
type Draft = {
  services: string[];
  goal: string;
  budget: string;
  timeline: string;
  business: string;
  website: string;
  country: string;
  context: string;
  name: string;
  email: string;
  whatsapp: string;
  consent: boolean;
  companyFax: string;
};
const initial: Draft = {
  services: [],
  goal: "",
  budget: "",
  timeline: "",
  business: "",
  website: "",
  country: "",
  context: "",
  name: "",
  email: "",
  whatsapp: "",
  consent: false,
  companyFax: "",
};
const titles = [
  "What can I help you with?",
  "What would a win look like?",
  "Let’s talk timing & budget.",
  "Tell me about your business.",
  "Where can we continue the conversation?",
];
const hints = [
  "Choose one or more. Unsure? We’ll figure it out together.",
  "Pick the outcome that matters most right now.",
  "A starting point is enough. Everything is agreed before work begins.",
  "A little context helps make the next conversation more useful.",
  "One last step. Your details are only used for this enquiry.",
];
function createRequestId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(
    "",
  );
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
export function LeadForm() {
  const [step, setStep] = useState(0),
    [draft, setDraft] = useState<Draft>(initial),
    [errors, setErrors] = useState<Record<string, string>>({}),
    [sending, setSending] = useState(false),
    [success, setSuccess] = useState("");
  const requestId = useRef(""),
    panel = useRef<HTMLDivElement>(null),
    lock = useRef(false);
  function update(key: keyof Draft, value: string | boolean | string[]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "", submit: "" }));
  }
  function move(next: number) {
    setStep(next);
    setErrors({});
    setTimeout(() => panel.current?.focus(), 0);
  }
  function validate() {
    const e: Record<string, string> = {};
    if (step === 0 && !draft.services.length)
      e.services = "Choose at least one service to continue.";
    if (step === 1 && !draft.goal)
      e.goal = "Choose your main goal to continue.";
    if (step === 2) {
      if (!draft.budget) e.budget = "Choose a budget range or ‘Let's discuss’.";
      if (!draft.timeline) e.timeline = "Choose a timeline to continue.";
    }
    if (step === 3) {
      for (const key of [
        "business",
        "website",
        "country",
        "context",
      ] as const) {
        const parsed = leadSchema.shape[key].safeParse(draft[key]);
        if (!parsed.success) e[key] = parsed.error.issues[0].message;
      }
    }
    if (step === 4) {
      for (const key of ["name", "email", "whatsapp"] as const) {
        const parsed = leadSchema.shape[key].safeParse(draft[key]);
        if (!parsed.success) e[key] = parsed.error.issues[0].message;
      }
      if (!draft.consent)
        e.consent = "Please agree so Zainab can respond to your enquiry.";
    }
    setErrors(e);
    return !Object.keys(e).length;
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!validate() || lock.current) return;
    if (step < 4) {
      move(step + 1);
      return;
    }
    lock.current = true;
    setSending(true);
    try {
      if (!requestId.current) requestId.current = createRequestId();
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, requestId: requestId.current }),
      });
      const data = (await response.json()) as { id?: string; error?: string };
      if (!response.ok || !data.id)
        throw new Error(
          data.error || "Your brief wasn’t saved. Please try again.",
        );
      setSuccess(data.id);
      setTimeout(() => panel.current?.focus(), 0);
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : "Connection interrupted. Your answers are still here—please try again.",
      });
    } finally {
      lock.current = false;
      setSending(false);
    }
  }
  const baOnly =
    draft.services.length === 1 && draft.services[0] === "Business Analysis";
  const choice = (
    options: readonly string[],
    key: "goal" | "budget" | "timeline",
  ) => (
    <div
      className={`choice-grid ${key === "goal" ? "goal-grid" : ""}`}
      role="radiogroup"
      aria-label={
        key === "goal"
          ? "Your primary goal"
          : key === "budget"
            ? "Budget range"
            : "Project timeline"
      }
    >
      {options.map((option) => (
        <label
          key={option}
          className={`choice ${draft[key] === option ? "selected" : ""}`}
        >
          <input
            type="radio"
            name={key}
            value={option}
            checked={draft[key] === option}
            onChange={() => update(key, option)}
          />
          <span>{option}</span>
          <span className="choice-indicator">
            {draft[key] === option && <Check size={14} />}
          </span>
        </label>
      ))}
    </div>
  );
  const field = (
    key:
      | "business"
      | "website"
      | "country"
      | "context"
      | "name"
      | "email"
      | "whatsapp",
    label: string,
    placeholder: string,
    required = true,
  ) => (
    <div className={`field field-${key}`}>
      <label htmlFor={`lead-${key}`}>
        {label}
        {!required && <span> (optional)</span>}
      </label>
      {key === "context" ? (
        <textarea
          id={`lead-${key}`}
          required={required}
          aria-required={required}
          value={draft[key]}
          onChange={(e) => update(key, e.target.value)}
          placeholder={placeholder}
          rows={4}
          maxLength={2000}
          aria-invalid={!!errors[key]}
          aria-describedby={errors[key] ? `error-${key}` : undefined}
        />
      ) : (
        <input
          id={`lead-${key}`}
          required={required}
          aria-required={required}
          type={
            key === "email"
              ? "email"
              : key === "website"
                ? "url"
                : key === "whatsapp"
                  ? "tel"
                  : "text"
          }
          autoComplete={
            key === "name"
              ? "name"
              : key === "email"
                ? "email"
                : key === "business"
                  ? "organization"
                  : key === "website"
                    ? "url"
                    : key === "country"
                      ? "country-name"
                      : key === "whatsapp"
                        ? "tel"
                        : undefined
          }
          value={draft[key]}
          onChange={(e) => update(key, e.target.value)}
          placeholder={placeholder}
          maxLength={
            key === "website"
              ? 300
              : key === "email"
                ? 200
                : key === "whatsapp"
                  ? 40
                  : 120
          }
          aria-invalid={!!errors[key]}
          aria-describedby={errors[key] ? `error-${key}` : undefined}
        />
      )}{" "}
      {key === "whatsapp" && (
        <p className="field-help whatsapp-help">
          Required. Include your country code. Only used to discuss this
          enquiry.
        </p>
      )}{" "}
      {errors[key] && (
        <p id={`error-${key}`} className="field-error">
          {errors[key]}
        </p>
      )}
    </div>
  );
  return (
    <div className="lead-form-card" ref={panel} tabIndex={-1}>
      {success ? (
        <div className="form-success" role="status">
          <div className="success-icon">
            <CheckCircle2 size={38} />
          </div>
          <span className="eyebrow">BRIEF RECEIVED</span>
          <h3>
            A smarter next move
            <br />
            starts right here.
          </h3>
          <p>
            Thanks, {draft.name.split(" ")[0]}. Your project brief has been
            saved. Zainab can review your goals and continue the conversation at{" "}
            <strong>{draft.email}</strong>
            {draft.whatsapp && (
              <>
                {" "}
                or on WhatsApp at <strong>{draft.whatsapp}</strong>
              </>
            )}
            .
          </p>
          <p className="reference">
            Your reference: {success.slice(0, 8).toUpperCase()}
          </p>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="button"
          >
            Connect on LinkedIn <ArrowUpRight size={18} />
          </a>
          <button
            type="button"
            className="text-link"
            onClick={() => {
              setSuccess("");
              setDraft(initial);
              requestId.current = "";
              move(0);
            }}
          >
            Start another enquiry <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate>
          <div className="form-topline">
            <span>YOUR NEXT CHAPTER</span>
            <span>
              0{step + 1} <span className="muted">/ 05</span>
            </span>
          </div>
          <div className="form-progress" aria-label={`Step ${step + 1} of 5`}>
            {titles.map((_, i) => (
              <span key={i} className={i <= step ? "filled" : ""} />
            ))}
          </div>
          <h3>{titles[step]}</h3>
          <p className="form-hint">{hints[step]}</p>
          <div className="form-step" key={step}>
            {step === 0 && (
              <>
                <div className="choice-grid service-choice-grid">
                  {serviceOptions.map((option, i) => (
                    <label
                      key={option}
                      className={`choice ${draft.services.includes(option) ? "selected" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={draft.services.includes(option)}
                        onChange={() =>
                          update(
                            "services",
                            draft.services.includes(option)
                              ? draft.services.filter((s) => s !== option)
                              : option === "Help me choose"
                                ? [option]
                                : [
                                    ...draft.services.filter(
                                      (s) => s !== "Help me choose",
                                    ),
                                    option,
                                  ],
                          )
                        }
                      />
                      <span>
                        <span className="option-number" aria-hidden="true">
                          0{i + 1}
                        </span>
                        {option}
                      </span>
                      <span className="choice-indicator">
                        {draft.services.includes(option) && <Check size={14} />}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.services && (
                  <p className="field-error">{errors.services}</p>
                )}
              </>
            )}
            {step === 1 && (
              <>
                {choice(goalOptions, "goal")}
                {errors.goal && <p className="field-error">{errors.goal}</p>}
              </>
            )}
            {step === 2 && (
              <>
                <fieldset>
                  <legend>
                    {baOnly
                      ? "Estimated project budget (USD)"
                      : "Monthly ad spend / project budget (USD)"}
                  </legend>
                  <p className="field-help">
                    {baOnly
                      ? "A rough project range is fine."
                      : "For ads, share media spend; for content or mixed projects, share the project budget. Ad spend is separate from fees."}
                  </p>
                  {choice(budgetOptions, "budget")}
                  {errors.budget && (
                    <p className="field-error">{errors.budget}</p>
                  )}
                </fieldset>
                <fieldset>
                  <legend>When would you like to start?</legend>
                  {choice(timelineOptions, "timeline")}
                  {errors.timeline && (
                    <p className="field-error">{errors.timeline}</p>
                  )}
                </fieldset>
              </>
            )}
            {step === 3 && (
              <div className="field-grid">
                {field(
                  "business",
                  "Business / brand name",
                  "Your business name",
                )}
                {field(
                  "website",
                  "Website or social profile",
                  "https://yourbrand.com",
                  false,
                )}
                {field(
                  "country",
                  "Country / target market",
                  "e.g. United States",
                )}
                {field(
                  "context",
                  "What would you like to change?",
                  "Tell me about your business, your current challenge and what you want to achieve.",
                )}
              </div>
            )}
            {step === 4 && (
              <>
                <div className="brief-summary">
                  <span>YOUR BRIEF AT A GLANCE</span>
                  <p>{draft.services.join(" + ")}</p>
                  <small>
                    {draft.goal} · {draft.timeline}
                  </small>
                  <button type="button" onClick={() => move(0)}>
                    Edit answers
                  </button>
                </div>
                <div className="field-grid">
                  {field("name", "Your name", "First and last name")}
                  {field("email", "Work email", "you@yourbusiness.com")}
                  {field("whatsapp", "WhatsApp number", "e.g. +92 300 1234567")}
                </div>
                <div className="honeypot" aria-hidden="true">
                  <label htmlFor="company-fax">Leave this empty</label>
                  <input
                    id="company-fax"
                    name="companyFax"
                    value={draft.companyFax}
                    tabIndex={-1}
                    autoComplete="off"
                    onChange={(e) => update("companyFax", e.target.value)}
                  />
                </div>
                <label className="consent">
                  <input
                    type="checkbox"
                    checked={draft.consent}
                    onChange={(e) => update("consent", e.target.checked)}
                  />
                  <span>
                    I agree that Zainab can use these details to review my
                    enquiry and contact me by email or WhatsApp about this
                    project.{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy notice
                    </a>
                  </span>
                </label>
                {errors.consent && (
                  <p className="field-error">{errors.consent}</p>
                )}
              </>
            )}
          </div>
          <div role="alert" aria-live="polite">
            {Object.values(errors).some(Boolean) && (
              <p className="form-error">
                {errors.submit || "Please check the highlighted answers above."}
              </p>
            )}
          </div>
          <div className="form-actions">
            {step > 0 ? (
              <button
                type="button"
                className="back-button"
                onClick={() => move(step - 1)}
                disabled={sending}
              >
                <ArrowLeft size={17} />
                Back
              </button>
            ) : (
              <span className="form-no-pressure">
                <ShieldCheck size={15} /> No commitment. Just a conversation.
              </span>
            )}
            <button type="submit" className="button" disabled={sending}>
              {sending ? (
                <>
                  Saving your brief <Loader2 className="spin" size={17} />
                </>
              ) : (
                <>
                  {step === 4 ? "Send my project brief" : "Continue"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
          <noscript>
            This guided form needs JavaScript. You can also contact Zainab
            through the LinkedIn link below.
          </noscript>
        </form>
      )}
    </div>
  );
}
