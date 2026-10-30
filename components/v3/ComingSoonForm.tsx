"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { comingSoon as copy } from "@/lib/copy";
import { sendWaitlist } from "@/lib/waitlist-client";
import {
  applyResult,
  beginSubmit,
  clearFieldError,
  initialFormState,
  type FormState,
} from "@/lib/waitlist-form-state";

export function ComingSoonForm() {
  const [state, setState] = useState<FormState>(initialFormState);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  const { phase, errors } = state;
  const submitting = phase === "submitting";

  useEffect(() => {
    if (phase === "success") headlineRef.current?.focus();
  }, [phase]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { state: next, value } = beginSubmit(state, { email, consent });
    setState(next);

    if (!value) {
      if (next.errors.email) emailRef.current?.focus();
      else if (next.errors.consent) consentRef.current?.focus();
      return;
    }

    const result = await sendWaitlist(value);
    setState((current) => applyResult(current, result));
  };

  if (phase === "success") {
    return (
      <div className="cs-success">
        <p className="cs-label">{copy.successLabel}</p>
        <h2 ref={headlineRef} tabIndex={-1} className="cs-success__headline">
          {copy.successHeadline}
        </h2>
        <p className="cs-success__body">{copy.successBody}</p>
        <hr className="cs-rule" />
        <p className="cs-note">{copy.successNote}</p>
      </div>
    );
  }

  const buttonLabel = submitting
    ? copy.submitting
    : phase === "failure"
      ? copy.retry
      : copy.submit;

  return (
    <form className="cs-form" onSubmit={onSubmit} noValidate>
      <div className="cs-field">
        <label className="cs-label cs-label--field" htmlFor="cs-email">
          {copy.emailLabel}
        </label>
        <input
          ref={emailRef}
          id="cs-email"
          className="cs-input"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder={copy.emailPlaceholder}
          value={email}
          disabled={submitting}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "cs-email-error" : undefined}
          onChange={(event) => {
            setEmail(event.target.value);
            setState((current) => clearFieldError(current, "email"));
          }}
        />
        {errors.email ? (
          <p id="cs-email-error" className="cs-error">
            <span className="cs-error__marker" aria-hidden="true" />
            <span>{copy.emailError}</span>
          </p>
        ) : null}
      </div>

      <div className="cs-consent">
        <div className="cs-consent__row">
          <input
            ref={consentRef}
            id="cs-consent"
            className="cs-checkbox"
            type="checkbox"
            name="consent"
            checked={consent}
            disabled={submitting}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={
              errors.consent ? "cs-consent-detail cs-consent-error" : "cs-consent-detail"
            }
            onChange={(event) => {
              setConsent(event.target.checked);
              setState((current) => clearFieldError(current, "consent"));
            }}
          />
          <div className="cs-consent__text">
            <label htmlFor="cs-consent" className="cs-consent__label">
              {copy.consentLabel}
            </label>
            <p id="cs-consent-detail" className="cs-consent__detail">
              {copy.consentDetail}
            </p>
          </div>
        </div>
        {errors.consent ? (
          <p id="cs-consent-error" className="cs-error">
            <span className="cs-error__marker" aria-hidden="true" />
            <span>{copy.consentError}</span>
          </p>
        ) : null}
      </div>

      <div className="cs-submit">
        {phase === "failure" ? (
          <div className="cs-failure" role="alert">
            <p className="cs-failure__headline">{copy.failureHeadline}</p>
            <p className="cs-failure__fallback">{copy.failureFallback}</p>
          </div>
        ) : null}
        <button type="submit" className="cs-button" disabled={submitting}>
          {buttonLabel}
        </button>
        {submitting ? (
          <div className="cs-progress" aria-hidden="true">
            <span className="cs-progress__bar" />
          </div>
        ) : null}
        <p className="cs-note">{copy.note}</p>
      </div>

      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {submitting ? "sending" : ""}
      </span>
    </form>
  );
}
