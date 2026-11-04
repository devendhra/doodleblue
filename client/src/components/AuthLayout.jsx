import { Link } from "react-router-dom";

// Shared shell for Login and Signup. Loads a high-energy dynamic sports
// image (`auth-bg.jpg`) directly from the project's public folder.

const PERKS = [
  "⚡ Free shipping on orders over ₹4,400",
  "🛡️ Easy 7-day hassle-free returns",
  "⭐ Trusted by 50k+ elite athletes",
];

function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2 bg-gray-950">
      {/* Left - Dynamic Project Visual Panel */}
      <div 
        className="relative flex min-h-[360px] flex-col justify-end overflow-hidden lg:min-h-screen lg:justify-center p-8 lg:p-16 bg-gray-900 bg-cover bg-center bg-no-repeat"
        style={{
          // References `public/auth-bg.jpg` directly.
          backgroundImage: `linear-gradient(to top, rgba(3, 7, 18, 1) 10%, rgba(3, 7, 18, 0.8) 50%, rgba(3, 7, 18, 0.2) 100%), url('/auth-bg.png')`
        }}
      >
        {/* Brand Content */}
        <div className="relative z-10 flex flex-col gap-6 max-w-[480px]">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-accent-500/40 bg-accent-500/20 px-4 py-2 w-fit backdrop-blur-md">
            <span className="h-2.5 w-2.5 rounded-full bg-accent-500 ring-4 ring-accent-500/20 animate-ping" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-accent-400">
              Prolane Pro Athletics
            </span>
          </div>

          <h1 className="font-heading text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl">
            GEAR UP.<br />
            <span className="text-accent-500 underline decoration-accent-500/30 decoration-wavy">
              PLAY HARDER.
            </span>
          </h1>

          <p className="text-sm leading-relaxed text-gray-300 font-medium sm:text-base">
            Join thousands of competitors and elite athletes shopping professional-grade equipment on Prolane.
          </p>

          <ul className="flex flex-col gap-3 text-sm font-bold text-white/95 pt-2">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-accent-600 text-white text-xs shadow-lg shadow-accent-600/30">
                  ✓
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right - Modern Form Card Panel */}
      <div className="flex flex-col items-center justify-center bg-white px-6 py-12 lg:px-12 lg:py-16">
        <div className="w-full max-w-[460px]">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 transition duration-150 hover:text-accent-600"
          >
            ← Back to Home
          </Link>

          <div className="rounded-3xl border border-gray-200/80 bg-white p-8 shadow-2xl shadow-gray-200/50 sm:p-10">
            <h2 className="mb-2 font-heading text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
              {title}
            </h2>
            <p className="mb-7 text-sm leading-relaxed text-gray-500 font-medium">
              {subtitle}
            </p>

            {children}
          </div>

          {footer && (
            <div className="mt-6 text-center text-sm font-semibold text-gray-600">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const fieldClass =
  "w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-4 py-3.5 text-sm font-semibold text-gray-900 outline-none transition duration-150 ease-out placeholder:text-gray-400 placeholder:font-normal hover:border-gray-400 focus:border-accent-600 focus:bg-white focus:ring-4 focus:ring-accent-600/15";
export const labelClass = "mb-2 block text-xs font-black uppercase tracking-wider text-gray-700";
export const errorClass = "mt-1.5 text-xs font-bold text-danger-700";
export const submitClass =
  "mt-2 flex h-[52px] w-full items-center justify-center rounded-2xl bg-accent-600 font-heading text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-accent-600/30 transition duration-150 ease-out hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60";

export default AuthLayout;