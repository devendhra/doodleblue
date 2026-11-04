import ProductCard from "./ProductCard";

// Grid of product cards + the empty state.
// .product-grid is a shared Tailwind utility defined in index.css
// (2 columns on mobile, 3 on tablet, 4 on desktop).

function ProductGrid({ products, onAddToCart }) {
  // Handle empty products
  if (!products || products.length === 0) {
    return (
      <div className="flex min-h-[270px] w-full flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white px-4 py-12 text-center shadow-sm sm:min-h-[300px] sm:px-6 lg:min-h-[360px] lg:py-16">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-50 text-3xl shadow-md sm:h-20 sm:w-20 sm:text-4xl">
          🏃
        </div>

        <h3 className="mb-3 font-heading text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
          No products found
        </h3>

        <p className="m-0 max-w-[420px] text-xs sm:text-sm leading-relaxed text-gray-500 font-medium">
          We couldn't find any products matching your selection. Try changing your filters or searching for something else.
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