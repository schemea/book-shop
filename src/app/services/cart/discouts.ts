export function multiplyBy(original: GoogleAPI.Price, factor: number): GoogleAPI.Price {
  return {currencyCode: original.currencyCode, amount: original.amount * factor};
}

export const TenOfSame: Discount = {
  target: "product",
  validFor: product => product.quantity >= 10,
  discountedPrice: price => ({...price, amount: price.amount * 0.9 }),
  display: "-10% Discount"
};

export const LaunchDiscount: Discount = {
  target: "cart",
  validFor: () => true,
  discountedPrice: price => multiplyBy(price, 0.9),
  display: "-5% Discount"
};
