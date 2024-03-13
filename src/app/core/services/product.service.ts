import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';
import { IProduct } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private _baseURL = `${environment.api}/api/Product`;

  constructor(private httpService: HttpService) { }

  /**
   * make request to get all rows product collection
   * @returns {IProduct[]}
   */
  getAll(): Observable<IProduct[]> {
    return this.httpService.getJson<IProduct[]>(this._baseURL);
  }

  /**
     * make request to get product data selected
     * @param id
     * @returns {IProduct}
     */
  getProduct(id: number): Observable<IProduct>{
    return this.httpService.getJson<IProduct>(`${this._baseURL}/${id}`);
  }

  /**
   * make request to create new product
   * @param product
   * @returns {IProduct}
   */
  postProduct(product: IProduct): Observable<IProduct> {
      return this.httpService.postJson<IProduct>(this._baseURL, product);
  }

  /**
   * make request to update product data selected
   * @param id
   * @param product
   */
  putProduct(id:number, product: IProduct): Observable<IProduct> {
      return this.httpService.putJson<IProduct>(`${this._baseURL}/${id}`, product);
  }

  /**
   * make request to update product status selected
   * @param id
   * @param status
   */
  putDeleteLogicProduct(id: number, status: boolean) {
    return this.httpService.putJson(`${this._baseURL}/delete/${id}?enable=${status}`,'');
  }

  /**
   * make request to update product status selected
   * @param id
   * @param status
   */
  //deleteProduct(id: number, status: boolean) {
  //  return this.httpService.deleteJson(`${this._baseURL}/${id}`);
  //}

}
