import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavComponent } from './shared/nav/nav.component';
import { MessagesComponent } from './messages/messages/messages.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService, JwtInterceptor, UsersModule, UsersService } from '@furnitura/users';
import { UiModule } from '@furnitura/ui';
import { OrdersModule, OrdersService } from '@furnitura/orders';
import { CategoriesService, ProductsModule, ProductsService } from '@furnitura/products';

import { EffectsModule } from '@ngrx/effects';

import { AccordionModule } from 'primeng/accordion';
import {ButtonModule} from 'primeng/button';
import {ImageModule} from 'primeng/image';
import { StoreModule } from '@ngrx/store';
import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';





const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
      path: '**',
      redirectTo: '',
      pathMatch: 'full'
  }
  
]

const UX_MODULE = [
  AccordionModule,
  ButtonModule,
  UsersModule,
  ImageModule,
  ToastModule
]

@NgModule({
  declarations: [
    AppComponent, 
    HomePageComponent, 
    HeaderComponent, 
    FooterComponent, 
    NavComponent, 
    MessagesComponent
  ],
  imports: 
  [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    UiModule,
    OrdersModule,
    ProductsModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' }),
    ...UX_MODULE,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([])
  ],
  providers: [
    CategoriesService,
    MessageService,
    ProductsService,
    UsersService,
    OrdersService,
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
