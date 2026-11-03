// errorHandler - the LAST middleware in app.js. Every error thrown or
// passed to next() ends up here and is turned into a clean JSON response
// in our shared shape: { message, errors? }

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Server error";
  let errors; // only filled for Mongoose validation failures

  // Bad ObjectId in a route param like /api/products/abc
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid id";
  }
  // Mongoose schema validation failed (e.g. required field missing)
  else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }
  // Unique index violation, e.g. registering an email that already exists
  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "Value";
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already registered`;
  }
  // Bad or expired JWT token
  else if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    message =
      err.name === "TokenExpiredError"
        ? "Token expired, please log in again"
        : "Not authorized, invalid token";
  }

  // Unexpected bug - log it, but don't leak internals to the client
  if (statusCode === 500) {
    console.error(err);
    if (process.env.NODE_ENV === "production") {
      message = "Server error";
    }
  }

  const body = { message };
  if (errors) body.errors = errors;
  // Stack trace helps debugging in development but must stay hidden in prod
  if (process.env.NODE_ENV !== "production" && statusCode === 500) {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
};

export default errorHandler;
