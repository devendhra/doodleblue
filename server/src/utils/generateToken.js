// Small helper that creates a signed JWT token for a logged-in user.
// We will use it in the register / login controllers (next step).
// The token payload contains the user's id and role so the auth
// middleware can identify who is making each request.

import jwt from "jsonwebtoken";

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },            // data stored inside the token
    process.env.JWT_SECRET,          // secret key from .env used to sign it
    { expiresIn: process.env.JWT_EXPIRES_IN } // e.g. "7d" = valid for 7 days
  );
};

export default generateToken;
