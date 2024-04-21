import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable, from, lastValueFrom, map, of, take, tap } from 'rxjs';
import { ShoppingCart } from '../models/shopping-cart';
import { IProduct } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  shopping_carts: AngularFirestoreCollection<any>;
  cartId: any;
  shopping_cart_items: AngularFirestoreCollection<any>;

  constructor(
    private afireFirestore: AngularFirestore
  ) {
    this.shopping_carts = this.afireFirestore.collection('shopping-carts')
    this.getOrCreateCartId();
    this.shopping_cart_items = this.shopping_carts.doc(this.cartId).collection('items')
  }

  /**
   * Get or Create current cart
   */
  private async getOrCreateCartId() {
    if (localStorage.getItem('cartId')) {
      this.cartId = localStorage.getItem('cartId')
    } else {
      this.cartId = await this.create();
      localStorage.setItem('cartId', this.cartId);
    }
  }

  /**
   * get cart data with items
   * @returns current cart
   */
  async getCart(): Promise<Observable<ShoppingCart>> {
    return <any>this.shopping_cart_items.snapshotChanges().pipe(
      map( snapshots => new ShoppingCart(snapshots.map( items => items.payload.doc.data()) as {})) // get items from snapshot as map
    )
  }

  /**
   * Add item to cart
   * @param product item selected
   */
  async addToCart(product: IProduct) {
    this.updateItem(product, 1);
  }

  /**
   * Remove item from cart
   * @param product item selected
   */
  async removeFromCart(product: IProduct) {
    this.updateItem(product, -1);
  }

  /**
   * Clear items into cart
   */
  async clearFromCart(){
    this.shopping_cart_items.get().subscribe( s => s.docs.map( cart_product => cart_product.ref.delete().then(()=> console.log(`Deleting items (${cart_product.id})`)).catch(err => console.log(err))))
  }

  /**
   * Clear items into cart and delete current cart, and delete local storage
   */
  async clearCart() {
    this.shopping_carts.get().subscribe(carts => {
      carts.forEach((cart) => {
        if (cart.id == this.cartId ) {
          this.shopping_carts.doc(cart.id).collection('items').get().subscribe(cart_products => {
            cart_products.docs.map( cart_product => {
              cart_product.ref.delete()
              .then(() => console.log(`Deleting items (${cart_product.id})`))
              .catch(error => {console.log(error); });
            })
          })
          cart.ref.delete()
            .then(() => console.log(`Deleting cart (${cart.id})`))
            .catch(error => {console.log(error); });
          localStorage.removeItem('cartId')
        }
      });
    })
  }

  /**
   * Create cart
   * @returns created cart id
   */
  private create() : Promise<any>{
    return new Promise<any>((resolve, reject) => {
      this.afireFirestore.collection('shopping-carts').add({
        dateCreated: new Date().getTime()
      }).then(ref => {
        resolve(ref.id);
      })
    })
  }

  private getItem(productId: string) : Observable<AngularFirestoreDocument> {
    return <any>this.shopping_cart_items.ref.where('Id', '==', productId).get();
  }

  /**
   * Get item doc info
   * @param productId item selected
   * @returns data observed
   */
  private getItemDocument(productId: string): Observable<AngularFirestoreDocument> {
    return <any>this.shopping_carts.doc(this.cartId).collection<AngularFirestoreDocument>('items', ref => ref.where('Id', '==', productId)).get().pipe(
      map(items => {
        const item = items.docs[0]
        return item;
      })
    );
  }

  /**
   * Get item product info
   * @param productId item selected
   * @returns data observed
   */
  private getItemData(productId: string): Observable<IProduct> {
    return <any>this.shopping_carts.doc(this.cartId).collection<IProduct>('items', ref => ref.where('Id', '==', productId)).valueChanges().pipe(
      map(items => {
        const item = items[0]
        return item;
      })
    );
  }

  /**
   * Update item into cart
   * @param product item selected
   * @param change value to insert
   */
  async updateFromCart(product: any, change: number) {
    this.getItemDocument(product.Id).subscribe((item_value: AngularFirestoreDocument)  => {
      const item = item_value
      item.ref.update({
        Amount: change
      })
    })
  }

  /**
   * Delete item into cart
   * @param product item selected
   */
  async deleteFromCart(product: any) {
    this.getItemDocument(product.Id).subscribe((item_value: AngularFirestoreDocument)  => {
      const item = item_value
      item.ref.delete()
    })
  }

  /**
   * Update item into cart with plus or minus
   * @param product item selected
   * @param change value to insert
   */
  private async updateItem(product: any, change: number) {
    let itemProduct:IProduct = await lastValueFrom(this.getItemData(product.Id).pipe(take(1)))
    this.getItemDocument(product.Id).subscribe((item_value: AngularFirestoreDocument)  => {
        const item = item_value
        if (item) {
          let Amount = (itemProduct.Amount || 0 ) + change;
          if (Amount === 0) {
            item.ref.delete()
          } else {
            item.ref.update({
              Amount: Amount
            })
          }
        } else {
          this.shopping_cart_items.add({...product, Amount: 1})
        }
    })
  }
}
