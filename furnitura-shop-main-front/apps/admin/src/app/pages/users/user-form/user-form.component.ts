import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UsersService, User } from '@furnitura/users';
import {MessageService} from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'admin-user-form',
  templateUrl: './user-form.component.html',
  styles: [
  ]
})
export class UserFormComponent implements OnInit, OnDestroy {

  form: FormGroup;
  isSubmitted = false;
  editMode = false;
  currentUserId: string;
  countries = [];
  endsubs$: Subject<void> = new Subject();

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private location: Location,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._initUserForm();
    // this._getCountries();
    this._checkEditMode();
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
      name: ['test', Validators.required],
      password: ['12346789', Validators.required], //not Required on Update
      email: ['awdawd@gmail.com', [Validators.required, Validators.email]],
      phone: ['01276760353', Validators.required],
      isAdmin: [false],
      street: [' '],
      apartment: [' '],
      zip: [' '],
      city: [' '],
      country: [' ']
    });
  }

  onSubmit()
  {
    if(this.form.valid)
    {
      const user: User = this._getUserFromForm;     
      
      if(this.editMode)
      {
        this._UpdateUser(user);
      }
      else
      {
        this._AddUser(user);
      }
    }
    else
    this.isSubmitted = true;
  }

  private _UpdateUser(user: User)
  {
    this.usersService.updateUser(user,this.currentUserId).pipe(takeUntil(this.endsubs$)).subscribe((user:User) => { 
      this._successBehavior(user);
    },
    () => {
      this._failBehavior();
    });
  }

  private _AddUser(user: User)
  {
    this.usersService.RegisterUser(user).pipe(takeUntil(this.endsubs$)).subscribe((user:User) => {
      this._successBehavior(user);
    },
    (err) => {
      if(err.status == 500 ) 
      {
        this._failBehavior("User Already Existed");
      }
      else
      {
        this._failBehavior();
      }
    });
  }

  private _successBehavior(user:User)
  {
    this.messageService.add({
      severity:'success', 
      summary:'Success', 
      detail:`${this.editMode ? `User ${user.name} Is Updated` : `User ${user.name} Is Created`}`
    });
    timer(2000).toPromise().then(() => {
      this.location.back();
    });
  }

  private _failBehavior(message?: string)
  {
    if(message)
    {
      this.messageService.add({
        severity:'error', 
        summary:'Fail', 
        detail: message
      });
    }
    else
    {
      this.messageService.add({
        severity:'error', 
        summary:'Fail', 
        detail:`${this.editMode ? 'User Is not Updated' : 'User Is not Created'}`
      });
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
      isAdmin: this.userForm.isAdmin.value,
      street: this.userForm.street.value,
      apartment: this.userForm.apartment.value,
      zip: this.userForm.zip.value,
      city: this.userForm.city.value,
      country: this.userForm.country.value
    }
    return user;
  }

  onCancel(){
    timer(2000).toPromise().then(() => {
      this.location.back();
    });
  }

  

  private _checkEditMode()
  {
    this.route.params.pipe(takeUntil(this.endsubs$)).subscribe( params => {
      if(params.id)
      {
        this.editMode = true;
        this.currentUserId = params.id;
        this._fetchUserData(this.currentUserId);
      }
    })
  }
  private _fetchUserData(userID: string)
  {
    this.usersService.getUser(userID).pipe(takeUntil(this.endsubs$)).subscribe( user => {
      this.userForm.name.setValue(user.name);
      this.userForm.email.setValue(user.email);
      this.userForm.phone.setValue(user.phone);
      this.userForm.isAdmin.setValue(user.isAdmin);
      this.userForm.street.setValue(user.street);
      this.userForm.apartment.setValue(user.apartment);
      this.userForm.zip.setValue(user.zip);
      this.userForm.city.setValue(user.city);
      this.userForm.country.setValue(user.country);
      
      this.userForm.password.setValidators([]);
      this.userForm.password.updateValueAndValidity();
    });
  }
  
}
