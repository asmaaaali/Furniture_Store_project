import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {environment} from '@env/environment'
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private apiURLusers = environment.apiURL + 'users/login';
  private apiURLusers = environment.apiURL + 'login';

  constructor(
    private http : HttpClient,
    private locaStorageService : LocalstorageService,
    private router : Router
  ) { }


  login(email:string, password:string) : Observable<User>
  {
    return this.http.post<User>(this.apiURLusers, {email, password});
  }

  logout()
  {
    this.locaStorageService.removeToken();
    this.router.navigate(['./login']);
  }
}
