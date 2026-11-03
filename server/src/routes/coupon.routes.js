// Coupon routes - /api/coupons/*
// Only one public endpoint: checking whether a code is valid.
// Coupons are managed directly in the database / via the seed script.

import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.js";
import { validateCoupon } from "../controllers/coupon.controller.js";

const router = Router();

// POST /api/coupons/validate { code } - anyone may check a code
router.post(
  "/validate",
  [body("code").trim().notEmpty().withMessage("Coupon code is required")],
  validate,
  validateCoupon
);

export default router;
