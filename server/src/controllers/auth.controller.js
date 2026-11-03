// Auth controller - handles register, login and "who am I".
// Passwords are hashed by the User model's pre-save hook; we never
// return the password, only a signed JWT plus safe user fields.

import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

// Shape of the user object we send back to the client.
const userResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// POST /api/auth/register
// Creates a new account. Role is always "customer" - we ignore any role
// the client tries to send so nobody can self-register as admin.
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password, role: "customer" });
  const token = generateToken(user._id, user.role);

  res.status(201).json({ token, user: userResponse(user) });
});

// POST /api/auth/login
// Checks email + password and returns a fresh token.
// Wrong email and wrong password get the SAME message on purpose -
// we don't want to tell attackers which emails exist.
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // password has select:false in the schema, so we ask for it explicitly
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const matches = await user.comparePassword(password);
  if (!matches) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user._id, user.role);
  res.json({ token, user: userResponse(user) });
});

// GET /api/auth/me  (protect middleware already loaded req.user)
export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: userResponse(req.user) });
});
