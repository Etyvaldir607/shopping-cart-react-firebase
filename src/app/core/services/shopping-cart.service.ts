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

  private async getOrCreateCartId() {
    if (localStorage.getItem('cartId')) {
      this.cartId = localStorage.getItem('cartId')
    } else {
      this.cartId = await this.create();
      localStorage.setItem('cartId', this.cartId);
    }
  }

  async getCart(): Promise<Observable<any>> {
    return this.shopping_cart_items.get().pipe(
      map( snapshots => {
        snapshots.forEach(s => {
          new ShoppingCart(s.data())
        })
      })
    )
  }

  async addToCart(product: IProduct) {
    this.updateItem(product, 1);
  }

  async removeFromCart(product: IProduct) {
    this.updateItem(product, -1);
  }

  async clearCart() {
    this.shopping_carts.get().subscribe(carts => {
      carts.forEach((cart) => {
        if (cart.id == this.cartId ) {
          this.shopping_carts.doc(cart.id).collection('items').get().subscribe(cart_products => {
              cart_products.docs[0].ref.delete()
                .then(() => console.log(`Deleting items (${cart.id})`))
                .catch(error => {console.log(error); });
          })
          cart.ref.delete()
            .then(() => console.log(`Deleting cart (${cart.id})`))
            .catch(error => {console.log(error); });
        }
      });
    })
  }

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

  private getItemDocument(productId: string): Observable<AngularFirestoreDocument> {
    return <any>this.shopping_carts.doc(this.cartId).collection<AngularFirestoreDocument>('items', ref => ref.where('Id', '==', productId)).get().pipe(
      map(items => {
        const item = items.docs[0]
        return item;
      })
    );
  }

  private getItemData(productId: string): Observable<IProduct> {
    return <any>this.shopping_carts.doc(this.cartId).collection<IProduct>('items', ref => ref.where('Id', '==', productId)).valueChanges().pipe(
      map(items => {
        const item = items[0]
        return item;
      })
    );
  }

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
