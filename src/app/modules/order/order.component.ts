import { Component } from '@angular/core';
import { IProduct } from 'src/app/core/models/product.interface';
import { ProductService } from 'src/app/core/services/product.service';
import { LocalService } from 'src/app/shared/services/local.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ShoppingCartService } from 'src/app/core/services/shopping-cart.service';
import { ShoppingCart } from 'src/app/core/models/shopping-cart';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {

  order_products: any[] = [];
  cart_products: any[] = [];
  hasAuthenticated: boolean = false;
  cart$: Observable<ShoppingCart> = of();

  constructor(
    private ProductService: ProductService,
    private cartService: CartService,
    public headerService: HeaderService,
    public authService: AuthService,
    public shoppingCartService: ShoppingCartService
  ) {
  }

  async ngOnInit() {
    this.hasAuthenticated = this.authService.isLoginIn;
    this.getAllProducts();
    await this.getAllProductsInCart();
  }

  /**
   * Call get all products service
   * @return object array
   *
   */
  getAllProducts(){
    this.ProductService.getAll().subscribe((res: IProduct[]) => this.order_products = res)
  }

  /**
   * Call get all products in cart service
   */
  async getAllProductsInCart(){
    if (this.hasAuthenticated === false) {
      this.cart_products = this.cartService.getItems();
      this.headerService.showCart(this.cartService.getTotals());
    } else {
      this.cart$ = await this.shoppingCartService.getCart();
    }
  }

  /**
   * remove current item
   * @param item current item
   */
  async remove(item: any) {
    if (this.hasAuthenticated === false) {
      this.cartService.removeItem(item)
      this.cart_products = this.cartService.getItems()
      this.headerService.showCart(this.cartService.getTotals());
    } else {
      this.shoppingCartService.removeFromCart(item)
    }
  }

  /**
   * remove current item
   * @param item current item
   */
  async add(item: any) {
    if (this.hasAuthenticated === false) {
      this.cartService.addItem(item);
      this.cart_products = this.cartService.getItems();
      this.headerService.showCart(this.cartService.getTotals());
    } else {
      this.shoppingCartService.addToCart(item)
    }
  }

  /**
   * remove all items
   */
  clearCart() {
    this.shoppingCartService.clearFromCart();
  }
}
