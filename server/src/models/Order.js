// Order model - one document per purchase.
// Product details are copied into each item ("snapshot") so the order
// history stays correct even if the product price/title changes later.

import mongoose from "mongoose";

// A single line inside the order: which product, how many, and the
// price details exactly as they were at the moment of purchase.
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    title: { type: String, required: true },
    thumbnail: { type: String },
    price: { type: Number, required: true, min: 0 },
    discountPercentage: { type: Number, default: 0, min: 0, max: 90 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

// Where the order should be delivered. Optional so drafts/pending
// orders can exist before the customer fills in the address.
const shippingAddressSchema = new mongoose.Schema(
  {
    name: { type: String },
    phone: { type: String },
    line1: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    // The customer who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    // Coupon code applied at checkout, if any (e.g. "SPORTS10")
    couponCode: { type: String },
    // Money amounts in USD. subtotal - discount + shipping = total
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    shipping: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    // Where the order is in its lifecycle
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: shippingAddressSchema,
  },
  { timestamps: true } // adds createdAt and updatedAt
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
