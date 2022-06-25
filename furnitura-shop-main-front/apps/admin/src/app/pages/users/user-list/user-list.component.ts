import { Component, OnDestroy, OnInit } from '@angular/core';
import { User, UsersService } from '@furnitura/users';
import { Router } from '@angular/router';
import {MessageService, ConfirmationService} from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'admin-user-list',
  templateUrl: './user-list.component.html',
  styles: [
  ]
})
export class UserListComponent implements OnInit, OnDestroy {

  users: User[] = [];
  endsubs$: Subject<void> = new Subject();

  constructor(
    private usersService : UsersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router : Router
  ) { }


  ngOnInit(): void {
    this._getUsers();
  }

  ngOnDestroy(): void {
      this.endsubs$.next();
      this.endsubs$.complete();
  }

  private _getUsers()
  {
    this.usersService.getUsers().pipe(takeUntil(this.endsubs$)).subscribe( response => {
      this.users = response;
    });
  }

  confirmDelete(event: Event, userID:string) {
    this.confirmationService.confirm({
        target: event.target,
        message: 'Are you sure that you want to delete this User?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._acceptDeleteBehavior(userID);
        }
    });
  }

  private _acceptDeleteBehavior(userID:string)
  {
    this.usersService.deleteUser(userID).pipe(takeUntil(this.endsubs$)).subscribe( (user) => {
      this._getUsers();
      this.messageService.add({
        severity:'success', 
        summary:'Success', 
        detail:'User Is Deleted'
      });
      }, 
      () => {
        this.messageService.add({
          severity:'error', 
          summary:'Fail', 
          detail:'User Is not Deleted'
        });
      });
  }

  updateUser(userID:string)
  {
    this.router.navigateByUrl(`users/form/${userID}`);
  }

}
