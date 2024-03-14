import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';
import { IProduct } from '../models/product.interface';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private httpService: HttpService,
    private afireFirestore: AngularFirestore
  ) {
    //this.product = afireFirestore.doc('products');
  }

  /**
   * make request to get all rows product collection
   * @returns {any[]}
   */
  getAll(): Observable<any[]> {
    return this.afireFirestore.collection('products').valueChanges();
  }

  /**
   * make request to get product data selected
   * @param id
   * @returns {IProduct}
   */
  getProduct(id: number) : Observable<any> {
    console.log('test');
    return of();
    //return this.httpService.getJson<IProduct>(`${this._baseURL}/${id}`);
  }

  /**
   * make request to create new product
   * @param product
   * @returns {IProduct}
   */
  postProduct(product: IProduct): Observable<any> {
    this.afireFirestore.collection('products').add(product);
    return this.afireFirestore.collection('products').valueChanges();
  }

  /**
   * make request to update product data selected
   * @param id
   * @param product
   */
  putProduct(id:number, product: IProduct): Observable<any> {
    this.afireFirestore.collection('products').doc('product').update(product);
    return this.afireFirestore.collection('products').valueChanges();
  }

  /**
   * make request to update product status selected
   * @param id
   * @param status
   */
  deleteProduct(id: number, status: boolean) {
    this.afireFirestore.collection('products').doc('product.Id').delete()
    return this.afireFirestore.collection('products').valueChanges();
  }
}
