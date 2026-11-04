import { Link } from "react-router-dom";

const linkClass =
  "text-xs font-bold uppercase tracking-wider text-gray-400 no-underline transition duration-150 ease-out hover:translate-x-1 hover:text-white";

function Footer() {
  return (
    <footer className="overflow-hidden bg-gray-950 px-[6%] pb-0 pt-16 text-white sm:pt-20 border-t border-gray-800">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-10 pb-12 lg:grid-cols-[1.5fr_1fr_1fr_1.5fr] lg:gap-12 lg:pb-16">
        {/* Brand Section */}
        <div className="col-span-2 lg:col-span-1">
          <Link to="/" className="mb-5 inline-flex items-center gap-3 text-white no-underline">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-600 font-heading text-xl font-black text-white shadow-lg">
              P
            </div>
            <span className="font-heading text-2xl font-black tracking-tight">
              PRO<span className="text-accent-600">LANE</span>
              <span className="text-accent-600">.</span>
            </span>
          </Link>

          <p className="mb-6 max-w-[300px] text-sm leading-relaxed text-gray-400 font-medium">
            Engineering elite sports equipment and active apparel for athletes who refuse to compromise.
          </p>

          <div className="flex items-center gap-3">
            {[
              ["Instagram", "IG", "https://www.instagram.com/"],
              ["Facebook", "FB", "https://www.facebook.com/"],
              ["YouTube", "YT", "https://www.youtube.com/"],
            ].map(([label, short, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-800 bg-gray-900 text-xs font-black text-gray-300 transition duration-150 hover:-translate-y-1 hover:border-accent-600 hover:bg-accent-600 hover:text-white"
              >
                {short}
              </a>
            ))}
          </div>
        </div>

        {/* Shop Links */}
        <div className="flex flex-col items-start gap-3.5">
          <h3 className="mb-2 font-heading text-xs font-black uppercase tracking-[0.2em] text-accent-500">
            Shop Gear
          </h3>
          <Link to="/products" className={linkClass}>All Products</Link>
          <Link to="/products?category=fitness" className={linkClass}>Fitness & Gym</Link>
          <Link to="/products?category=cricket" className={linkClass}>Cricket</Link>
          <Link to="/products?category=football" className={linkClass}>Football</Link>
        </div>

        {/* Customer Care */}
        <div className="flex flex-col items-start gap-3.5">
          <h3 className="mb-2 font-heading text-xs font-black uppercase tracking-[0.2em] text-accent-500">
            Customer Care
          </h3>
          <Link to="/orders" className={linkClass}>Track Orders</Link>
          <a href="mailto:support@prolane.example" className={linkClass}>Support Center</a>
          <Link to="/cart" className={linkClass}>Shopping Cart</Link>
        </div>

        {/* Brand Mission */}
        <div className="col-span-2 lg:col-span-1">
          <h3 className="mb-2 font-heading text-xs font-black uppercase tracking-[0.2em] text-accent-500">
            Move With Purpose
          </h3>
          <p className="mb-4 max-w-[320px] text-sm leading-relaxed text-gray-400 font-medium">
            Every session counts. Find your gear, set your records, and push beyond your limits.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-accent-500 hover:text-white transition"
          >
            Explore collection →
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 border-t border-gray-900 py-6">
        <p className="m-0 text-xs font-bold text-gray-500">
          © {new Date().getFullYear()} Prolane Athletics. All rights reserved.
        </p>
        <p className="m-0 text-xs font-bold text-accent-500 uppercase tracking-widest">
          ⚡ Built for the love of sport.
        </p>
      </div>
    </footer>
  );
}

export default Footer;