import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Category } from '../../models/category';
import { Product } from '../../models/product';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styles: [
  ]
})
export class ProductsListComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  categories: Category[] = [];
  endsubs$: Subject<void> = new Subject();

  isCategoryPage = false;

  constructor(
    private productService:  ProductsService,
    private categoryService: CategoriesService,
    private route : ActivatedRoute 
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params.categoryid)
      {
        this.isCategoryPage = true;
        this._getProducts([params.categoryid]);
      }
      else
      {
        this._getProducts();
      }
    });
    
    this._getCategories();
  }

  ngOnDestroy(): void {
      this.endsubs$.next();
      this.endsubs$.complete();
  }

  private _getProducts(categoriesFilter? : string[])
  {
    this.productService.getProducts(categoriesFilter).pipe(takeUntil(this.endsubs$)).subscribe( responseProd => {
      this.products = responseProd;
    });
  }

  private _getCategories()
  {
    this.categoryService.getCategories().pipe(takeUntil(this.endsubs$)).subscribe( responseCat => {
      this.categories = responseCat;
    });
  }

  categoryFilter()
  {
    const selectedCategoriesIDs = this.categories
                                  .filter( category => category.checked)
                                  .map(category => category._id);
    
    this._getProducts(selectedCategoriesIDs);
    
  }

}
