import { IProduct } from './product.interface';
import { IShoppingCartItem } from './shopping-cart-item';

export class ShoppingCart {
  items: IShoppingCartItem[] = [];

  constructor(
    private itemsMap: { [Id: string]: IShoppingCartItem }
  ) {
    this.itemsMap = itemsMap || {};
    for (let Id in itemsMap) {
      let item = itemsMap[Id];
      this.items.push(new IShoppingCartItem({ ...item}));
    }
  }

  getQuantity(product: IProduct) {
    let item = this.itemsMap[product.Id || ''];
    return item ? item.Amount : 0;
  }

  get totalPrice() {
    let sum = 0;
    for (let productId in this.items)
      sum += this.items[productId].totalPrice;
    return sum;
  }

  get totalItemsCount() {
    let count = 0;
    for (let productId in this.itemsMap)
      count += this.itemsMap[productId].Amount || 0;
    return count;
  }
}
