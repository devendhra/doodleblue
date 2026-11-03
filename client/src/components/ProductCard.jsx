
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  // Handle different possible product field names
  const productId = product.id || product._id;
  const productName = product.title || product.name || "Sports Product";

  const productImage =
    product.image ||
    (Array.isArray(product.images) ? product.images[0] : "") ||
    "";

  const price = Number(product.price) || 0;

  const discountedPrice =
    product.discountedPrice != null &&
    Number(product.discountedPrice) < price
      ? Number(product.discountedPrice)
      : price;

  const hasDiscount = discountedPrice < price;

  const rating = Number(product.rating) || 0;
  const stock = Number(product.stock ?? product.countInStock ?? 0);

  const handleViewProduct = () => {
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  const handleAddToCart = (event) => {
    event.stopPropagation();

    if (stock <= 0) return;

    // Parent component handles the actual cart action
    onAddToCart?.(product);
  };

  return (
    <article className="product-card">
      {/* Product Image */}
      <div
        className="product-card-image-wrapper"
        onClick={handleViewProduct}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleViewProduct();
          }
        }}
        aria-label={`View ${productName}`}
      >
        {hasDiscount && (
          <span className="product-discount-badge">
            {Math.round(((price - discountedPrice) / price) * 100)}% OFF
          </span>
        )}

        {productImage && !imageError ? (
          <img
            src={productImage}
            alt={productName}
            className="product-card-image"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="product-image-placeholder">
            <span>🏅</span>
            <p>Image unavailable</p>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="product-card-content">
        <p className="product-card-category">
          {typeof product.category === "object"
            ? product.category?.name || "Sports"
            : product.category || "Sports"}
        </p>

        <h3
          className="product-card-title"
          onClick={handleViewProduct}
          title={productName}
        >
          {productName}
        </h3>

        {/* Rating */}
        <div className="product-card-rating">
          <span className="rating-star">★</span>
          <span>{rating.toFixed(1)}</span>
          {product.reviewCount != null && (
            <span className="rating-reviews">
              ({product.reviewCount} reviews)
            </span>
          )}
        </div>

        {/* Price */}
        <div className="product-card-price">
          <span className="current-price">
            ₹{discountedPrice.toLocaleString("en-IN")}
          </span>

          {hasDiscount && (
            <span className="original-price">
              ₹{price.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="product-stock-status">
          {stock <= 0 ? (
            <span className="stock-out">Out of stock</span>
          ) : stock < 10 ? (
            <span className="stock-low">Only {stock} left</span>
          ) : (
            <span className="stock-available">In stock</span>
          )}
        </div>

        {/* Actions */}
        <div className="product-card-actions">
          <button
            type="button"
            className="product-view-button"
            onClick={handleViewProduct}
          >
            View Details
          </button>

          <button
            type="button"
            className="product-add-button"
            onClick={handleAddToCart}
            disabled={stock <= 0}
          >
            {stock <= 0 ? "Sold Out" : "Add to Cart"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
