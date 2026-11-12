"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { flushSync } from "react-dom";
import {
  CartEmptyState,
  CartLineList,
  CartTotalsBlock,
} from "@/components/v4/cart/CartUi";
import { PaxiLocator } from "@/components/v4/checkout/PaxiLocator";
import { cartCopy, checkoutCopy, orderConfirmedCopy } from "@/lib/copy";
import { orderTotalCents } from "@/lib/v4/cart/cart-math";
import { useCart } from "@/lib/v4/cart/CartProvider";
import {
  CHECKOUT_FIELD_ORDER,
  EMPTY_CHECKOUT_VALUES,
  describedByIds,
  errorId,
  fieldId,
  focusFirstInvalid,
  validateCheckout,
  type CheckoutErrors,
  type CheckoutField,
  type CheckoutValues,
} from "@/lib/v4/checkout";
import {
  apiBaseUrl,
  CheckoutApiError,
  fetchOrderConfirmation,
  postCheckout,
} from "@/lib/v4/checkout-api";
import {
  CHECKOUT_SESSION_KEY,
  STUB_ORDER_STORAGE_KEY,
  createPaymentStub,
  parseCheckoutSession,
  parseStubOrder,
  serialiseCheckoutSession,
  serialiseStubOrder,
} from "@/lib/v4/order";
import { submitPayfastForm } from "@/lib/v4/payfast";
import { formatPrice } from "@/lib/v4/products";
import { shippingCents, type ShopShipMethod } from "@/lib/v4/shipping";

function CommerceHead({
  id,
  label,
  meta,
  title,
  titleRef,
}: {
  id: string;
  label: string;
  meta: string;
  title: string;
  titleRef?: React.Ref<HTMLHeadingElement>;
}) {
  return (
    <div id={id} className="wrap cm-head" tabIndex={-1}>
      <div className="cm-head__row">
        <span className="lbl cm-kicker">{label}</span>
        <span className="lbl">{meta}</span>
      </div>
      <h1 ref={titleRef} tabIndex={-1} className="cm-title voice">
        {title}
      </h1>
    </div>
  );
}

