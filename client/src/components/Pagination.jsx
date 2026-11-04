// src/components/Pagination.jsx
const buttonBase =
  "inline-flex h-11 min-w-11 select-none items-center justify-center gap-1.5 rounded-2xl border border-gray-200 bg-white px-3.5 text-xs font-black uppercase tracking-wider text-gray-700 transition duration-150 " +
  "enabled:hover:-translate-y-0.5 enabled:hover:border-accent-600 enabled:hover:bg-accent-50 enabled:hover:text-accent-600 " +
  "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400";

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  startPage = Math.max(1, endPage - maxVisiblePages + 1);

  const pageNumbers = [];
  for (let page = startPage; page <= endPage; page++) {
    pageNumbers.push(page);
  }

  return (
    <nav className="flex w-full flex-wrap items-center justify-center gap-2.5 pb-6 pt-12" aria-label="Product pages">
      <button
        type="button"
        className={buttonBase}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ← Prev
      </button>

      <div className="flex items-center gap-1.5">
        {pageNumbers.map((page) => {
          const isActive = currentPage === page;
          return (
            <button
              key={page}
              type="button"
              className={`${buttonBase} ${
                isActive
                  ? "border-accent-600 bg-accent-600 text-white shadow-lg shadow-accent-600/30"
                  : ""
              }`}
              onClick={() => onPageChange(page)}
              aria-current={isActive ? "page" : undefined}
              disabled={isActive}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className={buttonBase}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  );
}

export default Pagination;