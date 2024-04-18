export class IShoppingCartItem {
  Id?:            string;
  Name?:          string;
  ImageUrl?:      string;
  Price?:         number;
  Amount?:        number;
  IsActive?:      boolean;

  constructor(init?: Partial<IShoppingCartItem>) {
    Object.assign(this, init);
  }

  get totalPrice() { return (this.Price || 0) * (this.Amount || 0);
}
}
