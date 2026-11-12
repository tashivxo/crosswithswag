/** SSR placeholder so `/current` keeps the main gallery frame before ProductChapter hydrates. */
export function PdpGalleryReserve() {
  return (
    <section className="chapter pdp" aria-hidden="true">
      <div className="wrap pdp-top" />
      <section className="wrap pad-sm pdp-main">
        <div className="pdp-gallery">
          <div className="frame pdp-gallery__main" data-pdp-reserve="" />
        </div>
      </section>
    </section>
  );
}
