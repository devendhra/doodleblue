// protect - middleware for routes that require a logged-in user.
// It reads the "Authorization: Bearer <token>" header, verifies the JWT,
// loads the user from the database and attaches it to req.user.
// Controllers after this middleware can safely use req.user._id / .role.

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  // The header must look like: Authorization: Bearer eyJhbGciOi...
  if (!header || !header.startsWith("Bearer ")) {
    throw new ApiError(401, "Not authorized, no token");
  }

  const token = header.split(" ")[1];

  // Throws JsonWebTokenError / TokenExpiredError if bad or expired.
  // Our errorHandler middleware turns those into a 401 response.
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // The token can still be valid even if the user was deleted meanwhile,
  // so we confirm the user really exists.
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, "Not authorized, user no longer exists");
  }

  req.user = user; // available in every controller that runs next
  next();
});

export default protect;
