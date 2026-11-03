// Seed script - fills the database with starter data.
//
//   npm run seed            -> upserts the SAVE10 coupon
//   npm run seed:products   -> imports server/data/products.json
//                              (refuses if products already exist unless
//                              you pass --force)
//
// Safe to run many times: it never deletes data.

import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Coupon from "../models/Coupon.js";
import Product from "../models/Product.js";

// server/src/scripts -> server/
const SERVER_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);
const PRODUCTS_FILE = path.join(SERVER_ROOT, "data", "products.json");

const args = process.argv.slice(2);
const onlyProducts = args.includes("--products");
const force = args.includes("--force");

// Upsert the demo coupon so it always exists with 10% off.
const seedCoupon = async () => {
  await Coupon.findOneAndUpdate(
    { code: "SAVE10" },
    { $set: { percentOff: 10, active: true } },
    { upsert: true, new: true }
  );
  console.log("Coupon SAVE10 ready (10% off, active)");
};


// Pick only the fields our Product schema knows, so a dummyjson-style
// file can be imported without errors.
const mapProduct = (p) => ({
  title: p.title,
  description: p.description,
  category: p.category,
  brand: p.brand,
  price: p.price,
  discountPercentage: p.discountPercentage ?? 0,
  rating: p.rating ?? 0,
  ratingCount: p.ratingCount ?? p.reviews?.length ?? 0,
  stock: p.stock ?? 0,
  tags: p.tags ?? [],
  thumbnail: p.thumbnail,
  images: p.images ?? [],
  specifications: p.specifications,
  returnPolicy: p.returnPolicy,
  warrantyInformation: p.warrantyInformation,
  reviews: (p.reviews || []).map((r) => ({
    reviewerName: r.reviewerName || "Anonymous",
    rating: r.rating,
    comment: r.comment || "",
    date: r.date,
  })),
});

const seedProducts = async () => {
  if (!fs.existsSync(PRODUCTS_FILE)) {
    console.log("No server/data/products.json found - nothing to import");
    return;
  }
  const existing = await Product.countDocuments();
  if (existing > 0 && !force) {
    console.log(
      `Refusing to seed: products collection already has ${existing} docs. ` +
        "Run again with --force to import anyway."
    );
    process.exitCode = 1;
    return;
  }
  const raw = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"));
  // Accept both [ {...}, ... ] and dummyjson's { products: [...] } shape
  const list = Array.isArray(raw) ? raw : raw.products || [];
  const inserted = await Product.insertMany(list.map(mapProduct));
  console.log(`Imported ${inserted.length} products`);
};

await connectDB();

if (onlyProducts) {
  await seedProducts();
} else {
  await seedCoupon();
}

await mongoose.disconnect();
console.log("Seed finished");
process.exit(process.exitCode || 0);
