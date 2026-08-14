"use client";

import { FormEvent, useState } from "react";

export function WaitlistForm({ note }: { note: string }) {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <div>
      <form className="field" onSubmit={onSubmit}>
        <input
          type="email"
          required
          placeholder="email address"
          aria-label="email address"
        />
        <button type="submit">{submitted ? "received" : "join"}</button>
      </form>
      <p className="note voice">{note}</p>
    </div>
  );
}
