
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getProducts } from "../redux/productsSlice";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import ProductGrid from "../components/ProductGrid";
import Loader from "../components/Loader";

import "./LandingPage.css";

function LandingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get product data from Redux
  const {
    products,
    loading,
    error,
  } = useSelector((state) => state.products);

  // Fetch featured products
  useEffect(() => {
    dispatch(
      getProducts({
        sort: "featured",
        page: 1,
        limit: 8,
        skip: 0,
      })
    );
  }, [dispatch]);

  // Navigate to all products
  const handleShopNow = () => {
    navigate("/products");
  };

  const handleRetry = () => {
    dispatch(
      getProducts({
        sort: "featured",
        page: 1,
        limit: 8,
        skip: 0,
      })
    );
  };

  return (
    <>
      <Header />

      <main className="landing-page">
        {/* Hero Section */}
        <Hero />

        {/* Sports Categories */}
        <CategorySection />

        {/* Featured Products */}
        <section className="landing-featured-section">
          <div className="container-custom">

            {/* Section Heading */}
            <div className="landing-section-header">
              <div className="landing-section-heading">
                <span className="landing-eyebrow">
                  YOUR GAME. YOUR GEAR.
                </span>

                <h2>
                  Featured <span>Products</span>
                </h2>

                <p>
                  Gear up with sports essentials picked
                  for your next performance.
                </p>
              </div>

              <button
                type="button"
                className="landing-view-all-button"
                onClick={handleShopNow}
              >
                View All Products
                <span aria-hidden="true">→</span>
              </button>
            </div>

            {/* Loading */}
            {loading && (
              <Loader message="Finding your best gear..." />
            )}

            {/* Error */}
            {!loading && error && (
              <div className="landing-products-error">
                <h3>Products are temporarily unavailable</h3>

                <p>
                  We couldn't load our featured sports gear.
                  Please try again.
                </p>

                <button
                  type="button"
                  className="landing-retry-button"
                  onClick={handleRetry}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Featured Product Grid */}
            {!loading && !error && (
              <ProductGrid products={products} />
            )}

            {/* Bottom CTA */}
            <div className="landing-bottom-cta">
              <div>
                <span className="landing-cta-eyebrow">
                  READY TO PLAY?
                </span>

                <h3>
                  Your next personal best starts here.
                </h3>

                <p>
                  Explore the gear that keeps you moving.
                </p>
              </div>

              <button
                type="button"
                className="landing-cta-button"
                onClick={handleShopNow}
              >
                Explore All Gear
                <span aria-hidden="true">→</span>
              </button>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default LandingPage;
