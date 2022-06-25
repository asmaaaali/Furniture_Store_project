import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const TOKEN = 'jwtToken';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  token$: BehaviorSubject<string> = new BehaviorSubject(this.getToken());

  constructor() { }

  setToken(data:string)
  {
    localStorage.setItem(TOKEN, data);
    this.token$.next(data);
  }

  getToken(): string | null
  {
    return localStorage.getItem(TOKEN);
  }

  removeToken()
  {
    this.token$.next("");
    return localStorage.removeItem(TOKEN);
  }

  isValidToken()
  {
    const token = this.getToken();
    if(token)
    {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      return !this._tokenExpired(tokenDecode.exp);
    }
    else
    {
      return false;
    }
  }

  getUserIdFromToken()
  {
    const token = this.getToken();
    if(token)
    {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      if(tokenDecode)
      {
        return tokenDecode._id;
      }
      else
      {
        return null;
      }
    }
    else
    {
      return null;
    }
  }

  private _tokenExpired(expiration: number): boolean
  {
    return Math.floor(new Date().getTime()/1000) >= expiration;
  }
}
