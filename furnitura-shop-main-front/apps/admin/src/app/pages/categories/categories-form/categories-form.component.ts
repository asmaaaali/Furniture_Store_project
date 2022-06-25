import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category } from '@furnitura/products';
import {MessageService} from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'admin-categories-form',
  templateUrl: './categories-form.component.html',
  styles: [
  ]
})
export class CategoriesFormComponent implements OnInit, OnDestroy {

  form: FormGroup;
  isSubmitted = false;
  editMode = false;
  currentCategoryID:string;
  endsubs$: Subject<void> = new Subject();

  constructor(
    private formBuilder: FormBuilder, 
    private categoriesService : CategoriesService, 
    private messageService: MessageService,
    private location : Location,
    private route : ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      color: ['black']
    });

    this._checkEditMode();
  }

  ngOnDestroy(): void {
      this.endsubs$.next();
      this.endsubs$.complete();
  }

  onSubmit()
  {
    if(this.form.valid)
    {
      const category: Category = this._getCategoryFromForm;     
      
      if(this.editMode)
      {
        this._UpdateCategory(category);
      }
      else
      {
        this._AddCategory(category);
      }
    }
    else
    this.isSubmitted = true; //activate the required validation
  }

  onCancel()
  {
    timer(750).toPromise().then(() => {
      this.location.back();
    });
  }

  get categoryForm()
  {
    return this.form.controls;
  }

  private get _getCategoryFromForm()
  {
    const category: Category = 
    {
      name: this.categoryForm.name.value,
      color: this.categoryForm.color.value
    }
    return category;
  }

  private _checkEditMode()
  {
    this.route.params.pipe(takeUntil(this.endsubs$)).subscribe( params => {
      if(params.id)
      {
        this.editMode = true;
        this.currentCategoryID = params.id;
        this._fetchCategoryData(this.currentCategoryID);
      }
    })
  }

  private _fetchCategoryData(categoryID: string)
  {
    this.categoriesService.getCategory(categoryID).pipe(takeUntil(this.endsubs$)).subscribe( category => {
      this.categoryForm.name.setValue(category.name);
      this.categoryForm.color.setValue(category.color)
    });
  }

  private _AddCategory(category: Category)
  {
    this.categoriesService.createCategory(category).pipe(takeUntil(this.endsubs$)).subscribe((category:Category) => {
      this._successBehavior(category);
    },
    () => {
      this._failBehavior();
    });
  }

  private _UpdateCategory(category: Category)
  {
    this.categoriesService.updateCategory(category,this.currentCategoryID).pipe(takeUntil(this.endsubs$)).subscribe((category:Category) => {
      this._successBehavior(category);
    },
    () => {
      this._failBehavior();
    });
  }

  private _successBehavior(category:Category)
  {
    this.messageService.add({
      severity:'success', 
      summary:'Success', 
      detail:`${this.editMode ? `Category ${category?.name} Is Updated` : `Category ${category?.name} Is Created`}`
    });
    timer(2000).toPromise().then(() => {
      this.location.back();
    });
  }

  private _failBehavior()
  {
    this.messageService.add({
      severity:'error', 
      summary:'Fail', 
      detail:`${this.editMode ? 'Category Is not Updated' : 'Category Is not Created'}`
    });
  }

}
