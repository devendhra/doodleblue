// src/components/ProductFilters.jsx
const fieldClass =
  "h-12 w-full rounded-2xl border border-gray-300 bg-white px-4 text-xs font-bold text-gray-900 outline-none transition hover:border-gray-400 focus:border-accent-600 focus:ring-4 focus:ring-accent-600/15";
const labelClass = "text-xs font-black uppercase tracking-wider text-gray-700";

function ProductFilters({ categories = [], filters, onFilterChange, onReset }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <aside className="h-fit w-full rounded-3xl border border-gray-200/80 bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <span className="text-[10px] font-black tracking-widest text-accent-600 uppercase">
            ⚡ REFINE SEARCH
          </span>
          <h3 className="m-0 font-heading text-xl font-black text-gray-900">Filters</h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-accent-600/30 bg-accent-50 px-3.5 py-2 text-xs font-black uppercase tracking-wider text-accent-600 transition hover:bg-accent-600 hover:text-white"
        >
          Reset
        </button>
      </div>

      <div className="mb-5 flex flex-col gap-2">
        <label htmlFor="category" className={labelClass}>Category</label>
        <select
          id="category"
          name="category"
          value={filters.category || ""}
          onChange={handleChange}
          className={`${fieldClass} cursor-pointer`}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => {
            const catId = typeof cat === "object" ? cat.slug || cat.id || cat._id : cat;
            const catName = typeof cat === "object" ? cat.name || cat.title || cat.slug : cat;
            return (
              <option key={catId} value={catId}>{catName}</option>
            );
          })}
        </select>
      </div>

      <div className="mb-5 flex flex-col gap-2">
        <label htmlFor="minPrice" className={labelClass}>Min Price (₹)</label>
        <input
          id="minPrice"
          type="number"
          name="minPrice"
          min="0"
          placeholder="e.g. 1000"
          value={filters.minPrice || ""}
          onChange={handleChange}
          className={fieldClass}
        />
      </div>

      <div className="mb-5 flex flex-col gap-2">
        <label htmlFor="maxPrice" className={labelClass}>Max Price (₹)</label>
        <input
          id="maxPrice"
          type="number"
          name="maxPrice"
          min="0"
          placeholder="e.g. 40000"
          value={filters.maxPrice || ""}
          onChange={handleChange}
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="minRating" className={labelClass}>Minimum Rating</label>
        <select
          id="minRating"
          name="minRating"
          value={filters.minRating || ""}
          onChange={handleChange}
          className={`${fieldClass} cursor-pointer`}
        >
          <option value="">All Ratings</option>
          <option value="4">4★ & above</option>
          <option value="3">3★ & above</option>
          <option value="2">2★ & above</option>
        </select>
      </div>
    </aside>
  );
}

export default ProductFilters;
