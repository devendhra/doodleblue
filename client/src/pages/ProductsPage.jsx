import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";

import { getProducts, getCategories } from "../redux/productsSlice";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductFilters from "../components/ProductFilters";
import ProductSort from "../components/ProductSort";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";

const PRODUCTS_PER_PAGE = 12;

function ProductsPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const {
    products,
    categories,
    loading,
    error,
    pagination,
  } = useSelector((state) => state.products);

  const searchText = searchParams.get("q") || "";

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
  });

  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

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

    Object.keys(params).forEach((key) => {
      if (params[key] === "") {
        delete params[key];
      }
    });

    dispatch(getProducts(params));
  }, [dispatch, searchText, filters, sortBy, currentPage]);

  const handleFilterChange = (updatedFilters) => setFilters(updatedFilters);

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

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
      if (params[key] === "") delete params[key];
    });
    dispatch(getProducts(params));
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 text-gray-900">
        {/* Page Hero Header */}
        <section className="relative mb-8 w-full overflow-hidden bg-gray-950 px-4 py-16 text-center sm:py-20 lg:px-6 lg:py-24">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-accent-600/20 blur-[100px] pointer-events-none" />

          <div className="relative z-[1] mx-auto max-w-[800px]">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-500/40 bg-accent-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-accent-400">
              ⚡ PROFESSIONAL CATALOG
            </span>
            <h1 className="m-0 font-heading text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Shop Sports <span className="text-accent-600">Gear</span>
            </h1>
            <p className="mx-auto mt-4 max-w-[540px] text-sm leading-relaxed text-gray-300 sm:text-base font-medium">
              Browse our complete inventory of professional-grade athletic equipment, footwear, and training gear.
            </p>
          </div>
        </section>

        {/* Catalog Section */}
        <div className="mx-auto max-w-[1440px] px-[4%] pb-20 lg:px-[6%]">
          {searchText && (
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
              <p className="m-0 text-sm text-gray-600 font-medium">
                Search results for <strong className="font-black text-gray-900">"{searchText}"</strong>
              </p>
            </div>
          )}

          <div className="grid items-start gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
            {/* Filters Sidebar */}
            <aside className="w-full">
              <ProductFilters
                categories={categories}
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={resetFilters}
              />
            </aside>

            {/* Products Main Content */}
            <div className="flex min-w-0 flex-col">
              <ProductSort
                sortBy={sortBy}
                onSortChange={handleSortChange}
                totalProducts={pagination.total}
              />

              {loading && <Loader message="Finding sports gear..." />}

              {!loading && error && (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-danger-200 bg-danger-50 p-10 text-center">
                  <h3 className="m-0 mb-2 font-heading text-xl font-bold text-gray-900">
                    Failed to load products
                  </h3>
                  <p className="m-0 mb-6 text-sm text-gray-600">{error}</p>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="rounded-xl bg-accent-600 px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md hover:brightness-110"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {!loading && !error && (
                <>
                  {products.length === 0 ? (
                    <div className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
                      <div className="mb-4 text-4xl">🏃</div>
                      <h3 className="font-heading text-xl font-black text-gray-900">No products found</h3>
                      <p className="mt-2 text-sm text-gray-500 font-medium">Try changing your filters or search query.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {products.map((product) => (
                        <ProductCard key={product.id || product._id} product={product} />
                      ))}
                    </div>
                  )}

                  <Pagination
                    currentPage={pagination.page || currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default ProductsPage;