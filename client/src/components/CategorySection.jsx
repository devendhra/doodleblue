
import { Link } from "react-router-dom";

import "./CategorySection.css";

const categories = [
  {
    id: 1,
    name: "Cricket",
    slug: "cricket",
    description: "Gear up for every innings.",
    icon: "🏏",
    className: "category-cricket",
  },
  {
    id: 2,
    name: "Football",
    slug: "football",
    description: "Own every moment.",
    icon: "⚽",
    className: "category-football",
  },
  {
    id: 3,
    name: "Fitness",
    slug: "fitness",
    description: "Train beyond limits.",
    icon: "🏋️",
    className: "category-fitness",
  },
  {
    id: 4,
    name: "Basketball",
    slug: "basketball",
    description: "Take your game higher.",
    icon: "🏀",
    className: "category-basketball",
  },
];

function CategorySection() {
  return (
    <section className="category-section">
      <div className="category-container">

        {/* Section Heading */}
        <div className="category-header">
          <div>
            <span className="category-eyebrow">
              FIND YOUR GAME
            </span>

            <h2 className="category-heading">
              Shop by sport<span>.</span>
            </h2>

            <p className="category-subtitle">
              Everything you need for your
              next big performance.
            </p>
          </div>

          <Link
            to="/products"
            className="category-view-all"
          >
            View all products
            <span aria-hidden="true"> ↗</span>
          </Link>
        </div>

        
{/* Category Cards */}
<div className="category-grid">
  {categories.map((category) => (
    <Link
      key={category.id}
      to={`/products?category=${encodeURIComponent(category.slug)}`}
      className={`category-card ${category.className}`}
    >
      <div className="category-card-top">
        <span className="category-card-icon">
          {category.icon}
        </span>

        <span className="category-card-arrow" aria-hidden="true">
          ↗
        </span>
      </div>

      <div className="category-card-content">
        <h3>{category.name}</h3>
        <p>{category.description}</p>
      </div>
    </Link>
  ))}
</div>

      </div>
    </section>
  );
}

export default CategorySection;
