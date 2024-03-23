import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map, of } from 'rxjs';
import { IOrder, IOrderProduct } from '../models/order.interface';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  cart$: Observable<any>;
  current_cart: any;
  constructor(
    private afireFirestore: AngularFirestore,
    private authService: AuthService,
  ) {
    this.current_cart = (localStorage.getItem('current_cart') !== null) ? localStorage.getItem('current_cart') : null;
    this.cart$ = (localStorage.getItem('current_cart') && localStorage.getItem('init_cart') !== 'true' ) ? <any>this.afireFirestore.collection('order').doc(this.current_cart).collection('order_products').valueChanges() : of();
  }

  /**
   * make request to get all rows order collection
   * @returns {IOrder[]}
   */
  getAll(): Observable<IOrderProduct[]> {
    if (this.current_cart !== null) {
      return this.afireFirestore.collection("order").doc(this.current_cart).collection('order_products').snapshotChanges().pipe(
        map( snapshots => {
          return snapshots.map( s => {
            const data:any = s.payload.doc.data()
            return {...data, IdRef: s.payload.doc.id }
          })
        })
      )
    } else {
      return of()
    }
  }

  /**
   * make request to get order data selected
   * @param id
   * @returns {IOrder}
   */
  getOrder(id: any) : Observable<any> {
    return this.afireFirestore.collection('order').doc(id).valueChanges();
  }

  /**
   * make request to create new order
   * @param order
   * @returns {IOrder}
   */
  postOrder(order_product: IOrderProduct): Observable<any> {
    if (this.current_cart === null) {
      this.afireFirestore.collection('order').add({
        Id: '',
        UserId: '',
        Cod: '',
        TotalPrice: 0
      }).then( data => {
        localStorage.setItem('current_cart', data.id)
        this.afireFirestore.collection('order').doc(data.id).collection('order_products').add(order_product)
      });
      localStorage.setItem('init_cart', 'true')
    } else {
      this.afireFirestore.collection('order').doc(this.current_cart).collection('order_products').add(order_product)
    }
    return this.afireFirestore.collection('order').doc(this.current_cart).collection('order_products').valueChanges();
  }

  /**
   * make request to update order data selected
   * @param id
   * @param order
   */
  putOrder(id:number, order: IOrder): Observable<any> {
    this.afireFirestore.collection('order').doc('order').update(order);
    return this.afireFirestore.collection('order').doc(this.current_cart).collection('order_products').valueChanges();
  }

  /**
   * make request to update order status selected
   * @param id
   * @param status
   */
  deleteOrder(id: any): Observable<any> {
    this.afireFirestore.collection('order').doc(this.current_cart).collection('order_products').ref.where('Id','==', id).limit(1).get().then( querySnapshot => {
      querySnapshot.forEach( doc => doc.ref.delete())
    })
    return this.afireFirestore.collection('order').doc(this.current_cart).collection('order_products').valueChanges();
  }
}
