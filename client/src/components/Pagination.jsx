
import "./Pagination.css";

function Pagination({ currentPage, totalPages, onPageChange }) {
  // No pagination needed for one or fewer pages
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  // Generate visible page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(
      totalPages,
      startPage + maxVisiblePages - 1
    );

    // Adjust starting page near the end
    startPage = Math.max(
      1,
      endPage - maxVisiblePages + 1
    );

    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="pagination" aria-label="Product pages">
      {/* Previous Button */}
      <button
        type="button"
        className="pagination-button pagination-prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        ← <span>Previous</span>
      </button>

      {/* Numbered Buttons */}
      <div className="pagination-numbers">
        {pageNumbers.map((page) => (
          <button
            key={page}
            type="button"
            className={`pagination-button pagination-number ${
              currentPage === page ? "active" : ""
            }`}
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? "page" : undefined}
            aria-label={`Go to page ${page}`}
            disabled={currentPage === page}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        type="button"
        className="pagination-button pagination-next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        <span>Next</span> →
      </button>
    </nav>
  );
}

export default Pagination;
