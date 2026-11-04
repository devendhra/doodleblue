import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Hero slides - the two photos in /public plus the action shot.
// They scroll horizontally, one by one, on a timer.
const SLIDES = [
  { src: "/main1.jpg", alt: "Athletes training with sports equipment" },
  { src: "/main.jpg", alt: "Sports gear arranged for a workout" },
  {
    src: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1400&q=80",
    alt: "Professional sports equipment and training gear",
  },
];

const SLIDE_INTERVAL_MS = 4000;

function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-advance the slides; loops back to the first after the last
  useEffect(() => {
    const timer = setInterval(
      () => setActiveSlide((current) => (current + 1) % SLIDES.length),
      SLIDE_INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-white px-[5%] pb-16 pt-10 sm:pb-20 sm:pt-14 lg:px-[6%] lg:pb-28 lg:pt-20">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-accent-500/10 blur-[120px] pointer-events-none" />

      <div className="mx-auto grid max-w-[1280px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Hero Content */}
        <div className="relative z-[2] max-w-[620px]">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-accent-600/30 bg-accent-50 px-4 py-2 text-xs font-black tracking-widest text-accent-600 uppercase shadow-sm">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent-600 ring-4 ring-accent-600/20 animate-pulse" />
            ELITE SPORTS EQUIPMENT & APPAREL
          </div>

          <h1 className="m-0 font-heading text-5xl font-black leading-[1.05] tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            PLAY HARDER.<br />
            <span className="text-accent-600 underline decoration-accent-500/30 decoration-wavy">GO BEYOND.</span>
          </h1>

          <p className="mb-8 mt-6 max-w-[520px] text-base leading-relaxed text-gray-600 sm:text-lg font-medium">
            From intense training sessions to match-day dominance, discover professional sports gear engineered to maximize your endurance, speed, and peak power.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/products"
              className="group inline-flex min-h-[56px] items-center justify-center gap-3 rounded-2xl bg-accent-600 px-8 text-sm font-black uppercase tracking-wider text-white no-underline shadow-xl shadow-accent-600/30 transition duration-200 ease-out hover:-translate-y-1 hover:brightness-110 active:scale-95"
            >
              <span>Shop Collection</span>
              <span aria-hidden="true" className="text-lg transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>

            <Link
              to="/products?category=fitness"
              className="inline-flex min-h-[56px] items-center justify-center rounded-2xl border-2 border-gray-300 bg-white px-8 text-sm font-black uppercase tracking-wider text-gray-900 no-underline transition duration-200 ease-out hover:-translate-y-1 hover:border-gray-900 hover:bg-gray-50"
            >
              Explore Fitness
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 pt-8 border-t border-gray-200/80">
            <div>
              <p className="font-heading text-2xl font-black text-gray-900">50K+</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Athletes</p>
            </div>
            <div>
              <p className="font-heading text-2xl font-black text-accent-600">100%</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pro Verified</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="font-heading text-2xl font-black text-gray-900">7-Day</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Easy Returns</p>
            </div>
          </div>
        </div>

        {/* Hero Visual Banner */}
        <div className="relative">
          <div className="group relative isolate aspect-[4/3] w-full overflow-hidden rounded-3xl bg-gray-900 shadow-2xl sm:aspect-[16/11] lg:aspect-[5/4]">
            {/* Sliding track - moves left one slide-width at a time */}
            <div
              className="flex h-full w-full transition-transform duration-600 ease-in-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {SLIDES.map((slide) => (
                <img
                  key={slide.src}
                  src={slide.src}
                  alt={slide.alt}
                  className="block h-full w-full shrink-0 object-cover object-center saturate-110"
                />
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />

            {/* Slide indicators - click a dot to jump to that slide */}
            <div className="absolute bottom-5 right-5 z-10 flex items-center gap-1.5">
              {SLIDES.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show image ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeSlide === index
                      ? "w-6 bg-accent-500"
                      : "w-2 bg-white/60 hover:bg-white"
                  }`}
                />
              ))}
            </div>

            {/* Floating Achievement Badge */}
            <div className="absolute bottom-6 left-6 z-10 flex items-center gap-4 rounded-2xl border border-white/20 bg-white/90 p-4 shadow-2xl backdrop-blur-xl">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-600 text-xl font-bold text-white shadow-md">
                🏆
              </span>
              <div>
                <p className="m-0 text-xs font-black tracking-widest text-gray-900 uppercase">
                  CHAMPIONSHIP GRADE
                </p>
                <p className="m-0 mt-0.5 text-xs font-bold text-accent-600">
                  Built for Professional Play
                </p>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -bottom-6 -right-6 -z-10 h-48 w-48 rounded-full bg-accent-500/20 blur-3xl" />
        </div>
      </div>
    </section>
  );
}

export default Hero;