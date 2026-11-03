// Auth routes - /api/auth/*
// Validation rules run first (express-validator), then the shared
// "validate" middleware turns failures into a 400 error response.

import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.js";
import protect from "../middleware/protect.js";
import { register, login, getMe } from "../controllers/auth.controller.js";

const router = Router();

// POST /api/auth/register { name, email, password }
router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validate,
  register
);

// POST /api/auth/login { email, password }
router.post(
  "/login",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email address"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

// GET /api/auth/me - needs a valid Bearer token
router.get("/me", protect, getMe);

export default router;
