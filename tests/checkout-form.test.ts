import { describe, expect, it } from "vitest";
import { checkoutCopy } from "@/lib/copy";
import {
  CHECKOUT_FIELD_ORDER,
  describedByIds,
  errorId,
  fieldId,
  firstInvalidField,
  focusFirstInvalid,
  validateCheckout,
  type CheckoutValues,
} from "@/lib/v4/checkout";

const valid: CheckoutValues = {
  name: "Ayanda Dlamini",
  email: "ayanda@example.com",
  phone: "082 123 4567",
  address: "12 Kloof Street, Gardens, Cape Town",
};

describe("validateCheckout", () => {
  it("passes a complete guest form", () => {
    expect(validateCheckout(valid)).toEqual({});
  });

  it("flags every empty field with its message", () => {
    const errors = validateCheckout({ name: "", email: "", phone: "", address: "" });
    expect(errors).toEqual({
      name: checkoutCopy.errors.name,
      email: checkoutCopy.errors.email,
      phone: checkoutCopy.errors.phone,
      address: checkoutCopy.errors.address,
    });
  });

  it("treats whitespace-only values as empty", () => {
    expect(validateCheckout({ ...valid, name: "   " }).name).toBeDefined();
  });

  it("rejects malformed emails", () => {
    for (const email of ["ayanda", "a@b", "a b@c.com", "@c.com"]) {
      expect(validateCheckout({ ...valid, email }).email).toBeDefined();
    }
    expect(validateCheckout({ ...valid, email: " a@b.co " }).email).toBeUndefined();
  });

  it("accepts phone formats with spaces, dashes, brackets and +27", () => {
    for (const phone of ["0821234567", "082-123-4567", "+27 82 123 4567", "(021) 555 0100"]) {
      expect(validateCheckout({ ...valid, phone }).phone).toBeUndefined();
    }
  });

  it("rejects short or lettered phone numbers", () => {
    for (const phone of ["082", "call me", "082 123 45ab"]) {
      expect(validateCheckout({ ...valid, phone }).phone).toBeDefined();
    }
  });
});

describe("firstInvalidField", () => {
  it("follows the visual order of the form", () => {
    expect(CHECKOUT_FIELD_ORDER).toEqual(["name", "email", "phone", "address"]);
    expect(firstInvalidField({ address: "x", email: "y" })).toBe("email");
    expect(firstInvalidField({ phone: "x", name: "y" })).toBe("name");
  });

  it("is null when there are no errors", () => {
    expect(firstInvalidField({})).toBeNull();
  });
});

describe("focusFirstInvalid", () => {
  function fakeDom() {
    const focused: string[] = [];
    const getElement = (id: string) => ({ focus: () => focused.push(id) });
    return { focused, getElement };
  }

  it("focuses the first invalid field only", () => {
    const { focused, getElement } = fakeDom();
    const result = focusFirstInvalid({ phone: "x", address: "y" }, getElement);
    expect(result).toBe("phone");
    expect(focused).toEqual([fieldId("phone")]);
  });

  it("focuses nothing when the form is valid", () => {
    const { focused, getElement } = fakeDom();
    expect(focusFirstInvalid({}, getElement)).toBeNull();
    expect(focused).toEqual([]);
  });

  it("copes with a field that is not in the document", () => {
    expect(focusFirstInvalid({ name: "x" }, () => null)).toBe("name");
  });
});

describe("aria-describedby", () => {
  it("links a field to its error only while it has one", () => {
    expect(describedByIds("email", { email: "bad" })).toBe(errorId("email"));
    expect(describedByIds("email", {})).toBeUndefined();
  });

  it("can keep a hint ahead of the error", () => {
    expect(describedByIds("phone", { phone: "bad" }, "hint-id")).toBe(
      `hint-id ${errorId("phone")}`,
    );
    expect(describedByIds("phone", {}, "hint-id")).toBe("hint-id");
  });

  it("uses distinct ids per field", () => {
    const ids = CHECKOUT_FIELD_ORDER.flatMap((f) => [fieldId(f), errorId(f)]);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("checkout copy", () => {
  it("uses a single ellipsis character for the pending label", () => {
    expect(checkoutCopy.processing).toBe("processing\u2026");
    expect(checkoutCopy.processing).not.toContain("...");
  });
});
