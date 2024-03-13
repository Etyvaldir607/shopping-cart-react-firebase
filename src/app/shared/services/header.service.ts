import { EventEmitter, Injectable } from '@angular/core';
import { AuthService } from './auth.service';

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
