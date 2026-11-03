// Product controller - public browsing endpoints.
// Responses stay close to dummyjson.com: products expose "id" (not _id)
// and include the computed "discountedPrice".

import mongoose from "mongoose";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import categoryName from "../utils/categoryNames.js";

// Escape characters that are special in regex so a search like "bat+"
// is treated as plain text and cannot crash or abuse the $regex query.
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Aggregation returns plain objects, so Mongoose virtuals and the toJSON
// transform never run. This helper re-shapes each raw document to match:
// "id" instead of "_id", rounded discountedPrice, no __v.
const shapeProduct = ({ _id, __v, ...rest }) => ({
  ...rest,
  id: _id,
  discountedPrice: Math.round(rest.discountedPrice * 100) / 100,
});

// GET /api/products
// Supports: q, category, minPrice, maxPrice, minRating, sort, page,
// limit (max 50) and skip. All filtering happens in one aggregation
// query that first computes the discounted price.
export const getProducts = asyncHandler(async (req, res) => {
  const { q, category, minPrice, maxPrice, minRating, sort, skip } = req.query;

  // --- pagination ---
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 8, 1), 50);
  // "skip" can be used instead of "page" (like dummyjson does)
  const skipCount =
    skip !== undefined
      ? Math.max(parseInt(skip, 10) || 0, 0)
      : (Math.max(parseInt(req.query.page, 10) || 1, 1) - 1) * limit;
  const page = Math.floor(skipCount / limit) + 1;

  // --- step 1: compute discountedPrice before any price filter/sort ---
  const addDiscountedPrice = {
    $addFields: {
      discountedPrice: { $multiply: ["$price", { $subtract: [1, { $divide: ["$discountPercentage", 100] }] }] },
    },
  };

  // --- step 2: build the filter ---
  const match = {};
  if (category) match.category = String(category).toLowerCase();
  if (minRating !== undefined) match.rating = { $gte: Number(minRating) || 0 };
  if (minPrice !== undefined || maxPrice !== undefined) {
    match.discountedPrice = {};
    if (minPrice !== undefined) match.discountedPrice.$gte = Number(minPrice) || 0;
    if (maxPrice !== undefined) match.discountedPrice.$lte = Number(maxPrice) || 0;
  }
  if (q) {
    const pattern = { $regex: escapeRegex(String(q).trim()), $options: "i" };
    match.$or = [{ title: pattern }, { brand: pattern }, { tags: pattern }];
  }

  // --- step 3: sorting (price sorts use the discounted price) ---
  const SORTS = {
    "price-asc": { discountedPrice: 1 },
    "price-desc": { discountedPrice: -1 },
    "rating-desc": { rating: -1 },
    featured: { ratingCount: -1 }, // default
  };
  const sortStage = { $sort: { ...(SORTS[sort] || SORTS.featured), _id: 1 } };

  // --- step 4: one query that returns both the page and the total ---
  const [result] = await Product.aggregate([
    addDiscountedPrice,
    { $match: match },
    sortStage,
    {
      $facet: {
        products: [{ $skip: skipCount }, { $limit: limit }],
        total: [{ $count: "count" }],
      },
    },
  ]);

  const total = result.total[0]?.count || 0;

  res.json({
    products: result.products.map(shapeProduct),
    total,
    skip: skipCount,
    limit,
    page,
    totalPages: Math.ceil(total / limit),
  });
});

// GET /api/products/categories
// Returns [{ slug, name, count }] sorted by display name.
export const getCategories = asyncHandler(async (req, res) => {
  const groups = await Product.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  const categories = groups
    .map((g) => ({ slug: g._id, name: categoryName(g._id), count: g.count }))
    .sort((a, b) => a.name.localeCompare(b.name));

  res.json(categories);
});

// GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new ApiError(400, "Invalid id");
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  res.json(product); // toJSON adds id + discountedPrice, drops _id/__v
});

// GET /api/products/:id/related
// Up to 4 products from the same category (best rated first).
// If the category has fewer than 4, fill the rest from other categories.
export const getRelatedProducts = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new ApiError(400, "Invalid id");
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const sameCategory = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .sort({ rating: -1 })
    .limit(4);

  let related = sameCategory;
  if (related.length < 4) {
    const alreadyPicked = [product._id, ...sameCategory.map((p) => p._id)];
    const others = await Product.find({ _id: { $nin: alreadyPicked } })
      .sort({ rating: -1 })
      .limit(4 - related.length);
    related = [...sameCategory, ...others];
  }

  res.json(related);
});


