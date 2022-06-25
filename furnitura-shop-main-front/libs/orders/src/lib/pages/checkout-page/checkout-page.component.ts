import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '@furnitura/users';
import { Subject, take, takeUntil } from 'rxjs';
import { Cart } from '../../models/cart';
import { Order } from '../../models/order';
import { OrderItem } from '../../models/order-item';
import { ORDER_STATUS } from '../../order.constants';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'orders-checkout-page',
  templateUrl: './checkout-page.component.html',
  styles: [
  ]
})
export class CheckoutPageComponent implements OnInit, OnDestroy {

  checkoutFormGroup: FormGroup;
  isSubmitted = false;
  orderItems: OrderItem[] = [];
  userId: string;
  unsubscribe$: Subject<void> = new Subject(); 


  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private cartService: CartService,
    private orderServie: OrdersService
  ) { }

  ngOnInit(): void {
    this._initCheckoutForm();
    this._autoFillUserData();
    this._getCartItems(); 
  }

  ngOnDestroy(): void {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
  }

  backToCart()
  {
    this.router.navigate(['/cart']);
  }

  get checkoutForm() {
    return this.checkoutFormGroup.controls;
  }

  private _initCheckoutForm() {
    this.checkoutFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required ],
      city: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', Validators.required],
      apartment: ['', Validators.required],
      street: ['', Validators.required]
    });
  }

  private _autoFillUserData()
  {
    this.usersService.observeCurrentUser().pipe(takeUntil(this.unsubscribe$)).subscribe(responseUser => {
      if(responseUser)
      {
        this.userId = responseUser._id;
        this.checkoutForm.name.setValue(responseUser.name);
        this.checkoutForm.email.setValue(responseUser.email);
        this.checkoutForm.phone.setValue(responseUser.phone);
        responseUser.city       == " " ? this.checkoutForm.city.setValue("") : this.checkoutForm.city.setValue(responseUser.city);
        responseUser.zip        == " " ? this.checkoutForm.zip.setValue("") : this.checkoutForm.zip.setValue(responseUser.zip);
        responseUser.apartment  == " " ? this.checkoutForm.apartment.setValue("") : this.checkoutForm.apartment.setValue(responseUser.apartment);
        responseUser.street     == " " ? this.checkoutForm.street.setValue("") : this.checkoutForm.street.setValue(responseUser.street);
        responseUser.country     == " " ? this.checkoutForm.country.setValue("") : this.checkoutForm.country.setValue(responseUser.country);
      }
    },);
  }

  private _getCartItems()
  {
    const cart: Cart = this.cartService.getCart();
    this.orderItems = cart.items.map( (item) => { //mapping between the cart product item and the order item as they dont have the same model
      return{
        product: item.productId,
        quantity: item.quantity
      }
    });
  }

  placeOrder()
  {
    this.isSubmitted = true;
    if(this.checkoutFormGroup.invalid)
    {
      return;
    }

    const order: Order =
    {
      orderItems:        this.orderItems,
      shippingAddress1:  this.checkoutForm.street.value,
      // shippingAddress2:  this.checkoutForm.apartment.value,
      city:              this.checkoutForm.city.value,
      zip:               this.checkoutForm.zip.value,
      country:           this.checkoutForm.country.value,
      phone:             this.checkoutForm.phone.value,
      status:            0,
      user:              this.userId,
      // dateOrdered:       `${Date.now()}`
    }

    this.orderServie.createOrder(order).subscribe( () => {
      this.router.navigate(['/success']);
      this.cartService.emptyCart();
    });
  }

}
