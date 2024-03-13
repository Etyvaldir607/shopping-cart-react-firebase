import { Component, OnInit } from "@angular/core";
import { HeaderService } from "src/app/shared/services/header.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit{

  priceTotal: number = 0;
  amountTotal: number = 0;

  constructor(public headerService: HeaderService) {
  }

  ngOnInit() {
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
}
