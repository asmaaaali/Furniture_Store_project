import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/category';
import { CategoriesService } from '../../services/categories.service';


@Component({
  selector: 'products-categories-banner',
  templateUrl: './categories-banner.component.html',
  styles: [
  ]
})
export class CategoriesBannerComponent implements OnInit {

  categories: Category[] = [];

  constructor(
    private categoriesService : CategoriesService
  ) { }

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe(response => {
      this.categories = response.slice(1,7);
    });
  }

}
