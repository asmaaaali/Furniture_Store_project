import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {CategoriesService, Category } from '@furnitura/products';
import {MessageService, ConfirmationService} from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'admin-categories-list',
  templateUrl: './categories-list.component.html',
  styles: [
  ]
})
export class CategoriesListComponent implements OnInit, OnDestroy {

  categories : Category[] = [];
  endsubs$: Subject<void> = new Subject();

  constructor(
    private categoriesService : CategoriesService, 
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router : Router
  ) { }

  ngOnInit(): void 
  {
    this._getCategories();
  }

  ngOnDestroy(): void {
      this.endsubs$.next();
      this.endsubs$.complete();
  }
  
  confirmDelete(event: Event,categoryID:string) {
    this.confirmationService.confirm({
        target: event.target,
        message: 'Are you sure that you want to delete this category?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._acceptDeleteBehavior(categoryID);
        }
    });
  }

  updateCategory(categoryID:string)
  {
    this.router.navigateByUrl(`categories/form/${categoryID}`);
  }

  private _getCategories()
  {
    this.categoriesService.getCategories().pipe(takeUntil(this.endsubs$)).subscribe( cats => {
      this.categories = cats;
    });
  }

  private _acceptDeleteBehavior(categoryID:string)
  {
    this.categoriesService.deleteCategory(categoryID).pipe(takeUntil(this.endsubs$)).subscribe( () => {
      this._getCategories();
      this.messageService.add({
        severity:'success', 
        summary:'Success', 
        detail:'Category Is Deleted'
      });
      }, 
      () => {
        this.messageService.add({
          severity:'error', 
          summary:'Fail', 
          detail:'Category Is not Deleted'
        });
      });
  }

  private _rejectDeleteBehavior()
  {
    this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected', life: 1500});
  } 

}
