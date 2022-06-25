import { Component, Input, OnInit } from '@angular/core';
import { Cart, CartItem, CartService } from '@furnitura/orders';
import { Product } from '../../models/product';

@Component({
  selector: 'products-product-item',
  templateUrl: './product-item.component.html',
  styles: [
  ]
})
export class ProductItemComponent implements OnInit {

  @Input() product: Product;

  constructor(
    private cartService: CartService
  ) { }

  ngOnInit(): void {
  }

  addProductToCart()
  {
    const cartItem: CartItem = 
    {
      productId: this.product._id,
      quantity: 1
    }

    this.cartService.setCartItem(cartItem);
  }


}
