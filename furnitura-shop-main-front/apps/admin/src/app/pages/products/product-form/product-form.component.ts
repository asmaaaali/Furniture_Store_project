import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category, Product, ProductsService } from '@furnitura/products';
import {MessageService} from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';



@Component({
  selector: 'admin-product-form',
  templateUrl: './product-form.component.html',
  styles: [
  ]
})
export class ProductFormComponent implements OnInit, OnDestroy {

  form: FormGroup;
  editMode = false;
  isSubmitted = false;
  categories: Category[] = [];
  imageDisplay: string | ArrayBuffer;
  currentProductID: string;
  endsubs$: Subject<void> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private categoriesService : CategoriesService,
    private productService : ProductsService,
    private messageService: MessageService,
    private location : Location,
    private route : ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._initForm();
    this._getCategories(); 
    this._checkEditMode();
  }

  ngOnDestroy(): void {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  get productForm()
  {
    return this.form.controls;
  }

  private _initForm()
  {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      countInStock: ['', Validators.required],
      description: ['', ],
      richDescription: [''],
      image: ['', Validators.required],
      isFeatured: [false]
    });
  }

  private _getCategories()
  {
    this.categoriesService.getCategories().pipe(takeUntil(this.endsubs$)).subscribe( response => {
      this.categories = response;
    });
  }

  private _checkEditMode()
  {
    this.route.params.pipe(takeUntil(this.endsubs$)).subscribe( params => {
      if(params.id)
      {
        this.editMode = true;
        this.currentProductID = params.id;
        this._fetchProductData(this.currentProductID);
      }
    })
  }

  private _fetchProductData(productID: string)
  {
    this.productService.getProduct(productID).pipe(takeUntil(this.endsubs$)).subscribe( product => {
      this.productForm.name.setValue(product.name);
      this.productForm.brand.setValue(product.brand);
      this.productForm.price.setValue(product.price);
      this.productForm.category.setValue(product.category?._id);
      this.productForm.countInStock.setValue(product.countInStock);
      this.productForm.isFeatured.setValue(product.isFeatured);
      this.productForm.description.setValue(product.description);
      this.productForm.richDescription.setValue(product.richDescription);
      this.imageDisplay = product.image;

      this.productForm.image.setValidators([]);
      this.productForm.image.updateValueAndValidity();
    });
  }

  onImageUpload(event)
  {
    const file = event.target.files[0];
    if(file)
    {
      this.form.patchValue({image: file});
      this.form.get("image").updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.onload = () => //Event Executes After Reading the Data 
      {
        this.imageDisplay = fileReader.result;
      }
      fileReader.readAsDataURL(file);
    }
  }

  onSubmit()
  {
    this.isSubmitted = true;

    if(this.form.invalid)
    return;

    const productFormData = new FormData();

    Object.keys(this.productForm).map((key) => {
      productFormData.append(key, this.productForm[key].value);
    });

    if(this.editMode)
    {
      this.updateProduct(productFormData);
    }
    else
    {
      this._addProduct(productFormData);
    }

  }

  private updateProduct(productdata: FormData)
  {
    this.productService.updateProduct(productdata,this.currentProductID).pipe(takeUntil(this.endsubs$)).subscribe((product:Product) => { 
      this._successBehavior(product);
    },
    () => {
      this._failBehavior();
    });
  }

  private _addProduct(productData: FormData)
  {
    this.productService.createProduct(productData).pipe(takeUntil(this.endsubs$)).subscribe((product:Product) => {
      this._successBehavior(product);
    },
    () => {
      this._failBehavior();
    });
  }

  private _successBehavior(product:Product)
  {
    this.messageService.add({
      severity:'success', 
      summary:'Success', 
      detail:`${this.editMode ? `Product ${product.name} Is Updated` : `Product ${product.name} Is Created`}`
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

  onCancel()
  {
    timer(750).toPromise().then(() => {
      this.location.back();
    });
  }
  
}
