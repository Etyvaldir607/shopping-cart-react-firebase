import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IProduct } from 'src/app/core/models/product.interface';
import { ProductService } from 'src/app/core/services/product.service';
import { LocalService } from 'src/app/shared/services/local.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent {

  @Output() leaveEvent = new EventEmitter();

  // Datos Product
  @Input()

  id: number = 0;
  name: string | undefined = undefined;
  price: number | undefined = 0;
  isActive: boolean | undefined = true;
  hasAuthenticated: boolean = false;

  constructor(
    //private toast: ToastComponent,
    private productService: ProductService,
    private localService: LocalService,
    //private confirmationService: ConfirmationService,
  ) {
  }

  ngOnInit(): void {
    if(this.id != null && this.id != 0){
      this.getProduct();
    }
  }

  /**
   * Set bodega interface from bodegaService
   * @return void
   *
   */
  getProduct(){
    if (this.hasAuthenticated == false) {
      let res = this.getProductItem(this.getProductList(), this.id)
      this.name = res.Name;
      this.price = res.Price;
      this.isActive = res.IsActive;

    } else {
      this.productService.getProduct(this.id).subscribe(
        async res => {
          this.name = res.Name;
          this.price = res.Price;
          this.isActive = res.IsActive;
        }
      )
    }
  }

  /**
   * Set product interface and call post Product or put Product services
   * @params current data
   * @return object
   *
   */
  save(){
    const data: IProduct = {
      Name:                 this.name,
      Price:                this.price,
      IsActive:             this.isActive
    }
    if (this.hasAuthenticated === false) {
      let productList = this.getProductList();
      if (this.id) {
        this.localService.putItem('products', data, productList, this.id)
      } else {
        this.localService.postItem('products', {
          ...data,
          Id: this.getRandomId(),
        } , productList)
      }
      this.cancel();

      console.log(this.getProductList());
    } else {
      if (this.id != 0) { // update
        data.Id = this.id;
        this.productService.putProduct(this.id, data).subscribe(
          res => {
            //this.toast.successMessage('','Product actualizada con éxito.');
            this.cancel();
          },
          err => {
            //this.toast.errorMessage('Error', 'No se actualizó la product');
          }
        );
      } else { // create
        this.productService.postProduct(data).subscribe(
          res => {
            //this.toast.successMessage('','Product creada con éxito.');
            this.cancel();
          },
          err => {
            //this.toast.errorMessage('Error', 'No se creó la product');
          }
        );
      }
    }
  }

  /**
   * Dispatch Event to the main component
   *
   */
  cancel(){
    this.leaveEvent.emit(false)
  }

  getProductList() {
    return this.localService.getList('products');
  }

  getProductItem(list: object[], id: any) : any {
    return list.find( (item: IProduct) => item.Id == id)
  }

  getRandomId() {
    return Math.floor((Math.random()*6)+1);
  }


}
