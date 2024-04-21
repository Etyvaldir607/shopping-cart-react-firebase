import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { IProduct } from 'src/app/core/models/product.interface';
import { ShoppingCart } from 'src/app/core/models/shopping-cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private items: any[] = [];
  private items$: BehaviorSubject<IProduct[]>; // working with BehaviorSubject
  //private items$: Observable<IProduct[]> = of() // working with observable

  constructor() {
    this.items = (localStorage.getItem('cart')) ? this.getItems() : [];
    this.items$ = new BehaviorSubject<IProduct[]>(this.items); // working with BehaviorSubject
    ////working with observable
    //this.items$ = new Observable(observer => {
    //  setInterval(() =>{ observer.next(this.items)}, 1000)
    //})
  }

  /**
   * get cart data with items
   * @returns current cart
   */
  async getCart(): Promise<Observable<ShoppingCart>> {
    return <any>this.items$.pipe(
      map(res => new ShoppingCart(res as {}))
    )
  }

  /**
   * Add item to cart
   * @param item item selected
   */
  async addItem(item: any) {
    if (this.items.length < 1) {
      this.items.push({...item, Amount: 1})
    } else {
      if (!this.items.some(val => val.Id === item.Id)) {
        this.items.push({...item, Amount: 1})
      } else {
        this.items = this.items.map(val => (val.Id === item.Id) ? {...val, Amount: val.Amount+1 } : val)
      }
    }
    localStorage.setItem('cart', JSON.stringify(this.items));
    this.items$.next(this.items)
  }

  /**
   * Remove item from cart
   * @param product item selected
   */
  async removeItem(item: any) {
    if (this.items.length < 1) {
      this.items = this.items.filter(val => (val.Id === item.Id))
      localStorage.removeItem('cart')
    } else {
      if (this.items.some(val => (val.Id === item.Id && val.Amount > 1))) {
        this.items = this.items.map(val => (val.Id === item.Id) ? {...val, Amount: (val.Amount - 1) } : val)
      } else {
        this.items = this.items.filter(val => !(val.Id === item.Id))
      }
      localStorage.setItem('cart', JSON.stringify(this.items));
    }
    this.items$.next(this.items)
  }

  /**
   * update item from cart
   * @param product item selected
   * @param change value to insert
   */
  async updateItem(item: any, change: number) {
    this.items.forEach((val: any )=> {
      if (val.Id == item.Id) {
        val.Amount = change
      }
    });
    localStorage.setItem('cart', JSON.stringify(this.items));
    this.items$.next(this.items)
  }

  /**
   * delete item from cart
   * @param product item selected
   */
  async deleteItem(item: any) {
    this.items.forEach((val: any )=> {
      if (val.Id == item.Id) {
        this.items = this.items.filter(val => !(val.Id === item.Id))
      }
    });
    localStorage.setItem('cart', JSON.stringify(this.items));
    this.items$.next(this.items)
  }

  setItems(items: any): void {
    if (items.length > 0) {
      items.forEach((item: any )=> {
        this.items.push({...item})
      });
    }
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  getItems(): any[] {
    return (localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')!) : [];
  }

  clearCart() :void {
    this.items = []
    this.items$.next(this.items)
  }
}
