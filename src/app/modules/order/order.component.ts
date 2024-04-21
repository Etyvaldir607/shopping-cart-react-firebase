import { Component } from '@angular/core';
import { IProduct } from 'src/app/core/models/product.interface';
import { ProductService } from 'src/app/core/services/product.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ShoppingCartService } from 'src/app/core/services/shopping-cart.service';
import { ShoppingCart } from 'src/app/core/models/shopping-cart';
import { Observable, of } from 'rxjs';
import { IShoppingCartItem } from 'src/app/core/models/shopping-cart-item';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {

  order_products: IShoppingCartItem[] = [];
  cart_products: any[] = [];
  hasAuthenticated: boolean = false;
  cart$: Observable<ShoppingCart> = of();
  displayedColumns: string[] = ['name', 'price', 'amount', 'sub-total' , 'actions'];

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
    this.ProductService.getAll().subscribe((res: any[]) => this.order_products = res)
  }

  /**
   * Call get all products in cart service
   */
  async getAllProductsInCart(){
    if (this.hasAuthenticated) {
      this.cart$ = await this.shoppingCartService.getCart()
    } else {
      this.cart$ = await this.cartService.getCart();
    }
  }

  /**
   * remove selected item
   * @param item current item
   */
  async remove(item: any) {
    if (this.hasAuthenticated) {
      this.shoppingCartService.removeFromCart(item)
    } else {
      this.cartService.removeItem(item)
    }
  }

  /**
   * add selected item
   * @param item current item
   */
  async add(item: any) {
    if (this.hasAuthenticated) {
      this.shoppingCartService.addToCart(item)
    } else {
      this.cartService.addItem(item);
    }
  }

  /**
   * update selected item
   * @param item current item
   * @param value current item
   */
  update(item: IProduct, value: number) {
    if (this.hasAuthenticated) {
      this.shoppingCartService.updateFromCart(item, value)
    } else {
      this.cartService.updateItem(item, value)
    }
  }

  getValue(event: Event) {
    let value = Number((event.target as HTMLInputElement).value)
    if ( value == 0  || value < 0) {
      (event.target as HTMLInputElement).value = '1'
      return 1
    }
    return Number((event.target as HTMLInputElement).value);
  }

  /**
   * update selected item
   * @param item
   */
  delete(item: IProduct){
    if (this.hasAuthenticated) {
      this.shoppingCartService.deleteFromCart(item)
    } else {
      this.cartService.deleteItem(item)
    }
  }


  /**
   * remove all items
   */
  clearCart() {
    if (this.hasAuthenticated) {
      this.shoppingCartService.clearFromCart();
    } else {
      this.cartService.clearCart();
    }
  }
}
