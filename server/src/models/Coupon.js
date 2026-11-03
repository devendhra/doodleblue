// Coupon model - discount codes customers can apply at checkout,
// e.g. code "SPORTS10" for 10% off.

import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,   // each code can exist only once
      uppercase: true, // saved as "SPORTS10" even if typed "sports10"
      trim: true,
    },
    // Percentage taken off the order total (1 to 100)
    percentOff: { type: Number, required: true, min: 1, max: 100 },
    // Admins can turn a code off without deleting it
    active: { type: Boolean, default: true },
    // Optional expiry date - after this the code should no longer work
    expiresAt: { type: Date },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

// Shared coupon check used by both the "validate coupon" endpoint and
// the order controller. Returns the coupon document when it exists, is
// active and is not expired - otherwise returns null.
couponSchema.statics.findActive = function (code) {
  return this.findOne({
    code: String(code || "").trim().toUpperCase(),
    active: true,
    $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
  });
};

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
