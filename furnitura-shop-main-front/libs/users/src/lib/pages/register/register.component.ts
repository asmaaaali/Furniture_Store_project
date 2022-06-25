import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';
import { User } from '../../models/user';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'users-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  form: FormGroup;
  isSubmitted = false;
  endsubs$: Subject<void> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._initUserForm();
  }

  ngOnDestroy(): void {
      this.endsubs$.next();
      this.endsubs$.complete();
  }

  get userForm()
  {
    return this.form.controls;
  }

  private _initUserForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', [Validators.required,Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      street: [' '],
      apartment: [' '],
      zip: [' '],
      city: [' '],
      country: [' ']
    });
  }

  onSubmit()
  {
    this.isSubmitted = true;
    if(this.form.valid)
    {
      const user: User = this._getUserFromForm;
      this._AddUser(user);  
    }
  }

  private get _getUserFromForm()
  {
    const user: User = 
    {
      name: this.userForm.name.value,
      email: this.userForm.email.value,
      phone: this.userForm.phone.value,
      password: this.userForm.password.value,
      street: this.userForm.street.value,
      apartment: this.userForm.apartment.value,
      zip: this.userForm.zip.value,
      city: this.userForm.city.value,
      country: this.userForm.country.value
    }
    return user;
  }

  private _AddUser(user: User)
  {
    this.usersService.RegisterUser(user).pipe(takeUntil(this.endsubs$)).subscribe((resUser)=> {
      this._successBehavior(resUser);
    }, (err) => {
      if(err.status == 500)
      {
        this._failBehavior("User Already Existed");  
      }
      else
      {
        this._failBehavior();
      }
    })
  }

  private _successBehavior(user: User)
  {
    this.messageService.add({
      severity:'success', 
      summary:'Success', 
      detail: `User ${user.name} Added Successfuly`
    });
    timer(1500).toPromise().then(() => {
      this.router.navigate(['/login']);
    });
  }

  private _failBehavior(message?: string)
  {
    this.messageService.add({
      severity:'error', 
      summary:'Fail', 
      detail: message? message : 'Sorry! User failed to register'
    });
    timer(1500).toPromise().then(() => {
      this.router.navigate(['/']);
    });
  }

}
