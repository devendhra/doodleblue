// Order controller - placing orders and reading/updating them.
// Golden rule: we NEVER trust prices from the client. Every item's price
// and discount are loaded fresh from the database and stored as a
// snapshot inside the order.

import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Coupon from "../models/Coupon.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { calculateTotals } from "../utils/pricing.js";

// Give back stock that was already reserved, e.g. when a later item
// fails or the order cannot be saved.
const restoreStock = (reduced) =>
  Promise.all(
    reduced.map((r) =>
      Product.updateOne({ _id: r.product }, { $inc: { stock: r.quantity } })
    )
  );

// POST /api/orders  (logged-in user)
// Body: { items: [{ productId, quantity }], couponCode?, shippingAddress? }
export const createOrder = asyncHandler(async (req, res) => {
  const { items, couponCode, shippingAddress } = req.body;

  // Merge duplicate productIds: two lines for the same product become one.
  const merged = new Map();
  for (const item of items) {
    const key = String(item.productId);
    merged.set(key, (merged.get(key) || 0) + Number(item.quantity));
  }
  const productIds = [...merged.keys()];

  // Load every product from the DB - the source of truth for prices.
  const products = await Product.find({ _id: { $in: productIds } });
  if (products.length !== productIds.length) {
    throw new ApiError(400, "One or more products were not found");
  }
  const productById = new Map(products.map((p) => [String(p._id), p]));

  // Coupon must pass the same checks as POST /api/coupons/validate.
  let coupon = null;
  if (couponCode) {
    coupon = await Coupon.findActive(couponCode);
    if (!coupon) {
      throw new ApiError(400, "Invalid coupon code");
    }
  }

  // Snapshot items: copy product details into the order so later price
  // changes don't rewrite order history.
  const orderItems = [...merged.entries()].map(([id, quantity]) => {
    const p = productById.get(id);
    return {
      product: p._id,
      title: p.title,
      thumbnail: p.thumbnail,
      price: p.price,
      discountPercentage: p.discountPercentage,
      quantity,
    };
  });

  // Reduce stock atomically: the update only succeeds when enough stock
  // remains (stock >= quantity), so two customers can't buy the last unit.
  const reduced = [];
  for (const item of orderItems) {
    const updated = await Product.findOneAndUpdate(
      { _id: item.product, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
      { new: true }
    );
    if (!updated) {
      // Put back what earlier items took, then explain what went wrong.
      await restoreStock(reduced);
      const fresh = await Product.findById(item.product);
      const left = fresh ? fresh.stock : 0;
      throw new ApiError(
        409,
        left === 0
          ? `${item.title} is out of stock`
          : `Only ${left} left for ${item.title}`
      );
    }
    reduced.push(item);
  }

  // All stock reserved - do the money math and save the order.
  const { subtotal, discount, shipping, total } = calculateTotals(
    orderItems,
    coupon ? coupon.percentOff : 0
  );

  let order;
  try {
    order = await Order.create({
      user: req.user._id,
      items: orderItems,
      couponCode: coupon ? coupon.code : undefined,
      subtotal,
      discount,
      shipping,
      total,
      shippingAddress,
    });
  } catch (err) {
    // Saving failed - release the reserved stock before re-throwing.
    await restoreStock(reduced);
    throw err;
  }

  res.status(201).json(order);
});

// GET /api/orders/mine - the logged-in user's orders, newest first.
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
});

// GET /api/orders/:id - owner only.
export const getOrderById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new ApiError(400, "Invalid id");
  }
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  if (String(order.user) !== String(req.user._id)) {
    throw new ApiError(403, "Not allowed to view this order");
  }
  res.json(order);
});

// PATCH /api/orders/:id/cancel - owner only, while status is "pending".
// Restores the stock so cancelled items can be bought again.
export const cancelOrder = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new ApiError(400, "Invalid id");
  }
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  if (String(order.user) !== String(req.user._id)) {
    throw new ApiError(403, "Not allowed to cancel this order");
  }
  if (order.status !== "pending") {
    throw new ApiError(400, "Only pending orders can be cancelled");
  }

  await restoreStock(order.items);
  order.status = "cancelled";
  await order.save();

  res.json(order);
});


