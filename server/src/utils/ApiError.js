// ApiError - a small custom error class.
// Throw it anywhere in a controller like:
//   throw new ApiError(404, "Product not found");
// and the central errorHandler will send that status + message as JSON.

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default ApiError;
