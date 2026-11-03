// Order routes - /api/orders/*
// Every route needs a logged-in customer, so "protect" runs on all of them.

import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.js";
import protect from "../middleware/protect.js";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from "../controllers/order.controller.js";

const router = Router();

// POST /api/orders { items: [{ productId, quantity }], couponCode?,
// shippingAddress? }
router.post(
  "/",
  protect,
  [
    body("items")
      .isArray({ min: 1 })
      .withMessage("Items must be a non-empty array"),
    body("items.*.productId")
      .isMongoId()
      .withMessage("Each item needs a valid productId"),
    body("items.*.quantity")
      .isInt({ min: 1, max: 20 })
      .withMessage("Quantity must be an integer between 1 and 20"),
  ],
  validate,
  createOrder
);

// GET /api/orders/mine - must stay above /:id
router.get("/mine", protect, getMyOrders);

// GET /api/orders/:id - owner only
router.get("/:id", protect, getOrderById);

// PATCH /api/orders/:id/cancel - owner only, while still "pending"
router.patch("/:id/cancel", protect, cancelOrder);

export default router;
