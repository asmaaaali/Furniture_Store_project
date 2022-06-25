import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {environment} from '@env/environment'
import { Order } from '../models/order';
import { Product } from '@furnitura/products';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private url = environment.apiURL + 'orders';

  private ProductsURL = environment.apiURL + 'products'; //just until fixing the dependency

  constructor(private http: HttpClient) { }

  getOrders(): Observable<Order[]>
  {
    return this.http.get<Order[]>(this.url);
  }

  getOrder(orderID:string): Observable<Order>
  {
    return this.http.get<Order>(this.url+'/'+orderID);
  }

  updateOrder(orderStatus: {status: string}, orderID: string): Observable<Order>
  {
    return this.http.patch<Order>(this.url+'/'+orderID, orderStatus);
  }

  createOrder(order: Order): Observable<Order>
  {
    return this.http.post<Order>(this.url, order);
  }

  deleteOrder(orderID:string): Observable<Order>
  {
    return this.http.delete<Order>(this.url+'/'+orderID);
  }

  getOrdersCount(): Observable<number> {
    return this.http
      .get<number>(`${this.url}/get/count`)
      .pipe(map((objectValue: any) => objectValue.orderCount));
  }

  getTotalSales(): Observable<number> {
    return this.http
      .get<number>(`${this.url}/get/totalsales`)
      .pipe(map((objectValue: any) => objectValue.totalsales));
  }

  getProduct(productID:string): Observable<any>
  {
    return this.http.get<any>(this.ProductsURL+'/'+productID);
  }
}
