import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Category } from '../models/category';
import { Observable } from 'rxjs';
import {environment} from '@env/environment'


@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private url = environment.apiURL + 'category'; 

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]>
  {
    return this.http.get<Category[]>(this.url);
  }

  getCategory(categoryID:string): Observable<Category>
  {
    return this.http.get<Category>(this.url+'/'+categoryID);
  }

  updateCategory(category:Category, categoryID:string): Observable<Category>
  {
    return this.http.patch<Category>(this.url+'/'+categoryID, category);
  }

  createCategory(category: Category): Observable<Category>
  {
    return this.http.post<Category>(this.url, category);
  }

  deleteCategory(categoryID:string): Observable<Category>
  {
    return this.http.delete<Category>(this.url+'/'+categoryID);
  }
}
