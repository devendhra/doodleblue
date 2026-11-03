
import "./ProductFilters.css";

function ProductFilters({
  categories = [],
  filters,
  onFilterChange,
  onReset,
}) {
  const handleChange = (event) => {
    const { name, value } = event.target;

    onFilterChange({
      ...filters,
      [name]: value,
    });
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <aside className="product-filters">
      <div className="filters-header">
        <div>
          <span className="filters-eyebrow">REFINE YOUR SEARCH</span>
          <h3>Filters</h3>
        </div>

        <button
          type="button"
          className="filters-reset-button"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      {/* Category Filter */}
      <div className="filter-group">
        <label htmlFor="category">Category</label>

        <select
          id="category"
          name="category"
          value={filters.category || ""}
          onChange={handleChange}
        >
          <option value="">All Categories</option>

          {categories.map((category) => {
            const categoryId =
              typeof category === "object"
                ? category.slug || category.id || category._id
                : category;

            const categoryName =
              typeof category === "object"
                ? category.name || category.title || category.slug
                : category;

            return (
              <option key={categoryId} value={categoryId}>
                {categoryName}
              </option>
            );
          })}
        </select>
      </div>

      {/* Minimum Price */}
      <div className="filter-group">
        <label htmlFor="minPrice">Minimum Price (₹)</label>

        <input
          id="minPrice"
          type="number"
          name="minPrice"
          min="0"
          placeholder="e.g. 500"
          value={filters.minPrice || ""}
          onChange={handleChange}
        />
      </div>

      {/* Maximum Price */}
      <div className="filter-group">
        <label htmlFor="maxPrice">Maximum Price (₹)</label>

        <input
          id="maxPrice"
          type="number"
          name="maxPrice"
          min="0"
          placeholder="e.g. 5000"
          value={filters.maxPrice || ""}
          onChange={handleChange}
        />
      </div>

      {/* Minimum Rating */}
      <div className="filter-group">
        <label htmlFor="minRating">Minimum Rating</label>

        <select
          id="minRating"
          name="minRating"
          value={filters.minRating || ""}
          onChange={handleChange}
        >
          <option value="">All Ratings</option>
          <option value="4">4★ & above</option>
          <option value="3">3★ & above</option>
          <option value="2">2★ & above</option>
          <option value="1">1★ & above</option>
        </select>
      </div>
    </aside>
  );
}

export default ProductFilters;
