import { Component, EventEmitter, Output } from '@angular/core';
import { IProduct } from 'src/app/core/models/product.interface';
import { IOrder, IOrderProduct } from 'src/app/core/models/order.interface';

import { ProductService } from 'src/app/core/services/product.service';
import { LocalService } from 'src/app/shared/services/local.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { HeaderService } from 'src/app/shared/services/header.service';

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
    //private confirmationService: ConfirmationService,
    //private toast: ToastComponent
  ) { }

  ngOnInit(): void {
    this.getAllProducts()
  }

  /**
   * Call getAllProducts service
   * @return object array
   *
   */
  getAllProducts(){
    if (this.hasAuthenticated === false) {
      this.products = this.getProductList();
      this.order_products = this.products.map((item: IProduct) => (item) ? {...item, Amount: 0} : item )
      this.cart_products = this.cartService.getItems();
    } else {
      this.ProductService.getAll().subscribe(
        async res => {
          this.products = await res;
        }
      )
    }
  }

  getProductList() {
    return this.localService.getList('products');
  }

  remove(item: any) {
    this.cartService.removeItem(item)
    this.cart_products = this.cartService.getItems()
    let show_card = this.getTotals()
    this.headerService.showCart(show_card);

  }

  add(item: any) {
    this.cartService.addItem(item)
    this.cart_products = this.cartService.getItems()
    let show_card = this.getTotals()
    this.headerService.showCart(show_card);
  }

  getTotals(){
    let cart = {
      priceTotal: 0,
      amountTotal: 0,
    }
    this.cart_products.map((item) => {
      cart.priceTotal = cart.priceTotal + (item.Price * item.Amount)
      cart.amountTotal = cart.amountTotal + item.Amount
    })
    return cart
  }

  getRandomId() {
    return Math.floor((Math.random()*6)+1);
  }
}
