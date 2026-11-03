import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
} from 'react-router-dom'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

/* =========================
   PRODUCT LIST
========================= */

function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        return response.json()
      })
      .then((data) => {
        console.log('Products:', data)

        setProducts(data.products || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setError(error.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-xl">Loading products...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-red-400">
        <p>{error}</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            Prolane
          </h1>

          <p className="mt-2 text-zinc-400">
            Sports gear, engineered.
          </p>
        </div>

        {/* Products */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-zinc-600 hover:bg-zinc-800"
            >

              {/* Image */}
              <div className="flex h-60 items-center justify-center rounded-xl bg-zinc-950 p-5">

                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain transition group-hover:scale-105"
                />

              </div>

              {/* Category */}
              <p className="mt-5 text-sm uppercase tracking-wide text-zinc-500">
                {product.category}
              </p>

              {/* Title */}
              <h2 className="mt-2 text-xl font-semibold">
                {product.title}
              </h2>

              {/* Rating */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-yellow-400">
                  ★
                </span>

                <span>
                  {product.rating}
                </span>

                <span className="text-zinc-500">
                  ({product.ratingCount})
                </span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-center gap-3">

                <span className="text-2xl font-bold text-emerald-400">
                  ${product.discountedPrice}
                </span>

                {product.discountPercentage > 0 && (
                  <span className="text-sm text-zinc-500 line-through">
                    ${product.price}
                  </span>
                )}

              </div>

              {/* Stock */}
              <p className="mt-3 text-sm text-zinc-400">
                {product.stock > 0
                  ? `${product.stock} available`
                  : 'Out of stock'}
              </p>

              {/* Button */}
              <div className="mt-5 w-full rounded-lg bg-white px-4 py-3 text-center font-semibold text-black transition group-hover:bg-zinc-200">
                View Details
              </div>

            </Link>
          ))}

        </div>

      </div>
    </main>
  )
}

/* =========================
   PRODUCT DETAILS
========================= */

function ProductDetails() {
  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/products/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Product not found')
        }

        return response.json()
      })
      .then((data) => {
        console.log('Product details:', data)

        setProduct(data.product || data)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setError(error.message)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-xl">
          Loading product...
        </p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white">

        <p className="mb-5 text-xl text-red-400">
          {error}
        </p>

        <Link
          to="/"
          className="rounded-lg bg-white px-5 py-3 font-semibold text-black"
        >
          ← Back to Products
        </Link>

      </main>
    )
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        Product not found
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">

      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <Link
          to="/"
          className="text-zinc-400 transition hover:text-white"
        >
          ← Back to Products
        </Link>

        {/* Product Details */}
        <div className="mt-8 grid overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 md:grid-cols-2">

          {/* Image */}
          <div className="flex min-h-[500px] items-center justify-center bg-zinc-950 p-10">

            <img
              src={product.thumbnail}
              alt={product.title}
              className="max-h-[450px] max-w-full object-contain"
            />

          </div>

          {/* Information */}
          <div className="p-8 md:p-12">

            {/* Category */}
            <p className="text-sm uppercase tracking-widest text-zinc-500">
              {product.category}
            </p>

            {/* Title */}
            <h1 className="mt-3 text-4xl font-bold">
              {product.title}
            </h1>

            {/* Brand */}
            <p className="mt-3 text-zinc-400">
              Brand:{" "}
              <span className="text-white">
                {product.brand}
              </span>
            </p>

            {/* Rating */}
            <div className="mt-6 flex items-center gap-3">

              <span className="text-2xl text-yellow-400">
                ★
              </span>

              <span className="text-lg">
                {product.rating}
              </span>

              <span className="text-zinc-500">
                ({product.ratingCount} ratings)
              </span>

            </div>

            {/* Price */}
            <div className="mt-6 flex items-center gap-4">

              <span className="text-4xl font-bold text-emerald-400">
                ${product.discountedPrice}
              </span>

              {product.discountPercentage > 0 && (
                <>
                  <span className="text-xl text-zinc-500 line-through">
                    ${product.price}
                  </span>

                  <span className="rounded-full bg-red-500/10 px-3 py-1 text-sm font-semibold text-red-400">
                    {product.discountPercentage}% OFF
                  </span>
                </>
              )}

            </div>

            {/* Description */}
            <div className="mt-8">

              <h2 className="text-lg font-semibold">
                Description
              </h2>

              <p className="mt-3 leading-7 text-zinc-400">
                {product.description}
              </p>

            </div>

            {/* Stock */}
            <div className="mt-6">

              {product.stock > 0 ? (
                <p className="font-medium text-emerald-400">
                  ✓ In Stock — {product.stock} available
                </p>
              ) : (
                <p className="font-medium text-red-400">
                  ✕ Out of Stock
                </p>
              )}

            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">

                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300"
                  >
                    #{tag}
                  </span>
                ))}

              </div>
            )}

            {/* Add Cart */}
            <button
              disabled={product.stock === 0}
              onClick={() => alert('Product added to cart')}
              className="mt-8 w-full rounded-lg bg-white px-6 py-4 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {product.stock > 0
                ? 'Add to Cart'
                : 'Out of Stock'}
            </button>

          </div>

        </div>

      </div>

    </main>
  )
}

export default App