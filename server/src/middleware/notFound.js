// notFound - runs when no route matched the request URL.
// Mounted after all routes in app.js, so it only sees "unknown" URLs.

const notFound = (req, res) => {
  res.status(404).json({ message: "Route not found" });
};

export default notFound;
