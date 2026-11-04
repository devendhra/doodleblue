
import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Products Page */}
      <Route path="/products" element={<ProductsPage />} />

      {/* Single product page */}
      <Route path="/product/:id" element={<ProductDetail />} />

      <Route path="/cart" element={<CartPage />} />

      {/* Order history */}
      <Route path="/orders" element={<Orders />} />

      {/* Auth pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
