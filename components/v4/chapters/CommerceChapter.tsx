"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
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
  STUB_ORDER_STORAGE_KEY,
  createPaymentStub,
  parseStubOrder,
  serialiseStubOrder,
} from "@/lib/v4/order";
import { deliveryOptions, formatPrice } from "@/lib/v4/products";

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
  onChange,
}: {
  field: CheckoutField;
  type: "text" | "email" | "tel";
  value: string;
  error?: string;
  errors: CheckoutErrors;
  inputMode?: "email" | "tel" | "text";
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
        required
        aria-required="true"
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
  const [deliveryId, setDeliveryId] = useState<string>(deliveryOptions[0].id);
  const [paymentId, setPaymentId] = useState<string>(
    checkoutCopy.paymentOptions[0].id,
  );
  const [pending, setPending] = useState(false);
  const radioGroup = useId();

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

  const delivery =
    deliveryOptions.find((o) => o.id === deliveryId) ?? deliveryOptions[0];
  const total = orderTotalCents(subtotalCents, delivery.priceCents);

  const onFieldChange =
    (field: CheckoutField) => (event: ChangeEvent<HTMLInputElement>) => {
      const next = { ...values, [field]: event.target.value };
      setValues(next);
      if (errors[field]) {
        const rest = { ...errors };
        if (!validateCheckout(next)[field]) delete rest[field];
        setErrors(rest);
      }
    };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (payment.isInFlight()) return;
    const found = validateCheckout(values);
    // Render the errors (and their aria-describedby links) before focus moves, so the
    // first invalid field is announced together with its message.
    flushSync(() => setErrors(found));
    if (focusFirstInvalid(found, (id) => document.getElementById(id))) return;

    if (payment.submit({ itemCount: count, totalCents: total })) setPending(true);
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
                {CHECKOUT_FIELD_ORDER.filter((f) => f !== "address").map(
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
                <Field
                  field="address"
                  type="text"
                  value={values.address}
                  error={errors.address}
                  errors={errors}
                  onChange={onFieldChange("address")}
                />
                <div
                  className="cm-options"
                  role="radiogroup"
                  aria-label={checkoutCopy.deliveryLegend}
                >
                  {deliveryOptions.map((opt) => (
                    <label
                      key={opt.id}
                      className="cm-option"
                      data-checked={opt.id === deliveryId || undefined}
                    >
                      <input
                        type="radio"
                        name={`${radioGroup}-delivery`}
                        value={opt.id}
                        checked={opt.id === deliveryId}
                        onChange={() => setDeliveryId(opt.id)}
                      />
                      <span>
                        {opt.label} · {formatPrice(opt.priceCents)}
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              <section className="cm-block">
                <h2 className="lbl cm-block__label">
                  {checkoutCopy.payment}
                </h2>
                <div
                  className="cm-options"
                  role="radiogroup"
                  aria-label={checkoutCopy.paymentLegend}
                >
                  {checkoutCopy.paymentOptions.map((opt) => (
                    <label
                      key={opt.id}
                      className="cm-option"
                      data-checked={opt.id === paymentId || undefined}
                    >
                      <input
                        type="radio"
                        name={`${radioGroup}-payment`}
                        value={opt.id}
                        checked={opt.id === paymentId}
                        onChange={() => setPaymentId(opt.id)}
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
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
                  {formatPrice(delivery.priceCents)}
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
              <p className="lbl cm-note">{checkoutCopy.stubNote}</p>
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

export function OrderConfirmedChapter() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stored = useSyncExternalStore(
    subscribeNever,
    readStubOrderText,
    () => null,
  );
  const order = parseStubOrder(stored);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <section id="order-confirmed" className="chapter cm">
      <CommerceHead
        id="order-confirmed-head"
        label={orderConfirmedCopy.label}
        meta={orderConfirmedCopy.state}
        title={orderConfirmedCopy.title}
        titleRef={headingRef}
      />

      <div className="wrap cm-main cm-confirmed">
        {order ? (
          <div className="cm-order">
            <p className="lbl">{orderConfirmedCopy.numberLabel}</p>
            <p className="cm-order__number">{order.ref}</p>
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
