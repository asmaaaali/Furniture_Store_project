import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart } from '../models/cart';
import { CartItem } from '../models/cartItem';

export const CART_KEY = 'cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart$: BehaviorSubject<Cart> = new BehaviorSubject(this.getCart());

  constructor() { }

  initCartLocalStorage()
  {
    const cart: Cart = this.getCart();
    if(!cart)
    {
      const intialCart = 
      {
        items: []
      };
      const intialCartJson = JSON.stringify( intialCart );
      localStorage.setItem(CART_KEY, intialCartJson);
    }
    else
    {
      this.cart$.next(cart);
    }
  }

  getCart() : Cart
  {
    const cart: Cart = JSON.parse( localStorage.getItem(CART_KEY));
    // const cart: Cart = JSON.parse( localStorage.getItem(CART_KEY) || '{"items":[]}');
    return cart;
  }

  setCartItem(cartItem: CartItem, updateCartItem?: boolean): Cart
  {
    const cart = this.getCart();

    const cartItemExist = cart.items?.find(product => product.productId === cartItem.productId);
    if(cartItemExist)
    {
      cart.items?.map(item => {
        if(item.productId === cartItem.productId)
        {
          if(updateCartItem)
          {
            item.quantity = cartItem.quantity;
          }
          else
          {
            item.quantity += cartItem.quantity; 
          }
          return item;
        }
      })
    }
    else
    {
      cart.items?.push(cartItem);
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    this.cart$.next(cart); //publishing the event (Subject)
    return cart;
  }

  deleteCartItem(productId : string)
  {
    const cart = this.getCart();

    const newCart = cart.items.filter( item => item.productId !== productId);

    cart.items = newCart;

    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    this.cart$.next(cart);
  }

  emptyCart()
  {
    const intialCart = 
      {
        items: []
      };
      localStorage.setItem(CART_KEY, JSON.stringify(intialCart));

      this.cart$.next(intialCart);
  }
}
