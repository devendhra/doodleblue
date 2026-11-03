// validate - runs after the express-validator checks in a route.
// If any check failed, it sends a 400 response in our shared error shape:
//   { message: "Validation failed", errors: [{ field, message }, ...] }
// If everything passed it calls next() so the controller runs.

import { validationResult } from "express-validator";

const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  return res.status(400).json({
    message: "Validation failed",
    errors: result.array().map((err) => ({
      field: err.path, // which body field failed, e.g. "email"
      message: err.msg, // human readable reason, e.g. "Invalid email"
    })),
  });
};

export default validate;
