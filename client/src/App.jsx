// App - the routing table for the Prolane frontend.
//   /cart -> the shopping cart page
//   any other path (including "/") -> redirected to /cart
// When the login/signup pages are added, declare their routes here
// above the catch-all "*" route.

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import CartPage from './pages/CartPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cart" element={<CartPage />} />
        {/* Catch-all: send every unknown path to the cart page */}
        <Route path="*" element={<Navigate to="/cart" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
