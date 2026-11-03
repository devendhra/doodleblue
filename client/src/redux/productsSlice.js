
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchProducts,
  fetchCategories,
} from "../services/api";

// Initial state
const initialState = {
  products: [],
  categories: [],

  loading: false,
  categoriesLoading: false,

  error: null,
  categoriesError: null,

  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    skip: 0,
  },

  lastParams: {},
};

// Fetch products
export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await fetchProducts(params);

      // Supports the expected backend pagination object.
      // Also handles an array response as a fallback.
      if (Array.isArray(response)) {
        return {
          products: response,
          pagination: {
            page: Number(params.page) || 1,
            limit: Number(params.limit) || 12,
            total: response.length,
            totalPages: 1,
            skip: 0,
          },
        };
      }

      const products = response.products || [];

      return {
        products,
        pagination: {
          page: Number(response.page) || Number(params.page) || 1,
          limit: Number(response.limit) || Number(params.limit) || 12,
          total: Number(response.total) || 0,
          totalPages: Number(response.totalPages) || 0,
          skip: Number(response.skip) || 0,
        },
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load products."
      );
    }
  }
);

// Fetch categories
export const getCategories = createAsyncThunk(
  "products/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchCategories();

      // Support common API response formats.
      if (Array.isArray(response)) {
        return response;
      }

      return response.categories || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load categories."
      );
    }
  }
);

// Products slice
const productsSlice = createSlice({
  name: "products",

  initialState,

  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },

    clearCategoryError: (state) => {
      state.categoriesError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Products pending
      .addCase(getProducts.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.lastParams = action.meta.arg || {};
      })

      // Products success
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })

      // Products failure
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to load products.";
      })

      // Categories pending
      .addCase(getCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })

      // Categories success
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })

      // Categories failure
      .addCase(getCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError =
          action.payload || "Failed to load categories.";
      });
  },
});

export const {
  clearProductError,
  clearCategoryError,
} = productsSlice.actions;

export default productsSlice.reducer;
