import { useState, type FormEvent } from "react";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { unlockInbox } from "@/lib/bookings";
import { saveInboxToken } from "@/lib/inbox-session";
import { profile } from "@/lib/site-data";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  if (done) return <Navigate to="/admin" />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const { token } = await unlockInbox({ data: { code } });
      saveInboxToken(token);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Incorrect code.");
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-6">
      <form
        onSubmit={submit}
        className="glass w-full max-w-sm rounded-2xl p-8 text-center"
      >
        <p className="label-text">Admin inbox</p>
        <h1 className="mt-3 heading-serif text-4xl font-light">{profile.name}</h1>
        <p className="mt-3 font-sans text-sm font-light text-muted">
          Enter the access code to view booking enquiries.
        </p>
        <label className="mt-8 block text-left">
          <span className="field-label">Access code</span>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputMode="numeric"
            autoComplete="off"
            type="password"
            className="field-input text-center tracking-[0.4em]"
            data-testid="admin-code"
            required
          />
        </label>
        {error && <p className="mt-4 text-sm text-danger">{error}</p>}
        <button
          type="submit"
          disabled={pending || code.trim().length === 0}
          className="btn-gold mt-6 w-full"
          data-testid="admin-unlock"
        >
          {pending ? "Checking…" : "Open inbox"}
        </button>
        <Link to="/" className="mt-8 inline-block label-text text-muted hover:text-gold">
          Back to site
        </Link>
      </form>
    </main>
  );
}
