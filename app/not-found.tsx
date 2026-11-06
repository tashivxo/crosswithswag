import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap page-head" style={{ minHeight: "100dvh" }}>
      <div className="hero-top">
        <span className="lbl lbl--sand">[ 404 ]</span>
      </div>
      <h1 className="display voice">not found.</h1>
      <p className="body-copy voice" style={{ marginTop: 24 }}>
        this page is not part of the gallery.
      </p>
      <div className="cta-row" style={{ marginTop: 32 }}>
        <Link href="/" className="btn btn--clay">
          back home →
        </Link>
      </div>
    </section>
  );
}
