import { IProduct } from './product.interface';

export class IShoppingCartItem {
  Id?:            string | number;
  Name?:          string;
  ImageUrl?:      string | null;
  Price?:         number;
  Amount?:        number;
  IsActive?:      boolean;

  constructor(init?: Partial<IShoppingCartItem>) {
    Object.assign(this, init);
  }

  get totalPrice() { return (this.Price || 0) * (this.Amount || 0);
}
}
