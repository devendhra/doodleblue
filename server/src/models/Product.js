// Product model - one document per sports product we sell.
// Field names follow the shape of dummyjson.com products so the
// frontend response format stays compatible with it.

import mongoose from "mongoose";

// A single customer review stored inside the product document.
const reviewSchema = new mongoose.Schema(
  {
    reviewerName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
    date: { type: Date, default: Date.now },
  },
  { _id: false } // reviews don't need their own id
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    // Stored as a lowercase slug, e.g. "cricket", "badminton", "fitness-gym"
    category: { type: String, required: true, lowercase: true, trim: true },
    brand: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 }, // price in USD
    discountPercentage: { type: Number, default: 0, min: 0, max: 90 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    tags: [{ type: String }],
    thumbnail: { type: String, required: true }, // main product image URL
    images: [{ type: String }],                  // extra image URLs
    // Flexible key-value pairs, e.g. { "Weight": "1.2kg", "Size": "5" }
    specifications: { type: Map, of: String },
    returnPolicy: { type: String },
    warrantyInformation: { type: String },
    reviews: [reviewSchema],
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
    toJSON: {
      virtuals: true, // include computed fields like discountedPrice
      // Clean up the JSON sent to the frontend:
      // rename _id to id and hide the internal __v field.
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Virtual field: not stored in the database, computed on the fly.
// Final price the customer pays after the discount is applied.
productSchema.virtual("discountedPrice").get(function () {
  const discounted = this.price * (1 - this.discountPercentage / 100);
  return Math.round(discounted * 100) / 100; // round to 2 decimals
});

// Indexes make common queries faster.
// Text index powers search by product name, brand or tag.
productSchema.index({ title: "text", brand: "text", tags: "text" });
// Normal indexes speed up filtering/sorting on these fields.
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
