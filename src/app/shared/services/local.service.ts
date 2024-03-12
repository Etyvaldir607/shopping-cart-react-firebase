import { Injectable } from '@angular/core';
import { IProduct } from 'src/app/core/models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor() { }
  // Set a item in local storage
  postItem(key: string, value: object, list: any): void {
    sessionStorage.setItem(key, JSON.stringify(list.concat(value)));
  }

  // Set a item in local storage
  putItem(key: string, value: IProduct, list: any, id: any): void {
    let update_list = list.map( (item: IProduct) => (item.Id === id) ? {...value, Id: id} : item)
    sessionStorage.setItem(key, JSON.stringify(update_list));
  }

  // Get a list from local storage
  getList(key: string): object[] {
    let list = sessionStorage.getItem(key);
    if (!list) {
        return new Array();
    }
    return JSON.parse(list);
  }

  // Remove a item from local storage
  deleteItem(key: string, list: any, id: any): void {
    let update_list = list.filter( (item: IProduct) => !(item.Id === id))
    sessionStorage.setItem(key, JSON.stringify(update_list));
  }

  // Remove a value from local storage
  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  // Clear all items from local storage
  clear(): void {
    sessionStorage.clear();
  }

}
