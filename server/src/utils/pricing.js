// pricing - one place for all order money math so the rules never drift.
//
// Rules:
//   line price = price * (1 - discountPercentage / 100)   (product discount)
//   subtotal   = sum of (line price * quantity) for every item
//   discount   = subtotal * percentOff / 100              (coupon discount)
//   shipping   = free when subtotal >= 499, else 49     (BEFORE coupon)
//   total      = subtotal - discount + shipping
// Every money value is rounded to 2 decimals.
//
// Example: subtotal 233.98 with SAVE10 -> discount 23.40, shipping 0,
//          total 210.58

// Round to 2 decimals, e.g. 23.398 -> 23.4
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

export const calculateTotals = (items, percentOff = 0) => {
  const subtotal = round2(
    items.reduce((sum, item) => {
      const linePrice = round2(item.price * (1 - item.discountPercentage / 100));
      return sum + linePrice * item.quantity;
    }, 0)
  );

  const discount = round2((subtotal * percentOff) / 100);
  const shipping = subtotal >= 499 ? 0 : 49;
  const total = round2(subtotal - discount + shipping);

  return { subtotal, discount, shipping, total };
};
