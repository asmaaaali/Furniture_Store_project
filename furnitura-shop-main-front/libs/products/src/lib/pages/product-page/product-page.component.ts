import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem, CartService } from '@furnitura/orders';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'products-product-page',
  templateUrl: './product-page.component.html',
  styles: [
  ]
})
export class ProductPageComponent implements OnInit, OnDestroy {

  product: Product;
  quantity= 1;

  endsubs$: Subject<void> = new Subject;

  constructor(
    private prodService: ProductsService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.endsubs$)).subscribe(resParams => {
      if(resParams.productid)
      {
        this._getProduct(resParams.productid);
      }
    });
  }

  ngOnDestroy(): void {
      this.endsubs$.next();
      this.endsubs$.complete();
  }

  private _getProduct(productid: string)
  {
    this.prodService.getProduct(productid).pipe(takeUntil(this.endsubs$)).subscribe(resProd => {
      this.product = resProd;
      console.log(this.product);
    });
  }

  addProductToCart()
  {
    const cartItem: CartItem = 
    {
      productId: this.product._id,
      quantity: this.quantity
    }

    this.cartService.setCartItem(cartItem);
  }
}
