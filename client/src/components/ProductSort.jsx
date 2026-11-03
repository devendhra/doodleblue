
import "./ProductSort.css";

function ProductSort({ sortBy, onSortChange, totalProducts }) {
  return (
    <div className="product-sort">
      {/* Product Count */}
      <div className="product-sort-info">
        <span className="product-sort-count">
          <strong>{totalProducts}</strong> products found
        </span>
      </div>

      {/* Sorting Dropdown */}
      <div className="product-sort-control">
        <label htmlFor="product-sort">Sort by:</label>

        <select
          id="product-sort"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Top Rated</option>
        </select>
      </div>
    </div>
  );
}

export default ProductSort;
