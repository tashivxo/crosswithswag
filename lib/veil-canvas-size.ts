/**
 * Canvas buffer policy for DarkVeil.
 *
 * Assigning canvas.width / canvas.height clears the drawing buffer. On iOS
 * Safari a touch scroll that collapses the URL bar changes only height, and
 * the compositor will not present a new WebGL frame until the gesture ends,
 * so a realloc paints as solid black for the whole swipe.
 *
 * Coarse pointers therefore skip a height-only realloc and keep the largest
 * height seen. Width changes (rotation) still realloc. Fine pointers (desktop)
 * still track both axes.
 */

export type VeilCanvasSizeInput = {
  coarsePointer: boolean;
  prevWidth: number;
  prevHeight: number;
  nextWidth: number;
  nextHeight: number;
};

export type VeilCanvasSize = {
  width: number;
  height: number;
  /** True when canvas.width / canvas.height must be assigned (clears the buffer). */
  resizeBuffer: boolean;
};

export function nextVeilCanvasSize({
  coarsePointer,
  prevWidth,
  prevHeight,
  nextWidth,
  nextHeight,
}: VeilCanvasSizeInput): VeilCanvasSize {
  const width = Math.max(1, nextWidth);
  const height = Math.max(1, nextHeight);
  const first = prevWidth <= 0 || prevHeight <= 0;

  if (first || !coarsePointer) {
    return {
      width,
      height,
      resizeBuffer: first || prevWidth !== width || prevHeight !== height,
    };
  }

  if (prevWidth !== width) {
    return { width, height, resizeBuffer: true };
  }

  return {
    width: prevWidth,
    height: Math.max(prevHeight, height),
    resizeBuffer: false,
  };
}

/**
 * Veil redraws skip the touch-scroll settle gate. A real canvas resize must
 * paint on the next animation frame, not after SCROLL_SETTLE_MS.
 */
export function scheduleVeilRedraw(
  draw: () => void,
  raf: (callback: FrameRequestCallback) => number = defaultRaf,
): number {
  return raf(() => {
    draw();
  });
}

function defaultRaf(callback: FrameRequestCallback): number {
  if (typeof requestAnimationFrame === "function") {
    return requestAnimationFrame(callback);
  }
  callback(0);
  return 0;
}
