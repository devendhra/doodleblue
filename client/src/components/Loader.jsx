
import "./Loader.css";

function Loader({ message = "Loading products..." }) {
  return (
    <div
      className="loader-container"
      role="status"
      aria-live="polite"
    >
      <div className="loader-spinner" aria-hidden="true"></div>

      <p className="loader-message">{message}</p>

      <span className="loader-sr-only">
        Please wait. {message}
      </span>
    </div>
  );
}

export default Loader;
