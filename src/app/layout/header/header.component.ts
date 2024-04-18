import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { IProduct } from "src/app/core/models/product.interface";
import { ShoppingCart } from "src/app/core/models/shopping-cart";
import { OrderService } from "src/app/core/services/order.service";
import { ShoppingCartService } from "src/app/core/services/shopping-cart.service";
import { AuthService } from "src/app/shared/services/auth.service";
import { HeaderService } from "src/app/shared/services/header.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit{

  priceTotal: number = 0;
  amountTotal: number = 0;
  hasAuthenticated: boolean = false;
  cart$: Observable<ShoppingCart> = of();

  constructor(
    public headerService: HeaderService,
    public authService: AuthService,
    public router: Router,
    private shoppingCartService: ShoppingCartService
  ) {
  }

  async ngOnInit() {
    this.hasAuthenticated = this.authService.isLoginIn;
    this.cart$ = await this.shoppingCartService.getCart();
  }

  logout(){
    this.hasAuthenticated = false;
    this.authService.logOut();
    this.router.navigate(['order']);
  }
}
