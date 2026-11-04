import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ConfirmDialog from "../components/ConfirmDialog";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const formatPrice = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const lineUnit = (item) =>
  Math.round(item.price * (1 - (item.discountPercentage ?? 0) / 100) * 100) / 100;

const STATUS_STYLES = {
  pending: "bg-warning-50 text-warning-700 border border-warning-200",
  paid: "bg-success-50 text-success-700 border border-success-200",
  shipped: "bg-primary-50 text-primary-700 border border-primary-200",
  delivered: "bg-success-50 text-success-700 border border-success-200",
  cancelled: "bg-danger-50 text-danger-700 border border-danger-200",
};

function Orders() {
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState("");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelBusy, setCancelBusy] = useState(false);

  const loadOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/orders/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not load orders.");
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const cancelOrder = async () => {
    if (!cancelTarget) return;
    setCancelBusy(true);
    try {
      const res = await fetch(`${API_URL}/orders/${cancelTarget._id}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not cancel order.");
      setCancelTarget(null);
      loadOrders();
    } catch (err) {
      setCancelTarget(null);
      setError(err.message);
    } finally {
      setCancelBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Header />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="mb-2 inline-block rounded-full bg-accent-50 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-accent-600">
              ⚡ ATHLETE HISTORY
            </span>
            <h1 className="font-heading text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              My Orders
            </h1>
            <p className="mt-1 text-sm font-bold text-gray-500">
              {orders.length > 0
                ? `${orders.length} ${orders.length === 1 ? "order" : "orders"} placed`
                : "Track your sports equipment deliveries"}
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs font-black uppercase tracking-wider text-accent-600 transition hover:underline"
          >
            ← Continue Shopping
          </Link>
        </div>

        {!token && (
          <section className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-xl">
            <div className="text-5xl">🔐</div>
            <h2 className="mt-4 font-heading text-2xl font-black text-gray-900">
              Log in to see your orders
            </h2>
            <p className="mt-2 text-sm text-gray-500 font-medium">
              Your order history is securely tied to your Prolane account.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex h-12 items-center rounded-2xl bg-accent-600 px-8 font-heading text-xs font-black uppercase tracking-wider text-white shadow-lg transition hover:brightness-110"
            >
              Log In
            </Link>
          </section>
        )}

        {token && loading && (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="animate-pulse rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 h-5 w-48 rounded bg-gray-200" />
                <div className="h-16 w-full rounded bg-gray-100" />
              </div>
            ))}
          </div>
        )}

        {token && !loading && error && (
          <div className="flex flex-col items-center rounded-3xl border border-danger-200 bg-danger-50 p-10 text-center">
            <h2 className="m-0 font-heading text-xl font-bold text-gray-900">
              Could not load your orders
            </h2>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
            <button
              type="button"
              onClick={loadOrders}
              className="mt-5 rounded-xl bg-accent-600 px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md hover:brightness-110"
            >
              Try Again
            </button>
          </div>
        )}

        {token && !loading && !error && orders.length === 0 && (
          <section className="rounded-3xl border border-gray-200 bg-white p-14 text-center shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-50 text-3xl shadow-md">
              📦
            </div>
            <h2 className="mt-5 font-heading text-2xl font-black text-gray-900">
              No orders placed yet
            </h2>
            <p className="mt-2 text-sm text-gray-500 font-medium">
              When you purchase professional sports gear, your orders will appear here.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex h-12 items-center rounded-2xl bg-accent-600 px-8 font-heading text-xs font-black uppercase tracking-wider text-white shadow-lg transition hover:brightness-110"
            >
              Explore Collection
            </Link>
          </section>
        )}

        {token && !loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => {
              const shortId = String(order._id).slice(-6).toUpperCase();
              const placed = new Date(order.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              return (
                <article key={order._id} className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-5 bg-gray-50/50">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-heading text-base font-black text-gray-900">
                        Order #{shortId}
                      </span>
                      <span className="text-xs font-bold text-gray-500">
                        Placed on {placed}
                      </span>
                    </div>
                    <span className={`rounded-full px-4 py-1 text-xs font-black uppercase tracking-wider ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-700"}`}>
                      {order.status}
                    </span>
                  </div>

                  <ul className="m-0 divide-y divide-gray-100">
                    {order.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-4 px-6 py-4">
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gray-100 border border-gray-200">
                          {item.thumbnail ? (
                            <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />
                          ) : (
                            "🏅"
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="m-0 truncate text-sm font-black text-gray-900">{item.title}</p>
                          <p className="m-0 text-xs font-bold text-gray-500">
                            {formatPrice(lineUnit(item))} × {item.quantity}
                          </p>
                        </div>
                        <span className="text-sm font-black text-gray-900">
                          {formatPrice(lineUnit(item) * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 bg-gray-50 px-6 py-5">
                    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 text-xs font-bold text-gray-600">
                      <span>Subtotal: {formatPrice(order.subtotal)}</span>
                      {order.couponCode && (
                        <span className="text-success-700 font-black">
                          Promo ({order.couponCode}): −{formatPrice(order.discount)}
                        </span>
                      )}
                      <span>
                        Shipping: {order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}
                      </span>
                      <span className="font-heading text-base font-black text-gray-900">
                        Total: {formatPrice(order.total)}
                      </span>
                    </div>

                    {order.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => setCancelTarget(order)}
                        className="rounded-xl border border-danger-300 bg-danger-50 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-danger-700 transition hover:bg-danger-600 hover:text-white"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        title="Cancel This Order?"
        confirmText="Yes, Cancel Order"
        cancelText="Keep Order"
        danger
        busy={cancelBusy}
        onConfirm={cancelOrder}
        onClose={() => setCancelTarget(null)}
      >
        {cancelTarget && (
          <p className="m-0 font-medium">
            Order #{String(cancelTarget._id).slice(-6).toUpperCase()} for{" "}
            <strong>{formatPrice(cancelTarget.total)}</strong> will be cancelled and items returned to stock. This action cannot be undone.
          </p>
        )}
      </ConfirmDialog>

      <Footer />
    </div>
  );
}

export default Orders;