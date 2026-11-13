import { WHATSAPP_CATALOGUE_URL, copy } from "@/lib/fallback";

export function WhatsAppButton() {
  return (
    <a
      className="fb-button"
      href={WHATSAPP_CATALOGUE_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      {copy.cta}
      <span className="fb-sr"> (opens in a new tab)</span>
    </a>
  );
}
