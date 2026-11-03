
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { getProducts, getCategories } from "../redux/productsSlice";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductFilters from "../components/ProductFilters";
import ProductSort from "../components/ProductSort";
import ProductGrid from "../components/ProductGrid";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";

import "./ProductsPage.css";

const PRODUCTS_PER_PAGE = 12;

function ProductsPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  // Redux State
  const {
    products,
    categories,
    loading,
    categoriesLoading,
    error,
    pagination,
    categoriesError,
  } = useSelector((state) => state.products);

  // Search from URL
  const searchText = searchParams.get("q") || "";

  // Filters
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
  });

  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch categories
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchText,
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.minRating,
    sortBy,
  ]);

  // Fetch Products
  useEffect(() => {
    const params = {
      q: searchText,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minRating: filters.minRating,
      sort: sortBy,
      page: currentPage,
      limit: PRODUCTS_PER_PAGE,
      skip: (currentPage - 1) * PRODUCTS_PER_PAGE,
    };

    // Remove empty parameters
    Object.keys(params).forEach((key) => {
      if (params[key] === "") {
        delete params[key];
      }
    });

    dispatch(getProducts(params));
  }, [
    dispatch,
    searchText,
    filters,
    sortBy,
    currentPage,
  ]);

  // Filter Change
  const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
  };

  // Reset Filters
  const resetFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
    });

    setSortBy("featured");
    setCurrentPage(1);
  };

  // Sorting
  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  // Pagination
  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) {
      return;
    }

    setCurrentPage(page);

    // Scroll back to products section
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Retry API request
  const handleRetry = () => {
    const params = {
      q: searchText,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minRating: filters.minRating,
      sort: sortBy,
      page: currentPage,
      limit: PRODUCTS_PER_PAGE,
      skip: (currentPage - 1) * PRODUCTS_PER_PAGE,
    };

    Object.keys(params).forEach((key) => {
      if (params[key] === "") {
        delete params[key];
      }
    });

    dispatch(getProducts(params));
  };

  return (
    <>
      <Header />

      <main className="products-page">
        {/* Page Header */}
        <section className="products-page-header">
          <div className="products-page-heading">
            <span className="products-eyebrow">
              BUILT FOR EVERY MOVE
            </span>

            <h1>
              Shop Sports <span>Gear</span>
            </h1>

            <p>
              Find your edge. Explore sports essentials
              made for your next big performance.
            </p>
          </div>
        </section>

        {/* Products Section */}
        <section className="products-main container-custom">
          {/* Search Heading */}
          {searchText && (
            <div className="products-search-info">
              <p>
                Search results for{" "}
                <strong>"{searchText}"</strong>
              </p>
            </div>
          )}

          {/* Category Loading/Error */}
          {categoriesLoading && (
            <p className="products-category-message">
              Loading categories...
            </p>
          )}

          {!categoriesLoading && categoriesError && (
            <p className="products-category-error" role="status">
              Categories could not be loaded.
              Product browsing is still available.
            </p>
          )}

          <div className="products-layout">
            {/* Sidebar */}
            <aside className="products-sidebar">
              <ProductFilters
                categories={categories}
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={resetFilters}
              />
            </aside>

            {/* Products Content */}
            <div className="products-content">
              {/* Sorting */}
              <ProductSort
                sortBy={sortBy}
                onSortChange={handleSortChange}
                totalProducts={pagination.total}
              />

              {/* Loading */}
              {loading && (
                <Loader message="Finding your sports gear..." />
              )}

              {/* Error */}
              {!loading && error && (
                <div className="products-error">
                  <div className="products-error-icon">⚠️</div>

                  <h3>Oops! Something went wrong.</h3>

                  <p>{error}</p>

                  <button
                    type="button"
                    className="products-retry-button"
                    onClick={handleRetry}
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Products */}
              {!loading && !error && (
                <>
                  <ProductGrid
                    products={products}
                  />

                  <Pagination
                    currentPage={pagination.page || currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default ProductsPage;
