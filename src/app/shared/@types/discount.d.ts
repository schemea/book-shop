interface DiscountCommon {
  display: string;
  discountedPrice: (price: Price) => Price;
}

type Product = import("services/cart/product").Product;

interface ProductDiscount extends DiscountCommon {
  target: "product";
  validFor: (product: Product) => boolean;
}
interface CartDiscount extends DiscountCommon {
  target: "cart";
  validFor: (products: Product[]) => boolean;
}

type Discount = ProductDiscount | CartDiscount;
