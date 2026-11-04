// src/components/Loader.jsx
function Loader({ message = "Loading professional gear..." }) {
  return (
    <div className="flex min-h-[300px] w-full flex-col items-center justify-center gap-4 bg-white rounded-3xl border border-gray-200/80 p-12 text-center shadow-xl" role="status" aria-live="polite">
      <div className="h-12 w-12 rounded-full border-4 border-accent-100 border-t-accent-600 animate-spin" />
      <p className="text-sm font-black uppercase tracking-wider text-gray-700">{message}</p>
    </div>
  );
}

export default Loader;