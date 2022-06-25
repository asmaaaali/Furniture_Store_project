import { Component} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'ngshop-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent{

  currentRoute: string;
  login_registerMode = false;

  constructor(
    private router: Router 
  ) { 
    this.router.events.pipe(
      filter((event:any) => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.currentRoute = event.url;
      this._checkLoginRegisterMode();
    })
  }

  private _checkLoginRegisterMode()
  {
    if(this.currentRoute.includes("login") || this.currentRoute.includes("register"))
    {
      this.login_registerMode = true;
    } 
    else
    {
      this.login_registerMode = false;
    }
  }
  
}
