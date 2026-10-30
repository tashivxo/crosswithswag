import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  refreshScrollTrigger,
  watchVeilLayout,
} from "@/lib/coming-soon-veil-refresh";

type Callback = () => void;

class FakeResizeObserver {
  static instances: FakeResizeObserver[] = [];
  observed: unknown[] = [];
  disconnected = false;
  constructor(private callback: Callback) {
    FakeResizeObserver.instances.push(this);
  }
  observe(target: unknown) {
    this.observed.push(target);
  }
  disconnect() {
    this.disconnected = true;
  }
  fire() {
    this.callback();
  }
}

const target = {} as Element;

function setup() {
  const refresh = vi.fn();
  const stop = watchVeilLayout(target, {
    refresh,
    debounceMs: 150,
    raf: (cb) => setTimeout(cb, 16) as unknown as number,
    cancelRaf: (id) => clearTimeout(id),
    ResizeObserverImpl:
      FakeResizeObserver as unknown as typeof ResizeObserver,
  });
  return { refresh, stop, observer: FakeResizeObserver.instances[0] };
}

beforeEach(() => {
  vi.useFakeTimers();
  FakeResizeObserver.instances = [];
  vi.stubEnv("NEXT_PUBLIC_COMING_SOON", "1");
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe("refreshScrollTrigger", () => {
  it("refreshes ScrollTrigger when registered and the flag is on", () => {
    const refresh = vi.fn();
    expect(refreshScrollTrigger(() => ({ refresh }))).toBe(true);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("is a no-op when ScrollTrigger is not registered", () => {
    expect(refreshScrollTrigger(() => undefined)).toBe(false);
    expect(refreshScrollTrigger(() => ({}))).toBe(false);
  });

  it("is a no-op with the real gsap global when nothing is registered", () => {
    expect(() => refreshScrollTrigger()).not.toThrow();
    expect(refreshScrollTrigger()).toBe(false);
  });

  it("is a no-op with the flag off", () => {
    vi.stubEnv("NEXT_PUBLIC_COMING_SOON", "0");
    const refresh = vi.fn();
    expect(refreshScrollTrigger(() => ({ refresh }))).toBe(false);
    expect(refresh).not.toHaveBeenCalled();
  });
});

describe("watchVeilLayout", () => {
  it("observes the veil element", () => {
    const { observer } = setup();
    expect(observer.observed).toEqual([target]);
  });

  it("refreshes once after the first layout, not before", () => {
    const { refresh, observer } = setup();
    expect(refresh).not.toHaveBeenCalled();
    observer.fire();
    expect(refresh).not.toHaveBeenCalled();
    vi.advanceTimersByTime(16);
    expect(refresh).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1000);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("debounces later resizes into a single refresh", () => {
    const { refresh, observer } = setup();
    observer.fire();
    vi.advanceTimersByTime(16);
    refresh.mockClear();

    observer.fire();
    vi.advanceTimersByTime(100);
    observer.fire();
    vi.advanceTimersByTime(100);
    observer.fire();
    expect(refresh).not.toHaveBeenCalled();
    vi.advanceTimersByTime(149);
    expect(refresh).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("cancels pending refreshes and disconnects on cleanup", () => {
    const { refresh, observer, stop } = setup();
    observer.fire();
    stop();
    vi.advanceTimersByTime(1000);
    expect(refresh).not.toHaveBeenCalled();
    expect(observer.disconnected).toBe(true);
  });

  it("cancels a pending debounced refresh on cleanup", () => {
    const { refresh, observer, stop } = setup();
    observer.fire();
    vi.advanceTimersByTime(16);
    refresh.mockClear();
    observer.fire();
    stop();
    vi.advanceTimersByTime(1000);
    expect(refresh).not.toHaveBeenCalled();
  });

  it("does nothing without ResizeObserver", () => {
    const stop = watchVeilLayout(target, {
      refresh: vi.fn(),
      ResizeObserverImpl: undefined,
    });
    expect(() => stop()).not.toThrow();
  });
});
