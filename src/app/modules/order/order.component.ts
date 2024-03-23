import { Component, EventEmitter, Output } from '@angular/core';
import { IProduct } from 'src/app/core/models/product.interface';
import { IOrder, IOrderProduct } from 'src/app/core/models/order.interface';

import { ProductService } from 'src/app/core/services/product.service';
import { LocalService } from 'src/app/shared/services/local.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrderService } from 'src/app/core/services/order.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {

//@Output() showCart = new EventEmitter<any>();
  products: IProduct[] = [];
  order_products: any[] = [];
  cart_products: any[] = [];
  hasAuthenticated: boolean = false;

  constructor(
    private ProductService: ProductService,
    private localService: LocalService,
    private cartService: CartService,
    public headerService: HeaderService,
    public authService: AuthService,
    public orderService: OrderService,
    //private confirmationService: ConfirmationService,
    //private toast: ToastComponent
  ) { }

  ngOnInit(): void {
    this.hasAuthenticated = this.authService.isLoginIn;
    this.getAllProducts();
  }

  /**
   * Call getAllProducts service
   * @return object array
   *
   */
  getAllProducts(){
    //if (this.hasAuthenticated === false) {
    //  this.products = this.getProductList();
    //  this.order_products = this.products.map((item: IProduct) => (item) ? {...item, Amount: 0} : item )
    //} else {
    this.ProductService.getAll().subscribe(
      (res) => {
        console.log(res)
        this.products = res;
        this.order_products = this.products.map((item: IProduct) => (item) ? { ...item } : item);
        this.getAllProductsInCart();

      }
    )
    //}
  }

  getAllProductsInCart(){
    if (this.hasAuthenticated === false) {
      this.localService.getList('cart').map((item: any) => !(this.products.some(val => (val.Id === item.Id))) || this.add(item, true) )
    } else {
      this.orderService.getAll().subscribe(res =>{
        this.cartService.clearCart()
        res.map((item) => !(this.products.some(val => (val.Id === item.Id))) || this.add(item, true))
        this.headerService.showCart(this.getTotals(res));
      })
    }
  }

  getProductList() {
    return this.localService.getList('products');
  }

  remove(item: any) {
    this.cartService.removeItem(item)
    this.cart_products = this.cartService.getItems()
    if (this.hasAuthenticated === false) {
      if (this.cart_products.length < 1) {
        this.localService.removeItem('cart')
      } else {
        this.localService.deleteItem('cart', this.localService.getList('cart') , item.Id)
      }
      this.headerService.showCart(this.getTotals(this.localService.getList('cart')));
    } else {
      this.orderService.deleteOrder(item.Id)
    }
  }

  add(item: any, from_recovery: boolean = false) {
    this.cartService.addItem(item);
    this.cart_products = this.cartService.getItems();
    if (this.hasAuthenticated === false) {
      if (!from_recovery) {
        if (this.cart_products.length < 1) {
          this.localService.postItem('cart', item, [])
        } else {
          this.localService.postItem('cart', item, this.localService.getList('cart'))
        }
      }
      this.headerService.showCart(this.getTotals(this.localService.getList('cart')));
    } else {
      if (!from_recovery) {
        this.orderService.postOrder(item)
      }
    }
  }

  getTotals(list:any[]){
    let cart = {
      priceTotal: 0,
      amountTotal: 0,
    }
    list.map((item) => {
      cart.priceTotal = cart.priceTotal + item.Price
      cart.amountTotal = cart.amountTotal + 1
    })
    return cart
  }

  getRandomId() {
    return Math.floor((Math.random()*6)+1);
  }
}
