"use client";

import { FormEvent, useRef, useState } from "react";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cssMs(name: string, fallback: number) {
  const value = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(name),
  );
  return Number.isFinite(value) ? value : fallback;
}

function swapLabel(el: HTMLElement, next: string) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    el.textContent = next;
    return;
  }

  const dur = cssMs("--text-swap-dur", 200);
  el.classList.add("is-exit");
  window.setTimeout(() => {
    el.textContent = next;
    el.classList.remove("is-exit");
    el.classList.add("is-enter-start");
    void el.offsetHeight;
    el.classList.remove("is-enter-start");
  }, dur);
}

export function WaitlistForm({ note }: { note: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLFormElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const revertRef = useRef<number | null>(null);

  const clearError = () => {
    if (revertRef.current) {
      window.clearTimeout(revertRef.current);
      revertRef.current = null;
    }
    wrapRef.current?.classList.remove("is-error");
    fieldRef.current?.classList.remove("is-error", "is-shaking");
    setError(false);
  };

  const showError = () => {
    const wrap = wrapRef.current;
    const field = fieldRef.current;
    if (!wrap || !field) return;

    setError(true);
    wrap.classList.add("is-error");
    field.classList.add("is-error");
    field.classList.remove("is-shaking");
    void field.offsetWidth;
    field.classList.add("is-shaking");

    const shakeMs = cssMs("--shake-dur-a", 80) * 2 + cssMs("--shake-dur-b", 60) * 2;
    window.setTimeout(() => field.classList.remove("is-shaking"), shakeMs + 20);

    if (revertRef.current) window.clearTimeout(revertRef.current);
    revertRef.current = window.setTimeout(() => {
      revertRef.current = null;
      wrap.classList.remove("is-error");
      field.classList.remove("is-error");
      setError(false);
    }, shakeMs + cssMs("--revert-hold", 3000));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitted) return;

    const email = String(new FormData(event.currentTarget).get("email") ?? "")
      .trim()
      .toLowerCase();

    if (!EMAIL.test(email)) {
      showError();
      return;
    }

    clearError();
    setSubmitted(true);
    if (labelRef.current) swapLabel(labelRef.current, "received");
  };

  return (
    <div ref={wrapRef} className="t-input-wrap">
      <form
        ref={fieldRef}
        className="field t-input"
        onSubmit={onSubmit}
        noValidate
      >
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="email address"
          aria-label="email address"
          aria-invalid={error}
          aria-describedby={error ? "waitlist-error" : undefined}
          readOnly={submitted}
          onInput={clearError}
        />
        <button type="submit" disabled={submitted}>
          <span ref={labelRef} className="t-text-swap">
            join
          </span>
        </button>
      </form>
      <p id="waitlist-error" className="t-error-msg">
        enter a valid email.
      </p>
      <p className="note voice">{note}</p>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {submitted ? "received" : error ? "enter a valid email." : ""}
      </span>
    </div>
  );
}
