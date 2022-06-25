import { Component, OnInit } from '@angular/core';
import { UsersService } from '@furnitura/users';

@Component({
  selector: 'ngshop-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'ngshop';

  constructor(
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
      this.usersService.initAppSession();
      //on the app start .. initiate NGRX user state. 
  }
}
