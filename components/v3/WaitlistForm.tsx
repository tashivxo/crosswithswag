"use client";

import { FormEvent, useRef, useState } from "react";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ERROR_COPY = "enter a valid email, including @.";

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
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const clearError = () => {
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
  };

  const reset = () => {
    setSubmitted(false);
    setPending(false);
    clearError();
    if (inputRef.current) {
      inputRef.current.readOnly = false;
      inputRef.current.focus();
    }
    if (labelRef.current) swapLabel(labelRef.current, "join");
  };

  const onInput = () => {
    const value = inputRef.current?.value.trim().toLowerCase() ?? "";
    if (error && EMAIL.test(value)) clearError();
  };

  const onBlur = () => {
    const value = inputRef.current?.value.trim().toLowerCase() ?? "";
    if (!value || submitted || pending) return;
    if (!EMAIL.test(value)) showError();
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitted || pending) return;

    const email = String(new FormData(event.currentTarget).get("email") ?? "")
      .trim()
      .toLowerCase();

    if (!EMAIL.test(email)) {
      showError();
      return;
    }

    clearError();
    setPending(true);
    if (labelRef.current) swapLabel(labelRef.current, "joining");

    window.setTimeout(() => {
      setPending(false);
      setSubmitted(true);
      if (labelRef.current) swapLabel(labelRef.current, "received");
    }, cssMs("--text-swap-dur", 200) + 80);
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
          ref={inputRef}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          required
          placeholder="email address"
          aria-label="email address"
          aria-invalid={error}
          aria-describedby={error ? "waitlist-error" : undefined}
          readOnly={submitted || pending}
          onInput={onInput}
          onBlur={onBlur}
        />
        <button type="submit" disabled={submitted || pending}>
          <span ref={labelRef} className="t-text-swap">
            join
          </span>
        </button>
      </form>
      {submitted ? (
        <button type="button" className="waitlist-clear" onClick={reset}>
          use a different email
        </button>
      ) : null}
      <p id="waitlist-error" className="t-error-msg">
        {ERROR_COPY}
      </p>
      <p className="note voice">{note}</p>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {submitted
          ? "received. use a different email to try again."
          : pending
            ? "joining"
            : error
              ? ERROR_COPY
              : ""}
      </span>
    </div>
  );
}
