import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartItemDetailed } from '../../models/cartItemDetailes';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'orders-cart-page',
  templateUrl: './cart-page.component.html',
  styles: [
  ]
})
export class CartPageComponent implements OnInit, OnDestroy {
  
  cartItemsDetailed : CartItemDetailed[] = [];
  cartCount = 0;
  endSubs$ : Subject<any> = new Subject();

  constructor(
    private router: Router,
    private cartService: CartService,
    private ordersService : OrdersService //fix the circular dependency problem
  ) { }

  ngOnInit(): void {
    this._getCartDetails();
  }

  ngOnDestroy(): void {
    this.endSubs$.next("");
    this.endSubs$.complete();
  }

  backToShop()
  {
    this.router.navigate(['./products']);
  }

  deleteCartItem(cartItem : CartItemDetailed)
  {
    this.cartService.deleteCartItem(cartItem.product._id);
  }

  private _getCartDetails()
  {
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe((responseCart) => {  //subscription
      this.cartItemsDetailed = [];
      this.cartCount = responseCart?.items?.length ?? 0;
      responseCart.items.forEach( cartItem => {
        this.ordersService.getProduct(cartItem.productId).subscribe((responseProduct) => {
          this.cartItemsDetailed.push({
            product: responseProduct,
            quantity: cartItem.quantity
          });
        });
      });
    });
  }

  updateCardItemQuantity(event, cartItem: CartItemDetailed)
  {
    this.cartService.setCartItem({
      productId: cartItem.product._id,
      quantity: event.value
    },true);
  }

}
