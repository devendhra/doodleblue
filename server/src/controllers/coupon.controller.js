// Coupon controller - customers can check a coupon code before paying.
// The "is this code usable right now" logic lives on the Coupon model
// (Coupon.findActive) so the order controller uses the exact same rules.

import Coupon from "../models/Coupon.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// POST /api/coupons/validate  (public)
// Body: { code }. Answers whether the code can be used right now.
export const validateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findActive(req.body.code);

  if (!coupon) {
    // Same message for every failure - don't reveal which check failed
    throw new ApiError(400, "Invalid coupon code");
  }

  res.json({ valid: true, code: coupon.code, percentOff: coupon.percentOff });
});


