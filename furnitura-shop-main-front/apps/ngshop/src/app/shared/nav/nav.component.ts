import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from '@furnitura/users';

@Component({
  selector: 'ngshop-nav',
  templateUrl: './nav.component.html',
  styles: [
  ]
})
export class NavComponent implements OnInit {

  loggedin: boolean;

  constructor(private localStorageToken: LocalstorageService) { }

  ngOnInit(): void {
    this.ckeckLoggedin();
  }

  private ckeckLoggedin()
  {
    this.localStorageToken.token$.subscribe(resToken => {
      if(resToken)
        this.loggedin = true; 
      else
        this.loggedin = false;
    });
  }

}
