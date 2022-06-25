import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsSearchComponent } from './components/products-search/products-search.component';
import { CategoriesBannerComponent } from './components/categories-banner/categories-banner.component';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { FeaturedProductsComponent } from './components/featured-products/featured-products.component';
import { ProductsListComponent } from './pages/products-list/products-list.component';

import { RouterModule, Routes } from '@angular/router';

import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';

import {ToastModule} from 'primeng/toast';
import { ProductPageComponent } from './pages/product-page/product-page.component';

import {RatingModule} from 'primeng/rating';
import {InputNumberModule} from 'primeng/inputnumber';

const routes: Routes =[
  {
    path: 'products',
    component: ProductsListComponent
  },
  {
    path: 'categories/:categoryid',
    component: ProductsListComponent
  },
  {
    path: 'products/:productid',
    component: ProductPageComponent
  }
]


@NgModule({
    imports: [
      CommonModule, 
      RouterModule.forChild(routes),
      FormsModule,
      ButtonModule,
      CheckboxModule,
      ToastModule,
      RatingModule,
      InputNumberModule
    ],
    declarations: [
      ProductsSearchComponent,
      CategoriesBannerComponent,
      ProductItemComponent,
      FeaturedProductsComponent,
      ProductsListComponent,
      ProductPageComponent,
    ],
    exports:[
      ProductsSearchComponent, 
      CategoriesBannerComponent, 
      ProductItemComponent, 
      FeaturedProductsComponent, 
      ProductsListComponent, ProductPageComponent
    ]
})
export class ProductsModule {}
