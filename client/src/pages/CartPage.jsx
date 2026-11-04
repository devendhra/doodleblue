import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ConfirmDialog from "../components/ConfirmDialog";
import LoginPromptDialog from "../components/LoginPromptDialog";
import {
  CART_EVENT,
  clearCart,
  readCart,
  removeFromCart,
  setCartQuantity,
} from "../utils/cart";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
const round2 = (n) => Math.round(n * 100) / 100;
const unitPrice = (product) =>
  typeof product.discountedPrice === "number"
    ? product.discountedPrice
    : round2(product.price * (1 - (product.discountPercentage ?? 0) / 100));

function ImagePlaceholder() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="m4 17 5-5 3.5 3.5 2.5-2.5 5 5" strokeLinejoin="round" />
    </svg>
  );
}

function CartPage() {
  const [items, setItems] = useState(readCart);
  const [coupon, setCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponBusy, setCouponBusy] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    const refresh = () => setItems(readCart());
    window.addEventListener(CART_EVENT, refresh);
    return () => window.removeEventListener(CART_EVENT, refresh);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/coupons`)
      .then((res) => res.json())
      .then((data) => setAvailableCoupons(data.coupons || []))
      .catch(() => setAvailableCoupons([]));
  }, []);

  const changeQuantity = (productId, quantity) => {
    setCartQuantity(productId, quantity);
    setItems(readCart());
  };

  const removeItem = (productId) => {
    removeFromCart(productId);
    setItems(readCart());
  };

  const emptyCart = () => {
    clearCart();
    setItems([]);
    setCoupon(null);
    setCouponCode("");
    setCouponMessage("");
    setCheckoutMessage("");
  };

  const applyCoupon = async (codeFromChip) => {
    const codeToApply = (codeFromChip || couponCode).trim();
    if (!codeToApply) {
      setCouponMessage("Enter a coupon code.");
      return;
    }

    setCouponBusy(true);
    setCouponMessage("");
    try {
      const response = await fetch(`${API_URL}/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeToApply }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid coupon code");
      setCoupon(data);
      setCouponCode(data.code);
      setCouponMessage(`${data.code} applied: ${data.percentOff}% off`);
    } catch (requestError) {
      setCoupon(null);
      setCouponMessage(requestError.message);
    } finally {
      setCouponBusy(false);
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponCode("");
    setCouponMessage("");
  };

  const openCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCheckoutMessage("Sign in before continuing to checkout.");
      return;
    }
    setCheckoutMessage("");
    setConfirmOpen(true);
  };

  const placeOrder = async () => {
    if (!items.length) return;
    const token = localStorage.getItem("token");
    if (!token) {
      setConfirmOpen(false);
      setCheckoutMessage("Sign in before continuing to checkout.");
      return;
    }

    setCheckoutBusy(true);
    setCheckoutMessage("");
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map(({ id, quantity }) => ({ productId: id, quantity })),
          ...(coupon?.code ? { couponCode: coupon.code } : {}),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not place the order.");
      setConfirmOpen(false);
      emptyCart();
      navigate("/orders");
    } catch (requestError) {
      setConfirmOpen(false);
      setCheckoutMessage(requestError.message);
    } finally {
      setCheckoutBusy(false);
    }
  };

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const subtotal = round2(
    items.reduce((sum, item) => sum + unitPrice(item) * item.quantity, 0)
  );
  const discount = round2((subtotal * (coupon?.percentOff ?? 0)) / 100);
  const shipping = subtotal === 0 || subtotal >= 4400 ? 0 : 439;
  const total = round2(subtotal - discount + shipping);
  const freeShippingRemaining = Math.max(0, round2(4400 - subtotal));

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
        <Header />
        <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 sm:px-6" />
        <LoginPromptDialog open onClose={() => navigate("/")} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Header />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="mb-2 inline-block rounded-full bg-accent-50 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-accent-600">
              ⚡ SECURE BASKET
            </span>
            <h1 className="font-heading text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              Shopping Cart
            </h1>
            <p className="mt-1 text-sm font-bold text-gray-500">
              {itemCount} {itemCount === 1 ? "item" : "items"} ready for dispatch
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs font-black uppercase tracking-wider text-accent-600 transition hover:underline"
          >
            ← Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <section className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-50 text-3xl shadow-md">
              🛒
            </div>
            <h2 className="mt-6 font-heading text-2xl font-black text-gray-900">
              Your cart is empty
            </h2>
            <p className="mt-2 text-sm text-gray-500 font-medium max-w-[360px] mx-auto">
              Looks like you haven't added any professional sports gear yet.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex h-12 items-center rounded-2xl bg-accent-600 px-8 font-heading text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-accent-600/30 transition hover:brightness-110"
            >
              Start Shopping
            </Link>
            {checkoutMessage && (
              <p className="mt-4 text-xs font-bold text-success-700">{checkoutMessage}</p>
            )}
          </section>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
            {/* Items list */}
            <section
              aria-label="Cart items"
              className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 bg-gray-50/50">
                <span className="text-xs font-black uppercase tracking-widest text-gray-500">
                  Item Details
                </span>
                <button
                  type="button"
                  onClick={emptyCart}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-gray-700 transition hover:border-danger-600 hover:bg-danger-50 hover:text-danger-700 shadow-sm"
                >
                  Clear Cart
                </button>
              </div>

              {items.map((product) => {
                const quantityLimit = Math.min(product.stock ?? 20, 20);
                const unit = unitPrice(product);
                const discounted = unit < product.price;
                return (
                  <article
                    key={product.id}
                    className="flex flex-wrap items-center gap-5 border-b border-gray-100 px-6 py-5 last:border-b-0 hover:bg-gray-50/40 transition"
                  >
                    <Link
                      to={`/product/${product.id}`}
                      className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gray-100 border border-gray-200"
                    >
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="h-full w-full object-contain p-2"
                        />
                      ) : (
                        <ImagePlaceholder />
                      )}
                    </Link>

                    <div className="min-w-0 flex-1 basis-44">
                      <Link
                        to={`/product/${product.id}`}
                        className="block truncate font-heading text-sm font-black text-gray-900 hover:text-accent-600"
                      >
                        {product.title}
                      </Link>
                      {product.category && (
                        <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-accent-600">
                          {typeof product.category === "object"
                            ? product.category?.name
                            : product.category}
                        </p>
                      )}
                      <p className="mt-1 text-sm font-bold text-gray-900">
                        {formatPrice(unit)}
                        {discounted && (
                          <span className="ml-2 text-xs font-medium text-gray-400 line-through">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex h-11 items-center gap-3 rounded-2xl border border-gray-300 bg-white px-4 text-sm font-bold shadow-sm">
                      <button
                        type="button"
                        aria-label={product.quantity <= 1 ? "Remove item" : "Decrease quantity"}
                        onClick={() =>
                          product.quantity <= 1
                            ? removeItem(product.id)
                            : changeQuantity(product.id, product.quantity - 1)
                        }
                        className="text-base text-gray-700 transition disabled:text-gray-300"
                      >
                        −
                      </button>
                      <span className="w-5 text-center font-black">{product.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        disabled={product.quantity >= quantityLimit}
                        onClick={() => changeQuantity(product.id, product.quantity + 1)}
                        className="text-base text-gray-700 transition disabled:text-gray-300"
                      >
                        +
                      </button>
                    </div>

                    <p className="w-24 text-right font-heading text-base font-black text-gray-900">
                      {formatPrice(round2(unit * product.quantity))}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="text-xs font-black uppercase tracking-wider text-danger-600 transition hover:underline"
                    >
                      Remove
                    </button>
                  </article>
                );
              })}
            </section>

            {/* Order Summary */}
            <aside className="rounded-3xl border border-gray-200/80 bg-white p-7 shadow-xl lg:sticky lg:top-6">
              <h2 className="mb-5 font-heading text-xl font-black tracking-tight text-gray-900">
                Order Summary
              </h2>

              <label htmlFor="coupon-code" className="mb-2 block text-xs font-black uppercase tracking-wider text-gray-700">
                Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  id="coupon-code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                  placeholder="e.g. SAVE10"
                  className="h-12 min-w-0 flex-1 rounded-2xl border border-gray-300 bg-gray-50 px-4 text-sm font-semibold text-gray-900 outline-none transition focus:border-accent-600 focus:bg-white focus:ring-4 focus:ring-accent-600/15"
                />
                <button
                  type="button"
                  onClick={() => applyCoupon()}
                  disabled={couponBusy}
                  className="h-12 rounded-2xl border border-accent-600 bg-accent-50 px-5 text-xs font-black uppercase tracking-wider text-accent-600 transition hover:bg-accent-600 hover:text-white disabled:opacity-50"
                >
                  {couponBusy ? "Checking..." : "Apply"}
                </button>
              </div>

              {couponMessage && (
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <p className={`m-0 text-xs font-bold ${coupon ? "text-success-700" : "text-danger-700"}`}>
                    {couponMessage}
                  </p>
                  {coupon && (
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs font-bold text-danger-700 underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}

              {availableCoupons.length > 0 && (
                <div className="mt-4">
                  <p className="m-0 mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Available Coupons
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableCoupons.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => applyCoupon(c.code)}
                        className="rounded-xl border border-dashed border-accent-600/40 bg-accent-50 px-3 py-1.5 text-xs font-black text-accent-600 transition hover:border-solid hover:bg-accent-600 hover:text-white"
                      >
                        {c.code} · {c.percentOff}% off
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {subtotal > 0 && freeShippingRemaining > 0 && (
                <div className="mt-5 rounded-2xl bg-accent-50 p-4 border border-accent-600/20">
                  <p className="mb-2 text-xs font-black text-accent-900">
                    ⚡ Add {formatPrice(freeShippingRemaining)} more for FREE shipping!
                  </p>
                  <div className="h-2 overflow-hidden rounded-full bg-accent-200">
                    <div
                      className="h-full rounded-full bg-accent-600 transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / 499) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-3.5 border-b border-gray-200 pb-5 text-sm font-bold text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-success-700 font-black">
                    <span>Coupon ({coupon.code})</span>
                    <span>−{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-success-700 font-black" : ""}>
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-5">
                <span className="text-base font-black text-gray-900">Total Due</span>
                <span className="font-heading text-3xl font-black tracking-tight text-gray-900">
                  {formatPrice(total)}
                </span>
              </div>

              <button
                type="button"
                onClick={openCheckout}
                disabled={checkoutBusy || !items.length}
                className="h-14 w-full rounded-2xl bg-accent-600 font-heading text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-accent-600/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checkoutBusy ? "Processing..." : "Proceed to Checkout"}
              </button>

              {checkoutMessage && (
                <p role="status" className="mt-3 text-xs font-bold text-danger-700">
                  {checkoutMessage}
                </p>
              )}
            </aside>
          </div>
        )}
      </main>

      <ConfirmDialog
        open={confirmOpen}
        title="Review Your Order"
        confirmText={`Place Order · ${formatPrice(total)}`}
        cancelText="Keep Shopping"
        busy={checkoutBusy}
        onConfirm={placeOrder}
        onClose={() => setConfirmOpen(false)}
      >
        <ul className="m-0 mb-4 max-h-52 divide-y divide-gray-100 overflow-y-auto">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between gap-3 py-2.5 text-sm font-semibold">
              <span className="min-w-0 truncate text-gray-800">
                {item.title} <span className="text-gray-400">× {item.quantity}</span>
              </span>
              <span className="shrink-0 font-black text-gray-900">
                {formatPrice(round2(unitPrice(item) * item.quantity))}
              </span>
            </li>
          ))}
        </ul>
        <div className="space-y-2 border-t border-gray-200 pt-4 text-sm font-bold text-gray-700">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {coupon && (
            <div className="flex justify-between text-success-700">
              <span>Coupon ({coupon.code})</span>
              <span>−{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className={shipping === 0 ? "text-success-700" : ""}>
              {shipping === 0 ? "FREE" : formatPrice(shipping)}
            </span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-3 font-heading text-lg font-black text-gray-900">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </ConfirmDialog>

      <Footer />
    </div>
  );
}

export default CartPage;
