import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private items: any[] = []
  constructor() { }

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
  }

  removeItem(item: any) :void {
    if (this.items.length < 1) {
      this.items = this.items.filter(val => (val.Id === item.Id))
    } else {
      if (this.items.some(val => (val.Id === item.Id && val.Amount > 1))) {
        this.items = this.items.map(val => (val.Id === item.Id) ? {...val, Amount: (val.Amount - 1) } : val)
      } else {
        this.items = this.items.filter(val => !(val.Id === item.Id))
      }
    }
  }

  getItems() : any[] {
    return this.items;
  }

  clearCart(item: any) :void {
    this.items = []
  }


}
