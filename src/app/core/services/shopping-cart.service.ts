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

  constructor(
    private afireFirestore: AngularFirestore
  ) {
    this.shopping_carts = this.afireFirestore.collection('shopping-carts')
  }

  async getCart(): Promise<Observable<any>> {
    let cartId = await this.getOrCreateCartId();
    return this.shopping_carts.doc(cartId).collection('items').get().pipe(
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
    let cartId = await this.getOrCreateCartId();
    this.shopping_carts.get().subscribe(carts => {
      carts.forEach((cart) => {
        if (cart.id == cartId ) {
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
    // We want to create a Typed Return of the added Entity
    return new Promise<any>((resolve, reject) => {
      this.afireFirestore.collection('shopping-carts').add({
        dateCreated: new Date().getTime()
      }).then(ref => {
        resolve(ref.id);
      })
    })

  }

  //private getItem(cartId: string, productId: string) : Promise<any> {
  //  return new Promise<any>((resolve, reject) => {
  //    this.shopping_carts.doc(cartId).collection('items').doc(productId).get().pipe(
  //      tap( s => {
  //        resolve(s.data())
  //      })
  //    )
  //  })
  //}

  getItem(cartId: string, productId: string) : Observable<AngularFirestoreDocument> {
      //var doc$: any = of() ;
      //console.log("get item")
      return <any>this.shopping_carts.doc(cartId).collection('items').ref.where('Id', '==', productId).get();
  }

  getItemReference(cartId: string, productId: string): Observable<AngularFirestoreDocument> {
    return <any>this.shopping_carts.doc(cartId).collection<AngularFirestoreDocument>('items', ref => ref.where('Id', '==', productId)).get().pipe(
      map(items => {
        //console.log("item reference")
        //console.log(items)
        const item = items.docs[0]
        return item;
      })
    );
  }

  getItemData(cartId: string, productId: string): Observable<IProduct> {
    return <any>this.shopping_carts.doc(cartId).collection<IProduct>('items', ref => ref.where('Id', '==', productId)).valueChanges().pipe(
      map(items => {
        //console.log("item data")
        //console.log(items)
        const item = items[0]
        return item;
      })
    );
  }

  private async getOrCreateCartId(): Promise<string> {
    let cartId = localStorage.getItem('cartId');
    if (cartId)
      return cartId;
    let result = await this.create();
    localStorage.setItem('cartId', result);
    return result;
  }

  private async updateItem(product: any, change: number) {
    let cartId = await this.getOrCreateCartId();
    let itemProduct:IProduct = await lastValueFrom(this.getItemData(cartId, product.Id).pipe(take(1)))
    //console.log(product, change, itemProduct)
    this.getItemReference(cartId, product.Id).subscribe( (item_value: AngularFirestoreDocument)  => {
        const item = item_value
        if (item) {
          let Amount = (itemProduct.Amount || 0 ) + change;
          if (Amount === 0) {
            item.ref.delete()
          } else {
            console.log(item)
            item.ref.update({
              Name: product.Name,
              ImageUrl: product.ImageUrl || '',
              Price: product.Price,
              Amount: Amount,
              IsActive: product.IsActive,
            })
          }
        } else {
          this.shopping_carts.doc(cartId).collection('items').add({...product, Amount: 1})
        }
    })
  }
}
