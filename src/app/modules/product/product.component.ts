import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  isEdit: boolean;
  id: any;
  hasAuthenticated: boolean = false;

  constructor() {
    this.isEdit = false;
  }

  ngOnInit(): void {
  }

  /**
   * Listener createBodega Event from the bodegas-list component
   *
   */
  createProduct(id: any){
    this.isEdit = true;
    this.id = id;
  }

  /**
   * Listener salirEvent Event from the bodegas-list component
   *
   */
  leaveEvent(e: any) {
    if (e === false) {
      this.isEdit = false;
    }
  }
}
