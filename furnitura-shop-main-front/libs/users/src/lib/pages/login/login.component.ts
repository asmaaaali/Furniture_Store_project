import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'users-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  loginFormGroup : FormGroup;
  isSubmitted = false;
  authError = false;
  authMessage: string;

  constructor(
    private formBuilder: FormBuilder,
    private auth : AuthService,
    private localStorageService : LocalstorageService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this._initLoginForm();
  }

  get loginForm()
  {
    return this.loginFormGroup.controls;
  }

  private _initLoginForm()
  {
    this.loginFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  onSubmit()
  {
    this.isSubmitted = true;

    if(this.loginFormGroup.invalid) return;

    const loginData = {
      email: this.loginForm.email.value,
      password: this.loginForm.password.value 
    }

    this.auth.login(loginData.email, loginData.password).subscribe( (user) => {
      this._successfulLoginBehavior(user.token);
    }, (error :HttpErrorResponse) => {
      this._failureloginBehavior(error.status);
    });
  }

  private _successfulLoginBehavior(token: string)
  {
    this.authError = false;
    this.localStorageService.setToken(token);
    this.router.navigate(['/']);
  }

  private _failureloginBehavior(errorStatus : number)
  {
    this.authError = true;    
    if(errorStatus !== 400)
    {
      this.authMessage = "Error in the Server, Please try again Later";
    }else
    {
      this.authMessage = "Email or Password are Wrong, please try again";
    } 
  }

}
