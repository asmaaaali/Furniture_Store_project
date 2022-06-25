import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CartService } from './services/cart.service';
import { CartIconComponent } from './components/cart-icon/cart-icon.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';

import {BadgeModule} from 'primeng/badge';
import {ButtonModule} from 'primeng/button';
import {InputNumberModule} from 'primeng/inputnumber';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';

import {InputTextModule} from 'primeng/inputtext';
import {InputMaskModule} from 'primeng/inputmask';
import {DropdownModule} from 'primeng/dropdown';
import {InputSwitchModule} from 'primeng/inputswitch';
import {CardModule} from 'primeng/card';
import { ThankYouComponent } from './pages/thank-you/thank-you.component';
import { checkoutGuard } from '@furnitura/users';



const routes: Routes = [
    {
        path: 'cart',
        component: CartPageComponent
    },
    {
        path: 'checkout',
        canActivate: [checkoutGuard],
        component: CheckoutPageComponent
    },
    {
        path: 'success',
        component: ThankYouComponent
    }
]

@NgModule({
    imports: [
        CommonModule, 
        FormsModule,
        ReactiveFormsModule,
        BadgeModule,
        RouterModule.forChild(routes),
        ButtonModule,
        InputNumberModule,
        InputTextModule,
        InputMaskModule,
        DropdownModule,
        InputSwitchModule,
        CardModule
    ],
    declarations: [
      CartIconComponent,
      CartPageComponent,
      OrderSummaryComponent,
      CheckoutPageComponent,
      ThankYouComponent
    ],
    exports: [
        CartIconComponent,
        CartPageComponent,
        OrderSummaryComponent,
        CheckoutPageComponent,
        ThankYouComponent
    ],
    providers: [

    ]
})
export class OrdersModule {

    constructor(cartService : CartService)
    {
        cartService.initCartLocalStorage();
    }
}
