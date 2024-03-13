import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  public cart:  EventEmitter<void> = new EventEmitter();

  constructor() {}

  showCart(cart: any) {
    this.cart.emit(cart)
  }

  getShowCart() {
    return this.cart
  }
}
