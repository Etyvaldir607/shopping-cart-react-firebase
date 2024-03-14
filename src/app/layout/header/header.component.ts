import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
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
  hasAuthenticated: boolean= false;

  constructor(
    public headerService: HeaderService,
    public authService: AuthService,
    public router: Router
  ) {
  }

  ngOnInit() {
    this.hasAuthenticated = this.authService.isLoginIn
    this.headerService.getShowCart().subscribe(
      newValue => {
        this.showCart(newValue)
      }
    )
  }

  showCart(cart: any) {
    this.priceTotal = cart.priceTotal
    this.amountTotal = cart.amountTotal
  }

  logout(){
    this.hasAuthenticated = false;
    this.authService.logOut();
    this.router.navigate(['order']);
  }
}
