// src/components/Marquee.jsx
const DEFAULT_ITEMS = [
  "🏏 CRICKET", "⚽ FOOTBALL", "🏸 BADMINTON", "🏃 RUNNING",
  "🚚 FREE SHIPPING OVER ₹499", "⚡ UP TO 20% OFF", "🛡️ SECURE CHECKOUT"
];

function Marquee({ items = DEFAULT_ITEMS, variant = "primary", speed = 28 }) {
  const row = [...items, ...items];
  const band = variant === "accent" ? "bg-accent-600 text-white" : "bg-gray-950 text-white";

  return (
    <div className={`group/mq overflow-hidden py-3.5 shadow-md ${band}`} aria-hidden="true">
      <div className="flex w-max animate-marquee items-center group-hover/mq:[animation-play-state:paused]" style={{ animationDuration: `${speed}s` }}>
        {row.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 whitespace-nowrap px-8 font-heading text-xs font-black tracking-[0.2em] uppercase">
            <span>⚡</span> {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Marquee;