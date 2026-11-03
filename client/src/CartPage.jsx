import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const CART_STORAGE_KEY = 'kadai-cart'

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]')
    return Array.isArray(saved) ? saved.filter((item) => item?.id && Number(item.quantity) > 0) : []
  } catch {
    return []
  }
}

function CartIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h8.3a2 2 0 0 0 1.9-1.4L21 8H6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.5" cy="19" r="1.3" fill="currentColor" />
      <circle cx="17.5" cy="19" r="1.3" fill="currentColor" />
    </svg>
  )
}

function ImagePlaceholder() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-slate-500">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="8.5" cy="9" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m4 17 5-5 3.5 3.5 2.5-2.5 5 5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M4.5 7h15M9 7V4.8h6V7m-8.5 0 .8 12h9.4l.8-12M10 10v6m4-6v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const formatPrice = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
const unitPrice = (product) => typeof product.discountedPrice === 'number'
  ? product.discountedPrice
  : Math.round(product.price * (1 - (product.discountPercentage ?? 0) / 100) * 100) / 100

function CartPage() {
  const [items, setItems] = useState(readCart)
  const [coupon, setCoupon] = useState(null)
  const [couponCode, setCouponCode] = useState('')
  const [couponBusy, setCouponBusy] = useState(false)
  const [couponMessage, setCouponMessage] = useState('')
  const [checkoutBusy, setCheckoutBusy] = useState(false)
  const [checkoutMessage, setCheckoutMessage] = useState('')

  useEffect(() => {
    if (window.location.pathname !== '/cart') window.history.replaceState(null, '', '/cart')
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch {
      setCheckoutMessage('Your browser could not save the cart.')
    }
  }, [items])

  const changeQuantity = (productId, quantity) => {
    setItems((current) => current.map((item) => {
      if (item.id !== productId) return item
      const limit = Math.min(item.stock ?? 20, 20)
      return { ...item, quantity: Math.max(1, Math.min(quantity, limit)) }
    }))
  }

  const removeFromCart = (productId) => setItems((current) => current.filter((item) => item.id !== productId))

  const clearCart = () => {
    setItems([])
    setCoupon(null)
    setCouponCode('')
    setCouponMessage('')
    setCheckoutMessage('')
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage('Enter a coupon code.')
      return
    }

    setCouponBusy(true)
    setCouponMessage('')
    try {
      const response = await fetch(`${API_URL}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim() }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'This coupon is not valid.')
      setCoupon(data)
      setCouponCode(data.code)
      setCouponMessage(`${data.code} applied: ${data.percentOff}% off`)
    } catch (requestError) {
      setCoupon(null)
      setCouponMessage(requestError.message)
    } finally {
      setCouponBusy(false)
    }
  }

  const checkout = async () => {
    if (!items.length) return
    const token = localStorage.getItem('token')
    if (!token) {
      setCheckoutMessage('Sign in before continuing to checkout.')
      return
    }

    setCheckoutBusy(true)
    setCheckoutMessage('')
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: items.map(({ id, quantity }) => ({ productId: id, quantity })),
          ...(coupon?.code ? { couponCode: coupon.code } : {}),
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Could not place the order.')
      clearCart()
      setCheckoutMessage(`Order placed successfully${data._id ? ` (${data._id})` : ''}.`)
    } catch (requestError) {
      setCheckoutMessage(requestError.message)
    } finally {
      setCheckoutBusy(false)
    }
  }

  const itemCount = items.reduce((count, item) => count + item.quantity, 0)
  const subtotal = Math.round(items.reduce((sum, item) => sum + unitPrice(item) * item.quantity, 0) * 100) / 100
  const discount = Math.round(subtotal * (coupon?.percentOff ?? 0)) / 100
  const shipping = subtotal === 0 || subtotal >= 50 ? 0 : 4.99
  const total = Math.round((subtotal - discount + shipping) * 100) / 100

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#151b2a]">
      <header className="bg-[#111827] text-white">
        <div className="mx-auto flex h-[72px] max-w-[1170px] items-center gap-5 px-5">
          <a href="/cart" className="flex shrink-0 items-center gap-2.5" aria-label="Kadai Store cart">
            <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-indigo-700 text-base font-bold">K</span>
            <span className="text-[21px] font-bold tracking-tight">Kadai<span className="text-orange-400">.</span></span>
          </a>
          <a href="/cart" aria-current="page" className="flex h-10 shrink-0 items-center gap-2 rounded-[10px] bg-slate-800 px-3 text-sm font-semibold">
            <CartIcon /><span>Cart</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-xs font-bold">{itemCount}</span>
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[1170px] px-5 pb-12 pt-7 sm:pt-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-[28px] font-bold leading-tight tracking-tight sm:text-[30px]">
            Shopping cart <span className="text-lg font-semibold text-slate-500">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          </h1>
        </div>

        {items.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"><CartIcon /></div>
            <h2 className="mt-5 text-xl font-bold">Your cart is empty</h2>
            <p className="mt-2 text-sm text-slate-500">Your cart is currently empty.</p>
          </section>
        ) : (
          <div className="grid items-start gap-[22px] lg:grid-cols-[minmax(0,1fr)_406px]">
            <section aria-label="Cart items" className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="flex h-[59px] items-center justify-between border-b border-slate-200 px-[18px]">
                <span className="text-xs font-bold tracking-[0.08em] text-slate-500">PRODUCT</span>
                <button type="button" onClick={clearCart} className="rounded-[10px] border border-slate-300 px-[14px] py-[8px] text-xs font-semibold text-slate-900">Clear cart</button>
              </div>
              {items.map((product) => {
                const quantityLimit = Math.min(product.stock ?? 20, 20)
                return (
                  <article key={product.id} className="grid grid-cols-[minmax(0,1fr)_122px_90px_44px] items-center gap-3 border-b border-slate-100 px-[18px] py-[18px] last:border-b-0 max-md:grid-cols-[minmax(0,1fr)_auto] max-md:gap-x-2 max-md:gap-y-3">
                    <div className="flex min-w-0 items-center gap-5">
                      <div className="flex h-[90px] w-[90px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-indigo-50">
                        {product.thumbnail ? <img src={product.thumbnail} alt={product.title} className="h-full w-full object-cover" /> : <ImagePlaceholder />}
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-sm font-bold leading-5">{product.title}</h2>
                        {product.category && <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">{product.category}</p>}
                        <p className="mt-1 text-sm font-bold">{formatPrice(unitPrice(product))}</p>
                      </div>
                    </div>
                    <div className="flex h-[46px] items-center justify-center gap-4 rounded-[10px] border border-slate-300 text-sm font-semibold max-md:col-start-1 max-md:ml-[110px]">
                      <button type="button" aria-label={`Decrease ${product.title} quantity`} disabled={product.quantity <= 1} onClick={() => changeQuantity(product.id, product.quantity - 1)} className="text-base disabled:text-slate-300">&#8722;</button>
                      <span>{product.quantity}</span>
                      <button type="button" aria-label={`Increase ${product.title} quantity`} disabled={product.quantity >= quantityLimit} onClick={() => changeQuantity(product.id, product.quantity + 1)} className="text-base disabled:text-slate-300">+</button>
                    </div>
                    <p className="text-right text-base font-bold max-md:col-start-2 max-md:row-start-2">{formatPrice(unitPrice(product) * product.quantity)}</p>
                    <button type="button" onClick={() => removeFromCart(product.id)} aria-label={`Remove ${product.title}`} className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-red-50 text-red-600 max-md:col-start-2 max-md:row-start-1 max-md:justify-self-end"><TrashIcon /></button>
                  </article>
                )
              })}
            </section>

            <aside className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-4 text-[23px] font-bold tracking-tight">Order summary</h2>
              <label htmlFor="coupon-code" className="mb-1 block text-sm font-semibold">Coupon code</label>
              <div className="flex gap-2">
                <input id="coupon-code" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') applyCoupon() }} placeholder="Enter coupon code" className="h-11 min-w-0 flex-1 rounded-[10px] border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-600" />
                <button type="button" onClick={applyCoupon} disabled={couponBusy || !items.length} className="h-11 rounded-[10px] border border-indigo-600 px-4 text-sm font-semibold text-indigo-700 disabled:opacity-50">{couponBusy ? 'Checking...' : 'Apply'}</button>
              </div>
              {couponMessage && <p className={`mt-1.5 text-xs font-semibold ${coupon ? 'text-green-700' : 'text-red-600'}`}>{couponMessage}</p>}
              <div className="mt-4 space-y-3 border-b border-slate-200 pb-4 text-sm">
                <div className="flex justify-between text-slate-700"><span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span><span>{formatPrice(subtotal)}</span></div>
                {coupon && <div className="flex justify-between text-green-700"><span>Coupon ({coupon.code})</span><span>&#8722;{formatPrice(discount)}</span></div>}
                <div className="flex justify-between text-slate-700"><span>Shipping</span><span className={shipping === 0 && subtotal > 0 ? 'font-semibold text-green-700' : ''}>{shipping === 0 ? (subtotal > 0 ? 'FREE' : '--') : formatPrice(shipping)}</span></div>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-sm font-bold">Total</span>
                <span className="text-[28px] font-bold leading-none tracking-tight">{formatPrice(total)}</span>
              </div>
              <button type="button" onClick={checkout} disabled={checkoutBusy || !items.length} className="h-[52px] w-full rounded-[10px] bg-indigo-700 text-sm font-bold text-white transition-colors hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50">
                {checkoutBusy ? 'Processing...' : 'Proceed to checkout'}
              </button>
              {checkoutMessage && <p role="status" className="mt-3 text-xs text-slate-600">{checkoutMessage}</p>}
              <p className="mt-3 text-[11px] leading-4 text-slate-500">Prices in USD. Your cart is saved in this browser.</p>
            </aside>
          </div>
        )}

      </main>
    </div>
  )
}

export default CartPage
