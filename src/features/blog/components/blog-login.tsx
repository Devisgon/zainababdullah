"use client";
import { useState } from "react";
export function BlogLogin({ url, anonKey }: { url: string; anonKey: string }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (!url || !anonKey)
    return (
      <p>
        The editor needs Supabase sign-in configuration. Please contact the
        website owner.
      </p>
    );
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
          const form = new FormData(e.currentTarget);
          const response = await fetch(
            new URL("/auth/v1/token?grant_type=password", url),
            {
              method: "POST",
              headers: { apikey: anonKey, "Content-Type": "application/json" },
              body: JSON.stringify({
                email: form.get("email"),
                password: form.get("password"),
              }),
            },
          );
          if (!response.ok) throw new Error("Check your email and password.");
          const session = await response.json();
          const saved = await fetch("/api/blog/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessToken: session.access_token }),
          });
          if (!saved.ok)
            throw new Error("This account does not have publishing access.");
          window.location.reload();
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Sign-in failed. Try again.",
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      <p>Use the Supabase account authorised by the website owner.</p>
      <label>
        Email
        <input name="email" type="email" autoComplete="username" required />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      <button className="button" disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
      <p role="alert">{error}</p>
    </form>
  );
}
