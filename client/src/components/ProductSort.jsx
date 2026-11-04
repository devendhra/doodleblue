// src/components/ProductSort.jsx
function ProductSort({ sortBy, onSortChange, totalProducts }) {
  return (
    <div className="mb-6 flex w-full flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200/80 bg-white px-6 py-4 shadow-xl">
      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
        <strong className="text-gray-900 font-black text-sm mr-1">{totalProducts}</strong> products found
      </span>

      <div className="flex items-center gap-3">
        <label htmlFor="product-sort" className="text-xs font-black uppercase tracking-wider text-gray-600">
          Sort by:
        </label>
        <select
          id="product-sort"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-11 rounded-xl border border-gray-300 bg-white px-4 text-xs font-black uppercase tracking-wider text-gray-900 outline-none transition focus:border-accent-600 cursor-pointer"
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