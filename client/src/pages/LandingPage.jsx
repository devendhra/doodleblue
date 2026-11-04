import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchProducts } from "../services/api";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import CategorySection from "../components/CategorySection";
import ProductGrid from "../components/ProductGrid";
import Loader from "../components/Loader";

const FEATURED_CATEGORIES = ["cricket", "basketball", "swimming", "football"];
function LandingPage() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await Promise.all(
        FEATURED_CATEGORIES.map(async (category) => {
          const response = await fetchProducts({ category, sort: "featured", limit: 1 });
          const products = Array.isArray(response) ? response : response.products || [];
          return products[0];
        })
      );
      setFeaturedProducts(results.filter(Boolean));
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleShopNow = () => navigate("/products");

  const handleRetry = () => {
    loadFeaturedProducts();
  };

  return (
    <>
      <Header />

      <main className="min-h-screen overflow-clip bg-white text-gray-900">
        <Hero />

        <Marquee
          variant="primary"
          items={[
            "🏏 CRICKET GEAR",
            "⚽ FOOTBALL EQUIPMENT",
            "🏸 BADMINTON",
            "🏋️ FITNESS & GYM",
            "🏃 RUNNING ESSENTIALS",
            "🚚 FREE SHIPPING OVER ₹499",
            "⚡ USE CODE SAVE10 FOR 10% OFF",
          ]}
        />

        <CategorySection />

        {/* Featured Products */}
        <section className="bg-white py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-[5%] lg:px-[6%]">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6 max-md:flex-col max-md:items-start sm:mb-12">
              <div className="max-w-[650px]">
                <span className="mb-3 inline-block rounded-full bg-accent-50 px-3.5 py-1.5 text-xs font-black tracking-widest text-accent-600 uppercase">
                  ⚡ CURATED EXCELLENCE
                </span>
                <h2 className="m-0 mb-3 font-heading text-3xl font-black leading-tight tracking-tight text-gray-900 lg:text-5xl">
                  Featured <span className="text-accent-600">Products</span>
                </h2>
                <p className="m-0 text-sm leading-relaxed text-gray-500 sm:text-base font-medium">
                  Top-rated sports gear handpicked for your next performance milestone.
                </p>
              </div>

              <button
                type="button"
                onClick={handleShopNow}
                className="group inline-flex min-h-[48px] items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-6 text-xs font-black uppercase tracking-wider text-gray-900 shadow-sm transition duration-150 hover:border-accent-600 hover:bg-accent-600 hover:text-white max-[480px]:w-full"
              >
                <span>View All Products</span>
                <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1">→</span>
              </button>
            </div>

            {loading && <Loader message="Loading elite gear..." />}

            {!loading && error && (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-3xl border border-danger-200 bg-danger-50 p-8 text-center">
                <h3 className="m-0 mb-2 font-heading text-xl font-bold text-gray-900">
                  Products are temporarily unavailable
                </h3>
                <p className="m-0 mb-6 text-sm text-gray-600 font-medium">{error}</p>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="rounded-xl bg-accent-600 px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md hover:brightness-110"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && <ProductGrid products={featuredProducts} />}

            {/* Bottom Call to Action Banner */}
            <div className="relative isolate mt-16 flex flex-col items-start justify-between gap-8 overflow-hidden rounded-3xl bg-gray-950 px-8 py-10 shadow-2xl sm:px-12 sm:py-14 lg:mt-24 lg:flex-row lg:items-center">
              <div className="absolute -top-32 right-10 -z-10 h-72 w-72 rounded-full bg-accent-600/30 blur-3xl pointer-events-none" />

              <div>
                <span className="mb-3 inline-block rounded-full bg-accent-500/20 px-3.5 py-1.5 text-xs font-black tracking-widest text-accent-400 uppercase">
                  ⚡ READY TO COMPETE?
                </span>
                <h3 className="m-0 mb-3 max-w-[600px] font-heading text-3xl font-black leading-tight text-white lg:text-4xl">
                  Your next personal record starts right here.
                </h3>
                <p className="m-0 text-sm text-gray-300 font-medium">
                  Explore professional equipment designed to give you the competitive edge.
                </p>
              </div>

              <button
                type="button"
                onClick={handleShopNow}
                className="group inline-flex min-h-[52px] shrink-0 items-center justify-center gap-3 rounded-2xl bg-accent-600 px-8 text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-accent-600/30 transition hover:brightness-110 max-sm:w-full"
              >
                <span>Explore All Gear</span>
                <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>
        </section>

        <Marquee
          variant="accent"
          speed={32}
          items={[
            "⚡ USE CODE SAVE10 FOR 10% OFF",
            "🔥 NEW ARRIVALS EVERY WEEK",
            "🛡️ SECURE CHECKOUT & FAST SHIPPING",
            "⭐ 5-STAR RATED ATHLETE GEAR",
          ]}
        />
      </main>

      <Footer />
    </>
  );
}

export default LandingPage;
