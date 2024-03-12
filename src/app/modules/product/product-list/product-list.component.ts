import { Component, EventEmitter, Output } from '@angular/core';
import { IProduct } from 'src/app/core/models/product.interface';
import { ProductService } from 'src/app/core/services/product.service';
import { LocalService } from 'src/app/shared/services/local.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {
  @Output() leaveEvent = new EventEmitter();


  products: IProduct[] = [];
  displayedColumns: string[] = ['Id', 'Name', 'Price', 'IsActive', 'Actions'];

  loading: boolean = true;
  search: string | null = null;
  display: boolean = false;
  @Output() createProduct: EventEmitter<number> = new EventEmitter; // emite el evento crear o editar product
  hasAuthenticated: boolean = false;

  constructor(
    private ProductService: ProductService,
    private localService: LocalService,

    //private confirmationService: ConfirmationService,
    //private toast: ToastComponent
  ) { }

  ngOnInit(): void {
    this.getAllProducts()
  }

  /**
   * Dispatch Event to the product-edit component for add
   *
   */
  callToCreateProduct(){
    this.createProduct.emit(0);
  }

  /**
   * Dispatch Event to the product-edit component for update
   *
   */
  callToUpdateProduct(id: number){
    if(id){
      this.createProduct.emit(id);
    }
  }

  /**
   * Dispatch Event to the current component for delete
   *
   */
  callToDeleteProduct(id: number){
    this.deleteProduct(id);
  }

  /**
   * Call getAllProducts service
   * @return object array
   *
   */
  getAllProducts(){
    if (this.hasAuthenticated === false) {
      this.products = this.getProductList();
    } else {
      this.ProductService.getAll().subscribe(
        async res => {
          this.products = await res;
          this.loading = false;
        }
      )
    }
  }

  getProductList() {
    return this.localService.getList('products');
  }

  /**
   * Call confirmationService service and delete current row
   * @return object array
   *
   */
  deleteProduct(id: number){
    if (this.hasAuthenticated === false) {
      this.localService.deleteItem('products', this.getProductList(), id)
      this.cancel();
    } else {
      //this.ProductService.deleteProduct(id).subscribe(
      //  () => {
      //    //this.toast.successMessage('', 'Product eliminada con éxito.')
      //    this.getAllProducts()
      //  },
      //  () => {
      //    //this.toast.errorMessage('Error', 'No se eliminó la product.');
      //  }
      //)
    }

  }


  /**
   * Dispatch Event to the main component
   *
   */
  cancel(){
    this.leaveEvent.emit(false)
  }
}