export function CartChapter() {
  const router = useRouter();
  const { lines, count, subtotalCents, removeLine, setQuantity } = useCart();

  const keepShopping = () => {
    if (window.history.length > 1) router.back();
    else router.push("/#shop");
  };

  return (
    <section id="cart" className="chapter cm">
      <CommerceHead
        id="cart-head"
        label={cartCopy.label}
        meta={cartCopy.count(count)}
        title={cartCopy.title}
      />

      <div className="wrap cm-main">
        {lines.length === 0 ? (
          <CartEmptyState variant="page" />
        ) : (
          <div className="cart-page">
            <CartLineList
              lines={lines}
              variant="page"
              onRemove={removeLine}
              onSetQuantity={setQuantity}
            />
            <aside className="cart-page__totals">
              <CartTotalsBlock subtotalCents={subtotalCents} />
              <button
                type="button"
                className="cart-link"
                onClick={keepShopping}
              >
                {cartCopy.keepShopping}
              </button>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

function Field({
  field,
  type,
  value,
  error,
  errors,
  inputMode,
  required = true,
  onChange,
}: {
  field: CheckoutField;
  type: "text" | "email" | "tel";
  value: string;
  error?: string;
  errors: CheckoutErrors;
  inputMode?: "email" | "tel" | "text";
  required?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const copy = checkoutCopy.fields[field];
  return (
    <div className="cm-field">
      <label className="cm-field__label" htmlFor={fieldId(field)}>
        {copy.label}
      </label>
      <input
        id={fieldId(field)}
        name={field}
        type={type}
        inputMode={inputMode}
        autoComplete={copy.autoComplete}
        className="cm-input"
        value={value}
        required={required}
        aria-required={required ? "true" : undefined}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedByIds(field, errors)}
        onChange={onChange}
      />
      {error ? (
        <p id={errorId(field)} className="cm-field__error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function CheckoutChapter() {
  const router = useRouter();
  const { lines, count, subtotalCents, clear } = useCart();
  const [values, setValues] = useState<CheckoutValues>(EMPTY_CHECKOUT_VALUES);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [shipMethod, setShipMethod] = useState<ShopShipMethod>("PAXI_COLLECT");
  const [paxiName, setPaxiName] = useState("");
  const [paxiAddress, setPaxiAddress] = useState("");
  const [pending, setPending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const radioGroup = useId();
  const inFlight = useRef(false);
  const liveApi = Boolean(apiBaseUrl());

  const [payment] = useState(() =>
    createPaymentStub({
      schedule: (run, ms) => {
        const id = window.setTimeout(run, ms);
        return () => window.clearTimeout(id);
      },
      save: (order) => {
        try {
          window.sessionStorage.setItem(
            STUB_ORDER_STORAGE_KEY,
            serialiseStubOrder(order),
          );
        } catch {
          // Storage can be blocked; the confirmed page then simply has no reference to show.
        }
      },
      onConfirmed: () => {
        clear();
        router.push("/order/confirmed");
      },
    }),
  );

  useEffect(() => () => payment.cancel(), [payment]);

  const deliveryCents = shippingCents(shipMethod);
  const total = orderTotalCents(subtotalCents, deliveryCents);

  const onPaxiPoint = useCallback(
    (point: { code: string; name: string; address: string }) => {
      setValues((current) => ({ ...current, paxiCode: point.code }));
      setPaxiName(point.name);
      setPaxiAddress(point.address);
      setErrors((current) => {
        if (!current.paxiCode) return current;
        const rest = { ...current };
        delete rest.paxiCode;
        return rest;
      });
    },
    [],
  );

  const onFieldChange =
    (field: CheckoutField) => (event: ChangeEvent<HTMLInputElement>) => {
      const next = { ...values, [field]: event.target.value };
      setValues(next);
      if (errors[field]) {
        const rest = { ...errors };
        if (!validateCheckout(next, shipMethod)[field]) delete rest[field];
        setErrors(rest);
      }
    };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current || payment.isInFlight()) return;
    const found = validateCheckout(values, shipMethod);
    // Render the errors (and their aria-describedby links) before focus moves, so the
    // first invalid field is announced together with its message.
    flushSync(() => setErrors(found));
    if (focusFirstInvalid(found, (id) => document.getElementById(id))) return;

    if (!liveApi) {
      if (payment.submit({ itemCount: count, totalCents: total })) setPending(true);
      return;
    }

    inFlight.current = true;
    setPending(true);
    setSubmitError(null);
    try {
      const result = await postCheckout({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        shipMethod,
        paxiCode: shipMethod === "PAXI_COLLECT" ? values.paxiCode.trim() : undefined,
        paxiName: shipMethod === "PAXI_COLLECT" ? paxiName || undefined : undefined,
        paxiAddress:
          shipMethod === "PAXI_COLLECT" ? paxiAddress || undefined : undefined,
        addressText:
          shipMethod === "PRIVATE_SHIP" ? values.address.trim() : undefined,
        lines: lines.map((line) => ({
          sku: line.productId,
          size: line.size,
          qty: line.quantity,
        })),
      });
      try {
        window.sessionStorage.setItem(
          CHECKOUT_SESSION_KEY,
          serialiseCheckoutSession({
            ref: result.ref,
            email: values.email.trim(),
          }),
        );
      } catch {
        // Confirmation can still read ?ref= from PayFast return_url.
      }
      clear();
      submitPayfastForm(result.redirectUrl, result.vendorFields);
    } catch (err) {
      inFlight.current = false;
      setPending(false);
      setSubmitError(
        err instanceof CheckoutApiError ? err.message : checkoutCopy.submitError,
      );
    }
  };

  const showForm = lines.length > 0 || pending;

  return (
    <section id="checkout" className="chapter cm">
      <CommerceHead
        id="checkout-head"
        label={checkoutCopy.label}
        meta={checkoutCopy.sub}
        title={checkoutCopy.title}
      />

      <div className="wrap cm-main">
        {!showForm ? (
          <CartEmptyState variant="page" />
        ) : (
          <form className="cm-checkout" noValidate onSubmit={onSubmit}>
            <div className="cm-checkout__form">
              <section className="cm-block">
                <h2 className="lbl cm-block__label">
                  {checkoutCopy.contact}
                </h2>
                {CHECKOUT_FIELD_ORDER.filter(
                  (f) => f !== "address" && f !== "paxiCode",
                ).map(
                  (field) => (
                    <Field
                      key={field}
                      field={field}
                      type={
                        field === "email" ? "email" : field === "phone" ? "tel" : "text"
                      }
                      inputMode={
                        field === "email" ? "email" : field === "phone" ? "tel" : "text"
                      }
                      value={values[field]}
                      error={errors[field]}
                      errors={errors}
                      onChange={onFieldChange(field)}
                    />
                  ),
                )}
              </section>

              <section className="cm-block">
                <h2 className="lbl cm-block__label">
                  {checkoutCopy.delivery}
                </h2>
                <div
                  className="cm-options"
                  role="radiogroup"
                  aria-label={checkoutCopy.deliveryLegend}
                >
                  {checkoutCopy.shipMethods.map((opt) => (
                    <label
                      key={opt.id}
                      className="cm-option"
                      data-checked={opt.id === shipMethod || undefined}
                    >
                      <input
                        type="radio"
                        name={`${radioGroup}-delivery`}
                        value={opt.id}
                        checked={opt.id === shipMethod}
                        onChange={() => setShipMethod(opt.id)}
                      />
                      <span>
                        {opt.label} · {formatPrice(shippingCents(opt.id))}
                      </span>
                    </label>
                  ))}
                </div>
                {shipMethod === "PAXI_COLLECT" ? (
                  <>
                    <PaxiLocator onPoint={onPaxiPoint} />
                    <Field
                      field="paxiCode"
                      type="text"
                      value={values.paxiCode}
                      error={errors.paxiCode}
                      errors={errors}
                      onChange={onFieldChange("paxiCode")}
                    />
                  </>
                ) : (
                  <Field
                    field="address"
                    type="text"
                    value={values.address}
                    error={errors.address}
                    errors={errors}
                    onChange={onFieldChange("address")}
                  />
                )}
              </section>

              <section className="cm-block">
                <h2 className="lbl cm-block__label">
                  {checkoutCopy.payment}
                </h2>
                <p className="lbl cm-note">{checkoutCopy.paymentNote}</p>
              </section>
            </div>

            <aside className="cm-checkout__summary" aria-label={checkoutCopy.summaryLabel}>
              <div className="cm-summary-head">
                <span className="lbl cm-block__label">{checkoutCopy.summaryLabel}</span>
                <span className="lbl">{checkoutCopy.items(count)}</span>
              </div>
              <ul className="cm-summary-lines">
                {lines.map((line) => (
                  <li key={line.lineId}>
                    <span>
                      <span className="cm-summary-lines__title">
                        {line.title.toLowerCase()}
                      </span>
                      <span className="cm-summary-lines__detail">
                        {cartCopy.lineDetail(line.colourway, line.size)} ×{" "}
                        {line.quantity}
                      </span>
                    </span>
                    <span>{formatPrice(line.unitPriceCents * line.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="cart-totals__row">
                <span className="lbl lbl--sand">{cartCopy.subtotal}</span>
                <span className="cm-summary-value">{formatPrice(subtotalCents)}</span>
              </div>
              <div className="cart-totals__row">
                <span className="lbl">{checkoutCopy.deliveryRow}</span>
                <span className="cm-summary-value">
                  {formatPrice(deliveryCents)}
                </span>
              </div>
              <div className="cart-totals__row cm-total">
                <span className="lbl lbl--sand">{checkoutCopy.totalRow}</span>
                <span className="cart-totals__value">{formatPrice(total)}</span>
              </div>

              <button
                type="submit"
                className="btn btn--clay cm-cta cm-cta--stacked"
                aria-disabled={pending || undefined}
                aria-busy={pending || undefined}
              >
                <span className="cm-cta__stack" data-active={!pending || undefined}>
                  {checkoutCopy.pay}
                </span>
                <span className="cm-cta__stack" data-active={pending || undefined}>
                  {checkoutCopy.processing}
                </span>
              </button>
              {submitError ? (
                <p className="cm-field__error" role="alert">
                  {submitError}
                </p>
              ) : null}
              <p className="lbl cm-note">
                {liveApi ? checkoutCopy.payNote : checkoutCopy.stubNote}
              </p>
              <div className="sr-only" role="status" aria-live="polite">
                {pending ? checkoutCopy.processing : ""}
              </div>
            </aside>
          </form>
        )}
      </div>
    </section>
  );
}

function subscribeNever() {
  return () => {};
}

function readStubOrderText() {
  try {
    return window.sessionStorage.getItem(STUB_ORDER_STORAGE_KEY);
  } catch {
    return null;
  }
}

function readCheckoutSessionText() {
  try {
    return window.sessionStorage.getItem(CHECKOUT_SESSION_KEY);
  } catch {
    return null;
  }
}

function readRefFromLocation() {
  try {
    const ref = new URLSearchParams(window.location.search).get("ref");
    return ref && /^SWAG-[0-9A-Z]{6}$/.test(ref) ? ref : null;
  } catch {
    return null;
  }
}

export function OrderConfirmedChapter() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stored = useSyncExternalStore(
    subscribeNever,
    readStubOrderText,
    () => null,
  );
  const sessionText = useSyncExternalStore(
    subscribeNever,
    readCheckoutSessionText,
    () => null,
  );
  const queryRef = useSyncExternalStore(
    subscribeNever,
    readRefFromLocation,
    () => null,
  );
  const stub = parseStubOrder(stored);
  const session = parseCheckoutSession(sessionText);
  const ref = queryRef ?? session?.ref ?? stub?.ref ?? null;
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!ref || !session?.email || !apiBaseUrl()) return;
    let cancelled = false;
    const poll = async () => {
      try {
        const order = await fetchOrderConfirmation(ref, session.email);
        if (!cancelled && order) setStatus(order.status);
      } catch {
        // Keep the static confirmation; ITN may still be in flight.
      }
    };
    void poll();
    const id = window.setInterval(() => {
      void poll();
    }, 2000);
    const stop = window.setTimeout(() => window.clearInterval(id), 30000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
      window.clearTimeout(stop);
    };
  }, [ref, session?.email]);

  const meta =
    status === "PAID"
      ? orderConfirmedCopy.paid
      : status
        ? orderConfirmedCopy.waiting
        : orderConfirmedCopy.state;

  return (
    <section id="order-confirmed" className="chapter cm">
      <CommerceHead
        id="order-confirmed-head"
        label={orderConfirmedCopy.label}
        meta={meta}
        title={orderConfirmedCopy.title}
        titleRef={headingRef}
      />

      <div className="wrap cm-main cm-confirmed">
        {ref ? (
          <div className="cm-order">
            <p className="lbl">{orderConfirmedCopy.numberLabel}</p>
            <p className="cm-order__number">{ref}</p>
          </div>
        ) : null}
        <p className="body-copy voice">{orderConfirmedCopy.body}</p>
        <div className="cta-row">
          <Link className="btn btn--clay cm-cta cm-cta--auto" href="/#shop">
            {orderConfirmedCopy.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
