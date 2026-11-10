import { describe, expect, it } from "vitest";
import {
  createAnnouncer,
  focusTargetAfterRemoval,
  quantityMessage,
  removalMessage,
} from "@/lib/v4/cart/announce";
import { addToLines } from "@/lib/v4/cart/cart-math";
import { productBySlug } from "@/lib/v4/products";

const black = productBySlug("product-express-dispatch-black")!;
const [line] = addToLines([], black, "M");

describe("removalMessage", () => {
  it("names the shirt, colourway and size and says how many remain", () => {
    const text = removalMessage(line, 2);
    expect(text).toContain(line.title);
    expect(text).toContain(line.colourway);
    expect(text).toContain("size M");
    expect(text).toContain("removed");
    expect(text).toContain("2 items in your cart");
  });

  it("uses the singular for one item and says empty at zero", () => {
    expect(removalMessage(line, 1)).toContain("1 item in your cart");
    expect(removalMessage(line, 0)).toContain("Your cart is empty.");
  });
});

describe("quantityMessage", () => {
  it("states the new quantity", () => {
    expect(quantityMessage(line, 3)).toContain("quantity 3");
  });
});

describe("createAnnouncer", () => {
  function harness() {
    const log: string[] = [];
    const queue: Array<() => void> = [];
    const announcer = createAnnouncer(
      (text) => log.push(text),
      (run) => {
        let cancelled = false;
        queue.push(() => {
          if (!cancelled) run();
        });
        return () => {
          cancelled = true;
        };
      },
    );
    const flush = () => queue.splice(0).forEach((run) => run());
    return { announcer, log, flush };
  }

  it("clears the region first so a repeated message is announced again", () => {
    const { announcer, log, flush } = harness();
    announcer.announce("removed");
    expect(log).toEqual([""]);
    flush();
    expect(log).toEqual(["", "removed"]);
    announcer.announce("removed");
    flush();
    expect(log).toEqual(["", "removed", "", "removed"]);
  });

  it("drops a superseded message that has not been written yet", () => {
    const { announcer, log, flush } = harness();
    announcer.announce("first");
    announcer.announce("second");
    flush();
    expect(log).toEqual(["", "", "second"]);
  });

  it("cancel stops a pending message", () => {
    const { announcer, log, flush } = harness();
    announcer.announce("first");
    announcer.cancel();
    flush();
    expect(log).toEqual([""]);
  });
});

describe("focusTargetAfterRemoval", () => {
  const ids = ["a", "b", "c"];

  it("moves to the line that takes the removed line's place", () => {
    expect(focusTargetAfterRemoval(ids, "b")).toEqual({ kind: "line", lineId: "c" });
  });

  it("moves to the previous line when the last one is removed", () => {
    expect(focusTargetAfterRemoval(ids, "c")).toEqual({ kind: "line", lineId: "b" });
  });

  it("moves to the empty state when nothing is left", () => {
    expect(focusTargetAfterRemoval(["a"], "a")).toEqual({ kind: "empty" });
  });

  it("does nothing for an unknown line", () => {
    expect(focusTargetAfterRemoval(ids, "z")).toBeNull();
  });
});
