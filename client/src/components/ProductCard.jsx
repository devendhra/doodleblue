import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cart";
import LoginPromptDialog from "./LoginPromptDialog";

function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);

  const productId = product.id || product._id;
  const productName = product.title || product.name || "Sports Product";
  const productImage =
    product.thumbnail ||
    product.image ||
    (Array.isArray(product.images) ? product.images[0] : "") ||
    "";

  const price = Number(product.price) || 0;
  const discountPercentage = Number(product.discountPercentage) || 0;
  const discountedPrice =
    product.discountedPrice != null && Number(product.discountedPrice) < price
      ? Number(product.discountedPrice)
      : Math.round(price * (1 - discountPercentage / 100) * 100) / 100;

  const hasDiscount = discountedPrice < price;
  const rating = Number(product.rating) || 0;
  const stock = Number(product.stock ?? product.countInStock ?? 0);

  const handleViewProduct = () => {
    if (productId) navigate(`/product/${productId}`);
  };

  const handleAddToCart = (event) => {
    event.stopPropagation();
    if (stock <= 0) return;

    if (!localStorage.getItem("token")) {
      setLoginPromptOpen(true);
      return;
    }

    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(
        {
          ...product,
          id: productId,
          thumbnail: productImage,
          discountedPrice,
        },
        1
      );
    }

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200/90 bg-white transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-accent-600/50 hover:shadow-2xl shadow-sm">
      {/* Product Image Box */}
      <div
        className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden bg-gray-50 flex items-center justify-center p-6"
        onClick={handleViewProduct}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleViewProduct()}
        aria-label={`View ${productName}`}
      >
        {hasDiscount && (
          <span className="absolute left-3 top-3 z-[2] rounded-full bg-accent-600 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
            {Math.round(((price - discountedPrice) / price) * 100)}% OFF
          </span>
        )}

        {productImage && !imageError ? (
          <img
            src={productImage}
            alt={productName}
            className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-400">
            <span className="text-3xl">🏅</span>
            <span className="text-xs font-bold uppercase tracking-wider">No Image</span>
          </div>
        )}
      </div>

      {/* Card Content Section */}
      <div className="flex flex-1 flex-col p-5">
        <p className="m-0 mb-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-accent-600">
          {typeof product.category === "object"
            ? product.category?.name || "Sports"
            : product.category || "Sports Gear"}
        </p>

        <h3
          className="m-0 mb-3 min-h-[44px] cursor-pointer font-heading text-sm font-black leading-snug text-gray-900 transition duration-150 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] hover:text-accent-600"
          onClick={handleViewProduct}
          title={productName}
        >
          {productName}
        </h3>

        {/* Rating and Reviews */}
        <div className="mb-3 flex items-center gap-1.5 text-xs font-bold text-gray-700">
          <span className="text-sm text-amber-500">★</span>
          <span>{rating.toFixed(1)}</span>
          {product.ratingCount != null && (
            <span className="text-gray-400 font-medium">({product.ratingCount})</span>
          )}
        </div>

        {/* Price and Stock Status */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 mb-4">
          <div>
            <div className="font-heading text-lg font-black tracking-tight text-gray-900">
              ₹{discountedPrice.toLocaleString("en-IN")}
            </div>
            {hasDiscount && (
              <div className="text-xs font-bold text-gray-400 line-through">
                ₹{price.toLocaleString("en-IN")}
              </div>
            )}
          </div>

          <div className="text-[10px] font-black uppercase tracking-wider">
            {stock <= 0 ? (
              <span className="text-danger-700 bg-danger-50 px-2.5 py-1 rounded-full border border-danger-200">Sold Out</span>
            ) : stock < 10 ? (
              <span className="text-danger-700 bg-danger-50 px-2.5 py-1 rounded-full border border-danger-200">Only {stock} Left</span>
            ) : (
              <span className="text-success-700 bg-success-50 px-2.5 py-1 rounded-full border border-success-200">In Stock</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleViewProduct}
            className="min-h-[40px] rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-black uppercase tracking-wider text-gray-800 transition duration-150 hover:border-gray-900 hover:bg-gray-50 shadow-sm"
          >
            Details
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className="min-h-[40px] rounded-xl bg-accent-600 px-3 py-2 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-accent-600/30 transition duration-150 enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none"
          >
            {stock <= 0 ? "Sold Out" : justAdded ? "Added ✓" : "Add to Cart"}
          </button>
        </div>
      </div>

      <LoginPromptDialog open={loginPromptOpen} onClose={() => setLoginPromptOpen(false)} />
    </article>
  );
}

export default ProductCard;
