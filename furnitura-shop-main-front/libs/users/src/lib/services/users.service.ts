import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {environment} from '@env/environment'
import { User } from '../models/user';
import { UsersFacade } from '../state/users.facade';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private url = environment.apiURL + 'users'; 

  constructor(
    private http: HttpClient,
    private usersFacade: UsersFacade
  ) { }

  getUsers(): Observable<User[]>
  {
    return this.http.get<User[]>(this.url);
  }

  getUser(userID:string): Observable<User>
  {
    return this.http.get<User>(this.url+'/'+userID);
  }

  updateUser(user:User, userID:string): Observable<User>
  {
    return this.http.patch<User>(this.url+'/'+userID, user);
  }

  RegisterUser(user: User):Observable<User>
  {
    return this.http.post<User>('https://furniture-market.herokuapp.com/register', user);   
  }

  deleteUser(userID:string): Observable<User>
  {
    return this.http.delete<User>(this.url+'/'+userID);
  }

  getUsersCount(): Observable<number> {
    return this.http
      .get<number>(`${this.url}/get/count`)
      .pipe(map((objectValue: any) => objectValue.userCount));
  }

  initAppSession()
  {
    this.usersFacade.buildUserSession();
  }

  observeCurrentUser()
  {
    return this.usersFacade.currentUser$;
  }

  isCurrentUserAuth()
  {
    return this.usersFacade.isAuthenticated$;
  }
}
