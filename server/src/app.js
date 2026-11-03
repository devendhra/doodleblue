// This file builds the Express "app" - the object that handles all
// incoming HTTP requests. Middleware runs top-to-bottom: security and
// parsing first, then routes, then the 404 and error handlers LAST.

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import orderRoutes from "./routes/order.routes.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// helmet sets safe HTTP headers (hides tech details, blocks some attacks)
app.use(helmet());

// morgan logs every request line to the terminal, e.g. "GET /api/products 200 12ms"
app.use(morgan("dev"));

// CORS: only allow requests from our frontend. CLIENT_URL in .env may
// hold several comma-separated origins, e.g. "http://localhost:5173,https://prolane.in"
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(cors({ origin: allowedOrigins }));

// Parse JSON request bodies, capped at 1mb to block huge payloads
app.use(express.json({ limit: "1mb" }));

// Global rate limit: 300 requests per 15 minutes per IP - stops
// abuse/scraping without bothering normal users.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  message: { message: "Too many requests, please try again later" },
});
// Stricter limit for auth routes: 20 per 15 min slows down
// password-guessing attempts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: { message: "Too many attempts, please try again later" },
});
app.use("/api", apiLimiter);

// Simple health check so we (and deployment tools) can confirm the API is up.
// Test it with: GET http://localhost:3000/api/health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// --- Routes ---
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/orders", orderRoutes);

// --- Must stay LAST ---
app.use(notFound);      // no route matched -> 404
app.use(errorHandler);  // turns thrown errors into clean JSON responses

export default app;
