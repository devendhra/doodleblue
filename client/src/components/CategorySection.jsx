import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Cricket",
    slug: "cricket",
    description: "Professional bats, protective gear & balls.",
    icon: "🏏",
    gradient: "from-amber-500/10 via-amber-500/5 to-white",
    badge: "Bestseller",
  },
  {
    id: 2,
    name: "Football",
    slug: "football",
    description: "Match balls, cleats & training wear.",
    icon: "⚽",
    gradient: "from-blue-500/10 via-blue-500/5 to-white",
    badge: "Pro Grade",
  },
  {
    id: 3,
    name: "Fitness",
    slug: "fitness",
    description: "Dumbbells, resistance bands & active gear.",
    icon: "🏋️",
    gradient: "from-orange-500/10 via-orange-500/5 to-white",
    badge: "High Energy",
  },
  {
    id: 4,
    name: "Basketball",
    slug: "basketball",
    description: "Indoor/outdoor balls & court equipment.",
    icon: "🏀",
    gradient: "from-rose-500/10 via-rose-500/5 to-white",
    badge: "Court Ready",
  },
];

function CategorySection() {
  return (
    <section className="overflow-hidden bg-gray-50 px-[6%] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 max-sm:flex-col max-sm:items-start sm:mb-12">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent-50 px-3.5 py-1.5 text-xs font-black tracking-widest text-accent-600 uppercase">
              <span>⚡</span> FIND YOUR DISCIPLINE
            </div>
            <h2 className="m-0 font-heading text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Shop by <span className="text-accent-600">Sport</span>.
            </h2>
            <p className="mt-3 max-w-[450px] text-sm leading-relaxed text-gray-500 sm:text-base font-medium">
              Equip yourself with professional sports gear engineered for peak performance and durability.
            </p>
          </div>

          <Link
            to="/products"
            className="group inline-flex items-center gap-2.5 whitespace-nowrap rounded-xl border border-gray-300 bg-white px-5 py-3 text-xs font-black uppercase tracking-wider text-gray-900 no-underline shadow-sm transition duration-150 ease-out hover:border-accent-600 hover:bg-accent-600 hover:text-white"
          >
            <span>View All Products</span>
            <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${encodeURIComponent(category.slug)}`}
              className={`group relative isolate flex min-h-[260px] flex-col justify-between overflow-hidden rounded-3xl border border-gray-200/80 bg-gradient-to-br p-6 sm:p-7 text-gray-900 no-underline shadow-sm transition duration-300 ease-out hover:-translate-y-2 hover:border-accent-600/50 hover:shadow-xl ${category.gradient}`}
            >
              <div aria-hidden="true" className="absolute -bottom-16 -right-16 -z-10 h-52 w-52 rounded-full bg-accent-600/5 transition-transform duration-500 group-hover:scale-150" />

              <div className="flex items-start justify-between gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-md shadow-gray-200 transition duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  {category.icon}
                </span>
                <span className="rounded-full bg-white/80 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-wider text-accent-600 border border-accent-600/20 shadow-sm">
                  {category.badge}
                </span>
              </div>

              <div className="mt-8">
                <h3 className="m-0 mb-2 font-heading text-2xl font-black tracking-tight text-gray-900 group-hover:text-accent-600 transition">
                  {category.name}
                </h3>
                <p className="m-0 text-xs sm:text-sm leading-relaxed text-gray-500 font-medium">
                  {category.description}
                </p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-accent-600 group-hover:translate-x-1 transition duration-200">
                  Explore Gear →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;