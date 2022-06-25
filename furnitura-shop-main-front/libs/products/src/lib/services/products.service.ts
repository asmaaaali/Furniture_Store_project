import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {environment} from '@env/environment'
import { Product } from '../models/product';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private url = environment.apiURL + 'products'; 
  
  constructor(private http: HttpClient) { }

  getProducts(categoriesFilter?: string[]): Observable<Product[]>
  {
    let params = new HttpParams();
    if(categoriesFilter)
    {
      params = params.append('categoryId', categoriesFilter.join(','));
    }
    return this.http.get<Product[]>(this.url, { params: params});
  }

  getProduct(productID:string): Observable<Product>
  {
    return this.http.get<Product>(this.url+'/'+productID);
  }

  updateProduct(productData: FormData, productID:string): Observable<Product>
  {
    return this.http.patch<Product>(this.url+'/'+productID, productData);
  }

  createProduct(productData: FormData): Observable<Product>
  {
    return this.http.post<Product>(this.url, productData);
  }

  deleteProduct(productID:string): Observable<Product>
  {
    return this.http.delete<Product>(this.url+'/'+productID);
  }

  getProductsCount(): Observable<number> {
    return this.http
      .get<number>(`${this.url}/get/count`)
      .pipe(map((objectValue: any) => objectValue.productsCount));
  }

  getFeaturedProducts(count :number): Observable<Product[]>
  {
    return this.http.get<Product[]>(this.url+'/get/featured/'+count);
  }
}
