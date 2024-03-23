import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { IProduct } from '../models/product.interface';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  products: AngularFirestoreCollection<IProduct>;

  constructor(
    private afireFirestore: AngularFirestore
  ) {
    this.products = this.afireFirestore.collection("products")
  }

  /**
   * make request to get all rows product collection
   * @returns {IProduct[]}
   */
  getAll(): Observable<IProduct[]> {
    return this.products.snapshotChanges().pipe(
      map( snapshots => {
        return snapshots.map( s => {
          const data:any = s.payload.doc.data()
          return {...data, Id: s.payload.doc.id}
        })
      })
    )
  }

  /**
   * make request to get product data selected
   * @param id
   * @returns {IProduct}
   */
  getProduct(id: any) : Observable<any> {
    return this.products.doc(id).valueChanges();
  }

  /**
   * make request to create new product
   * @param product
   * @returns {IProduct}
   */
  postProduct(product: IProduct): Observable<any> {
    this.products.add(product);
    return this.products.valueChanges();
  }

  /**
   * make request to update product data selected
   * @param id
   * @param product
   */
  putProduct(id:any, product: IProduct): Observable<any> {
    this.products.doc(id).update(product);
    return this.products.valueChanges();
  }

  /**
   * make request to update product status selected
   * @param id
   * @param status
   */
  deleteProduct(id:any): Observable<any> {
    this.products.doc(id).delete()
    return this.products.valueChanges();
  }
}
