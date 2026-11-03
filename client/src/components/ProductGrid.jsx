
import ProductCard from "./ProductCard";
import "./ProductGrid.css";

function ProductGrid({ products, onAddToCart }) {
  // Handle empty products
  if (!products || products.length === 0) {
    return (
      <div className="product-grid-empty">
        <div className="empty-icon">🏃</div>

        <h3>No products found</h3>

        <p>
          We couldn't find any products matching your selection.
          Try changing your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id || product._id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
