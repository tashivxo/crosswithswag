import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-shell v4-not-found">
      <h1>404</h1>
      <p>This page is not part of the gallery.</p>
      <Link href="/" className="v4-btn">
        BACK HOME →
      </Link>
    </section>
  );
}
