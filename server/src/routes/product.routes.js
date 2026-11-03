// Product routes - /api/products/*
// All routes are public: anyone can browse the catalogue.
// Products are added to the database with "npm run seed:products".
// IMPORTANT: /categories is declared BEFORE /:id, otherwise "categories"
// would be treated as a product id and hit the wrong controller.

import { Router } from "express";
import {
  getProducts,
  getCategories,
  getProductById,
  getRelatedProducts,
} from "../controllers/product.controller.js";

const router = Router();

router.get("/", getProducts);
router.get("/categories", getCategories); // must stay above /:id
router.get("/:id/related", getRelatedProducts);
router.get("/:id", getProductById);

export default router;
