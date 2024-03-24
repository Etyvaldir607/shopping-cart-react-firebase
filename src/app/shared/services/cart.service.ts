import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private items: any[] = []
  constructor() {
    this.items = (localStorage.getItem('cart')) ? this.getItems() : [];
  }

  addItem(item: any) :void {
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
  }

  removeItem(item: any) :void {
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
  }

  getItems(): any[] {
    return (localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')!) : [];
  }

  getTotals(){
    let cart = {
      priceTotal: 0,
      amountTotal: 0,
    }
    this.items.map((item) => {
      cart.priceTotal = cart.priceTotal + item.Price
      cart.amountTotal = cart.amountTotal + item.Amount
    })
    return cart
  }

  clearCart() :void {
    this.items = []
  }
}
