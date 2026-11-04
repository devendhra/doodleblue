import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CART_EVENT, clearCart, getCartCount } from "../utils/cart";
import logoMark from "../assests/logowithoutname.svg";

// Sticky site header: Sporty Logo, ordered navigation, live search, cart with badge,
// and user authentication state. Designed with massive energetic sports styling.

const navLinkClass =
  "relative py-2.5 text-sm font-bold uppercase tracking-wider text-gray-700 no-underline transition duration-150 ease-out hover:text-accent-600 " +
  "after:absolute after:bottom-[3px] after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-accent-600 " +
  "after:transition-[width] after:duration-150 after:ease-out hover:after:w-full";

const authButtonClass =
  "inline-flex min-h-[42px] items-center justify-center rounded-xl bg-accent-600 px-5 text-[13px] font-black uppercase tracking-wider text-white shadow-md shadow-accent-600/20 no-underline transition duration-150 ease-out hover:-translate-y-0.5 hover:brightness-110";

const mobileLinkClass =
  "flex min-h-[48px] items-center rounded-lg px-4 py-3 text-sm font-bold uppercase tracking-wider text-gray-800 no-underline transition duration-150 ease-out hover:bg-accent-50 hover:text-accent-600";

function Header() {
  const [searchText, setSearchText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(getCartCount);
  const navigate = useNavigate();

  useEffect(() => {
    const refresh = () => setCartCount(getCartCount());
    window.addEventListener(CART_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CART_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;
  const badgeCount = user ? cartCount : 0;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    clearCart();
    setMenuOpen(false);
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchText.trim())}`);
      setMenuOpen(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-[1000] w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between gap-3 px-[4%] lg:min-h-[86px] lg:gap-8 lg:px-[6%]">

        {/* Sporty Logo */}
        <Link
          to="/"
          className="group/logo inline-flex shrink-0 items-center gap-2 text-gray-900 no-underline"
          aria-label="Prolane home"
          onClick={closeMenu}
        >
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center transition duration-300 ease-out group-hover/logo:scale-105 group-hover/logo:rotate-6">
            <img src={logoMark} alt="" className="h-14 w-14 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="whitespace-nowrap font-heading text-[24px] font-black tracking-tight sm:text-[28px] leading-none text-gray-950">
              PRO<span className="text-accent-600">LANE</span>
              <span className="text-accent-600">.</span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 mt-0.5">
              Elite Athletics
            </span>
          </div>
        </Link>

        {/* Ordered Desktop Navigation */}
        <nav
          className="hidden items-center justify-center gap-6 min-[851px]:flex lg:gap-8"
          aria-label="Main navigation"
        >
          <Link to="/" className={navLinkClass}>
            Home
          </Link>
          <Link to="/products" className={navLinkClass}>
            Shop Gear
          </Link>
          {user && (
            <Link to="/orders" className={navLinkClass}>
              My Orders
            </Link>
          )}
        </nav>

        {/* Live Search Bar (Desktop) */}
        <form
          className="hidden h-12 w-full min-w-[180px] max-w-[320px] flex-1 items-center gap-2.5 rounded-2xl border border-gray-200 bg-gray-50/80 px-4 transition duration-200 ease-out focus-within:border-accent-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-accent-600/15 min-[851px]:flex"
          onSubmit={handleSearch}
          role="search"
        >
          <button
            type="submit"
            className="flex shrink-0 items-center justify-center text-gray-400 hover:text-accent-600 transition"
            aria-label="Search products"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
          </button>
          <input
            type="search"
            placeholder="Search cricket, football, fitness..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            aria-label="Search sports products"
            className="w-full min-w-0 bg-transparent text-[13px] font-medium text-gray-900 outline-none placeholder:text-gray-400"
          />
        </form>

        {/* Cart & Auth Controls */}
        <div className="flex items-center gap-3.5 ml-auto min-[851px]:ml-0">
          <Link
            to="/cart"
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-800 no-underline transition duration-200 ease-out hover:-translate-y-0.5 hover:border-accent-600 hover:bg-accent-600 hover:text-white shadow-sm"
            aria-label={`Shopping cart, ${badgeCount} items`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 8H6" />
              <circle cx="10" cy="21" r="1.2" />
              <circle cx="19" cy="21" r="1.2" />
            </svg>
            {badgeCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-600 px-1 text-[11px] font-black text-white shadow-md animate-bounce">
                {badgeCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden sm:flex shrink-0 items-center gap-3 pl-2 border-l border-gray-200">
              <div className="flex flex-col text-right">
                <span className="text-[11px] font-black uppercase text-gray-400 tracking-wider">Athlete</span>
                <span className="max-w-[120px] truncate text-xs font-bold text-gray-800">{user.name}</span>
              </div>
              <button
                type="button"
                className={authButtonClass}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex shrink-0 items-center gap-3">
              <Link to="/login" className={`${navLinkClass} text-xs`}>
                Log in
              </Link>
              <Link to="/signup" className={authButtonClass}>
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-900 transition duration-200 ease-out hover:border-accent-600 hover:bg-accent-50 min-[851px]:hidden shadow-sm"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="m18 6-12 12M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div
          className="flex flex-col gap-1.5 border-t border-gray-100 bg-white px-5 pb-8 pt-4 shadow-xl min-[851px]:hidden animate-fade-up"
          id="mobile-navigation"
        >
          <Link to="/" onClick={closeMenu} className={mobileLinkClass}>
            Home
          </Link>
          <Link to="/products" onClick={closeMenu} className={mobileLinkClass}>
            Shop All Gear
          </Link>
          <Link to="/products?category=fitness" onClick={closeMenu} className={mobileLinkClass}>
            Fitness & Gym
          </Link>
          <Link to="/products?category=cricket" onClick={closeMenu} className={mobileLinkClass}>
            Cricket Equipment
          </Link>

          <form onSubmit={handleSearch} className="my-3 flex items-center gap-2">
            <input
              type="search"
              placeholder="Search gear..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              aria-label="Search sports products"
              className="h-12 w-full min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-900 outline-none focus:border-accent-600 focus:bg-white focus:ring-4 focus:ring-accent-600/15"
            />
            <button
              type="submit"
              className="h-12 rounded-xl bg-accent-600 px-5 text-xs font-black uppercase text-white shadow-md shadow-accent-600/20 transition hover:brightness-110"
            >
              Search
            </button>
          </form>

          <Link to="/cart" onClick={closeMenu} className={mobileLinkClass}>
            Shopping Cart ({badgeCount})
          </Link>

          {user && (
            <Link to="/orders" onClick={closeMenu} className={mobileLinkClass}>
              My Orders
            </Link>
          )}

          <div className="mt-2 pt-3 border-t border-gray-100 flex flex-col gap-2.5">
            {user ? (
              <button
                type="button"
                className="flex min-h-[48px] items-center justify-center rounded-xl bg-danger-50 px-4 text-xs font-black uppercase tracking-wider text-danger-700 transition hover:bg-danger-100"
                onClick={handleLogout}
              >
                Logout ({user.name})
              </button>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu} className="flex min-h-[48px] items-center justify-center rounded-xl border border-gray-300 text-xs font-black uppercase tracking-wider text-gray-800">
                  Log in
                </Link>
                <Link to="/signup" onClick={closeMenu} className="flex min-h-[48px] items-center justify-center rounded-xl bg-accent-600 text-xs font-black uppercase tracking-wider text-white shadow-md">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
