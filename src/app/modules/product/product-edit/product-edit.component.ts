import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { IProduct } from 'src/app/core/models/product.interface';
import { ProductService } from 'src/app/core/services/product.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LocalService } from 'src/app/shared/services/local.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent {

  @Output() leaveEvent = new EventEmitter();
  title: string = 'Create Product';
  // Datos Product
  @Input() id: string = '0';

  name: string | undefined = undefined;
  price: number | undefined = undefined;
  isActive: boolean | undefined = true;
  hasAuthenticated: boolean = false;

  private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  constructor(
    //private toast: ToastComponent,
    private productService: ProductService,
    private localService: LocalService,
    private authService: AuthService,
    //private confirmationService: ConfirmationService,
  ) {
  }

  ngOnInit(): void {
    this.hasAuthenticated = this.authService.isLoginIn
    if(this.id != null && this.id != '0'){
      this.title = 'Modify Product'
      this.getProduct();
    }
  }

  /**
   * Set producto interface from producto Service
   * @return void
   *
   */
  getProduct(){
    if (this.hasAuthenticated === false) {
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
    console.log(this.hasAuthenticated)
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

      //console.log(this.getProductList());
    } else {
      if (this.id != '0') { // update
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

  getValue(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let el = event.target as HTMLInputElement
    let current: string = el.value;
    const position = el.selectionStart || 0;
    const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }

}
