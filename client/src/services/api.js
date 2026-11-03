
import axios from "axios";

// Backend base URL
const API_URL = import.meta.env.VITE_API_URL;

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// GET PRODUCTS
export const fetchProducts = async (params = {}) => {
  const response = await api.get("/products", {
    params,
  });

  return response.data;
};

// GET PRODUCT CATEGORIES
export const fetchCategories = async () => {
  const response = await api.get("/products/categories");

  return response.data;
};

// GET SINGLE PRODUCT
export const fetchProductById = async (id) => {
  const response = await api.get(`/products/${id}`);

  return response.data;
};

// GET RELATED PRODUCTS
export const fetchRelatedProducts = async (id) => {
  const response = await api.get(
    `/products/${id}/related`
  );

  return response.data;
};

export default api;
