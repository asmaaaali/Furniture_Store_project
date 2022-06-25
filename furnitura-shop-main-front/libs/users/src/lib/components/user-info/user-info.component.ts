import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../models/user';
import { LocalstorageService } from '@furnitura/users';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'users-user-info',
  templateUrl: './user-info.component.html',
  styles: [
  ]
})
export class UserInfoComponent implements OnInit, OnDestroy{

  user: User;
  endsubs$: Subject<void> = new Subject();

  constructor(
    private localStorageToken: LocalstorageService,
    private usersServices: UsersService
  ) { }

  ngOnInit(): void {
    this.checkLoggedin();
  }
  
  ngOnDestroy(): void {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  private checkLoggedin()
  {
    this.localStorageToken.token$.subscribe(resToken => {
      if(resToken)
      {
        const tokenDecode = JSON.parse(atob(resToken.split('.')[1]));
        this.getUser(tokenDecode._id); 
      }
      else
      {
        this.user = null;
      }
    });
  }

  private getUser(userID: string)
  {
    this.usersServices.getUser(userID).pipe(takeUntil(this.endsubs$)).subscribe( resUser => {
      this.user = resUser;
    });
  }

  logout()
  {
    this.localStorageToken.removeToken();
  }

}