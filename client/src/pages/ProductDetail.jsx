import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProductById, fetchRelatedProducts } from "../services/api";
import { addToCart, MAX_QTY } from "../utils/cart";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import ProductCard from "../components/ProductCard";
import LoginPromptDialog from "../components/LoginPromptDialog";

const formatPrice = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    setProduct(null);
    setRelated([]);
    setImageIndex(0);
    setImageError(false);
    setQuantity(1);
    window.scrollTo(0, 0);

    fetchProductById(id)
      .then((data) => {
        if (!alive) return;
        const prod = data.product || data;
        setProduct(prod);
        document.title = `${prod.title} | Prolane Athletics`;
      })
      .catch((err) => {
        if (!alive) return;
        const status = err.response?.status;
        setError(status === 404 || status === 400 ? "not-found" : "load-error");
      })
      .finally(() => alive && setLoading(false));

    fetchRelatedProducts(id)
      .then((data) => alive && setRelated(data.products || []))
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, [id]);

  const images = useMemo(() => {
    if (!product) return [];
    const list = [];
    if (product.thumbnail) list.push(product.thumbnail);
    if (Array.isArray(product.images)) {
      product.images.forEach((img) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    return list;
  }, [product]);

  const price = Number(product?.price) || 0;
  const discountPercentage = Number(product?.discountPercentage) || 0;
  const discounted =
    product?.discountedPrice != null && product.discountedPrice < price
      ? Number(product.discountedPrice)
      : Math.round(price * (1 - discountPercentage / 100) * 100) / 100;
  const hasDiscount = discounted < price;
  const stock = Number(product?.stock ?? 0);
  const maxQty = Math.min(stock, MAX_QTY);
  const rating = Number(product?.rating) || 0;

  const handleAddToCart = () => {
    if (stock <= 0) return;
    if (!localStorage.getItem("token")) {
      setLoginPromptOpen(true);
      return;
    }

    addToCart({ ...product, thumbnail: images[0], discountedPrice: discounted }, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const stepImage = (dir) => {
    if (images.length < 2) return;
    setImageError(false);
    setImageIndex((i) => (i + dir + images.length) % images.length);
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 text-gray-900">
        <div className="mx-auto max-w-[1280px] px-[5%] pb-20 pt-8 lg:px-[6%]">
          {loading && <Loader message="Loading professional gear..." />}

          {!loading && error === "not-found" && (
            <div className="mx-auto flex min-h-[385px] max-w-[520px] flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-2xl">
              <div className="text-5xl">🔍</div>
              <h1 className="m-0 mt-4 font-heading text-2xl font-black text-gray-900">
                Product Not Found
              </h1>
              <p className="mt-2 text-sm text-gray-500 font-medium">
                This item does not exist or has been removed from our catalog.
              </p>
              <Link
                to="/products"
                className="mt-6 inline-flex h-12 items-center rounded-2xl bg-accent-600 px-8 font-heading text-xs font-black uppercase tracking-wider text-white shadow-lg transition hover:brightness-110"
              >
                Back to Products
              </Link>
            </div>
          )}

          {!loading && error === "load-error" && (
            <div className="mx-auto flex min-h-[385px] max-w-[520px] flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-2xl">
              <div className="text-5xl">⚠️</div>
              <h1 className="m-0 mt-4 font-heading text-2xl font-black text-gray-900">
                Connection Error
              </h1>
              <p className="mt-2 text-sm text-gray-500 font-medium">
                Failed to load product details. Please check your network connection.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-6 inline-flex h-12 items-center rounded-2xl bg-accent-600 px-8 font-heading text-xs font-black uppercase tracking-wider text-white shadow-lg transition hover:brightness-110"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && product && (
            <>
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs font-bold text-gray-500">
                <Link to="/" className="text-gray-700 hover:text-accent-600">Home</Link>
                <span>/</span>
                <Link
                  to={`/products?category=${encodeURIComponent(
                    typeof product.category === "object"
                      ? product.category?.slug
                      : product.category || ""
                  )}`}
                  className="capitalize text-gray-700 hover:text-accent-600"
                >
                  {typeof product.category === "object"
                    ? product.category?.name
                    : product.category || "Products"}
                </Link>
                <span>/</span>
                <span className="text-accent-600 font-black">{product.title}</span>
              </nav>

              <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
                {/* Gallery */}
                <div>
                  <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
                    {images[imageIndex] && !imageError ? (
                      <img
                        src={images[imageIndex]}
                        alt={product.title}
                        className="h-full w-full object-contain p-4"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gray-100 text-gray-400">
                        <span className="text-6xl">🏅</span>
                        <p className="m-0 text-sm font-bold uppercase">No Image</p>
                      </div>
                    )}

                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          aria-label="Previous image"
                          onClick={() => stepImage(-1)}
                          className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl border border-gray-200 bg-white/90 text-xl font-bold text-gray-800 shadow-md transition hover:bg-white"
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          aria-label="Next image"
                          onClick={() => stepImage(1)}
                          className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl border border-gray-200 bg-white/90 text-xl font-bold text-gray-800 shadow-md transition hover:bg-white"
                        >
                          ›
                        </button>
                      </>
                    )}
                  </div>

                  {images.length > 1 && (
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {images.map((src, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setImageIndex(i);
                              setImageError(false);
                            }}
                            aria-label={`Show image ${i + 1}`}
                            className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-white transition ${
                              i === imageIndex
                                ? "border-accent-600 shadow-md"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <img src={src} alt="" className="h-full w-full object-contain p-1" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-black uppercase tracking-widest text-accent-600">
                      {typeof product.category === "object"
                        ? product.category?.name
                        : product.category || "Professional Sports"}
                    </span>
                    {stock <= 0 ? (
                      <span className="rounded-full bg-danger-50 px-3.5 py-1 text-xs font-black text-danger-700">
                        Out of stock
                      </span>
                    ) : stock < 10 ? (
                      <span className="rounded-full bg-warning-50 px-3.5 py-1 text-xs font-black text-warning-700">
                        Only {stock} left
                      </span>
                    ) : (
                      <span className="rounded-full bg-success-50 px-3.5 py-1 text-xs font-black text-success-700">
                        In stock ({stock})
                      </span>
                    )}
                  </div>

                  <h1 className="m-0 mt-3 font-heading text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl">
                    {product.title}
                  </h1>

                  <div className="mt-3 flex items-center gap-2 text-sm font-bold text-gray-700">
                    <span className="text-amber-500 text-lg">★</span>
                    <span>{rating.toFixed(1)}</span>
                    {product.ratingCount != null && (
                      <span className="text-gray-400 font-medium">({product.ratingCount} reviews)</span>
                    )}
                    {product.brand && (
                      <span className="text-gray-400">
                        · Brand: <strong className="text-gray-900">{product.brand}</strong>
                      </span>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-gray-200/80 py-5">
                    <span className="font-heading text-4xl font-black tracking-tight text-gray-900">
                      {formatPrice(discounted)}
                    </span>
                    {hasDiscount && (
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-gray-400 line-through">
                          {formatPrice(price)}
                        </span>
                        <span className="rounded-full bg-accent-50 px-3.5 py-1 text-xs font-black text-accent-600">
                          {Math.round(discountPercentage)}% OFF
                        </span>
                      </div>
                    )}
                  </div>

                  {product.description && (
                    <p className="mt-6 text-sm sm:text-base leading-relaxed text-gray-600 font-medium">
                      {product.description}
                    </p>
                  )}

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <div className="flex h-14 items-center gap-4 rounded-2xl border border-gray-300 bg-white px-5 text-base font-black shadow-sm">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        disabled={quantity <= 1}
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="text-xl text-gray-700 disabled:text-gray-300"
                      >
                        −
                      </button>
                      <span className="w-6 text-center">{quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        disabled={quantity >= maxQty}
                        onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                        className="text-xl text-gray-700 disabled:text-gray-300"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={stock <= 0}
                      className="h-14 min-w-[200px] flex-1 rounded-2xl bg-accent-600 px-8 font-heading text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-accent-600/30 transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none"
                    >
                      {stock <= 0
                        ? "Out of Stock"
                        : justAdded
                        ? "Added ✓"
                        : "Add to Cart"}
                    </button>
                  </div>

                  {/* Trust Cards */}
                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    {[
                      ["🚚", "Free Shipping", "Orders over ₹499"],
                      ["↩️", "Easy Returns", product.returnPolicy || "7-day guarantee"],
                      ["🛡️", "Warranty", product.warrantyInformation || "Verified authentic"],
                    ].map(([icon, title, text]) => (
                      <div key={title} className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm">
                        <div className="text-2xl">{icon}</div>
                        <p className="m-0 mt-2 text-xs font-black uppercase text-gray-900">{title}</p>
                        <p className="m-0 mt-0.5 text-xs text-gray-500 font-medium">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Similar Products */}
              {related.length > 0 && (
                <section className="mt-20">
                  <h2 className="m-0 mb-8 font-heading text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                    Similar Products You May Like
                  </h2>
                  <div className="product-grid">
                    {related.map((item) => (
                      <ProductCard key={item.id} product={item} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      <LoginPromptDialog open={loginPromptOpen} onClose={() => setLoginPromptOpen(false)} />
      <Footer />
    </>
  );
}

export default ProductDetail;