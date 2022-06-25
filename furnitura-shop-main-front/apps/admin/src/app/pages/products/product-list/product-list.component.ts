import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService, Product, ProductsService } from '@furnitura/products';
import {MessageService, ConfirmationService} from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'admin-product-list',
  templateUrl: './product-list.component.html',
  styles: [
  ]
})
export class ProductListComponent implements OnInit, OnDestroy {

  products :Product[] = [];
  endsubs$: Subject<void> = new Subject();

  constructor(
    private productService : ProductsService,
    private router : Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private categoryService: CategoriesService
  ) { }

  ngOnInit(): void {
    this._getProducts();
  }

  ngOnDestroy(): void {
      this.endsubs$.next();
      this.endsubs$.complete();
  }

  private _getProducts()
  {
    this.productService.getProducts().pipe(takeUntil(this.endsubs$)).subscribe( response => {
      this.products = response;
    });
  }

  updateProduct(productID:string)
  {
    this.router.navigateByUrl(`products/form/${productID}`);
  }

  confirmDelete(event: Event,productID:string) {
    this.confirmationService.confirm({
        target: event.target,
        message: 'Are you sure that you want to delete this Product?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._acceptDeleteBehavior(productID);
        }
    });
  }

  private _acceptDeleteBehavior(productID:string)
  {
    this.productService.deleteProduct(productID).pipe(takeUntil(this.endsubs$)).subscribe( () => {
      this._getProducts();
      this.messageService.add({
        severity:'success', 
        summary:'Success', 
        detail:'Product Is Deleted'
      });
      }, 
      () => {
        this.messageService.add({
          severity:'error', 
          summary:'Fail', 
          detail:'Product Is not Deleted'
        });
      });
  }

}
