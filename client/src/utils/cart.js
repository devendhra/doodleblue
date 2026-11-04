// utils/cart.js - one shared place for everything cart-related.
// The cart lives in localStorage under "kadai-cart" (same key the cart
// page already uses). Every change also fires a "prolane-cart-changed"
// event so the header badge and the cart page update instantly.

export const CART_KEY = "kadai-cart";
export const CART_EVENT = "prolane-cart-changed";
export const MAX_QTY = 20; // same limit the server enforces per item

// Read the saved cart. Always returns a clean array (drops bad rows).
export function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(saved)
      ? saved.filter((item) => item?.id && Number(item.quantity) > 0)
      : [];
  } catch {
    return [];
  }
}

// Save the cart and tell the rest of the app it changed.
export function writeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT));
}

// Add a product (or increase the quantity when it is already there).
// Quantity is capped at min(stock, MAX_QTY). Out-of-stock items are ignored.
export function addToCart(product, quantity = 1) {
  const stock = Number(product.stock ?? 0);
  if (stock <= 0) return;

  const items = readCart();
  const existing = items.find((item) => item.id === product.id);
  const cap = Math.min(stock, MAX_QTY);

  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, cap);
  } else {
    // Store the fields the cart page needs (a snapshot of the product).
    items.push({
      id: product.id,
      title: product.title,
      thumbnail: product.thumbnail,
      category: product.category,
      price: product.price,
      discountPercentage: product.discountPercentage ?? 0,
      discountedPrice: product.discountedPrice,
      stock,
      quantity: Math.min(quantity, cap),
    });
  }

  writeCart(items);
}

// Set an exact quantity for one line (1..cap).
export function setCartQuantity(id, quantity) {
  const items = readCart().map((item) => {
    if (item.id !== id) return item;
    const cap = Math.min(item.stock ?? MAX_QTY, MAX_QTY);
    return { ...item, quantity: Math.max(1, Math.min(quantity, cap)) };
  });
  writeCart(items);
}

// Remove one line completely.
export function removeFromCart(id) {
  writeCart(readCart().filter((item) => item.id !== id));
}

// Empty the whole cart.
export function clearCart() {
  writeCart([]);
}

// Total number of items (sum of quantities) - used by the header badge.
export function getCartCount() {
  return readCart().reduce((count, item) => count + item.quantity, 0);
}
