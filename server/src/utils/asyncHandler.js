// asyncHandler - wraps async route handlers so we don't need try/catch
// in every controller. If the async function throws, the error is passed
// to next() which forwards it to our central errorHandler middleware.
//
// Usage:  router.get("/x", asyncHandler(async (req, res) => { ... }))

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
