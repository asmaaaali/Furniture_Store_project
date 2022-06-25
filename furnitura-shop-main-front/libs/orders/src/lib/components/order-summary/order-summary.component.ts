import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'orders-order-summary',
  templateUrl: './order-summary.component.html',
  styles: [
  ]
})
export class OrderSummaryComponent implements OnInit, OnDestroy {

  endSubs$: Subject<any> = new Subject();
  totalPrice: number;
  isCheckout: boolean = false;
  isCartEmpty: boolean = true;
  isCheckoutBtnPressed:boolean = false;

  constructor(
    private cartService: CartService,
    private orderService: OrdersService,
    private router: Router
  ) 
  { 
    this.router.url.includes("checkout") ? this.isCheckout = true : this.isCheckout = false;
  }

  ngOnInit(): void {
    this._getOrderSummary();
  }

  ngOnDestroy(): void {
      this.endSubs$.next("");
      this.endSubs$.complete();
  }

  private _getOrderSummary()
  {
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe((responseCart) => {
      this.totalPrice = 0;
      if(responseCart)
      {
        responseCart.items.length === 0 ? this.isCartEmpty = true : this.isCartEmpty = false;
        responseCart.items.map((item) => {
          this.orderService
            .getProduct(item.productId)
            .pipe(take(1)) //=> Takes one and end the Subscription
            .subscribe((responseProduct) => {
              this.totalPrice += responseProduct.price * item.quantity;
          });
        });
      }
    });
  }

  navigateToCheckout()
  {
    this.isCheckoutBtnPressed = true;
    if(!this.isCartEmpty)
    {
      this.router.navigate(['/checkout']);
    }

  }

}
