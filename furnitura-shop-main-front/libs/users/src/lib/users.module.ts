import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ImageModule } from 'primeng/image';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromUsers from './state/users.reducer';
import { UsersEffects } from './state/users.effects';
import { UsersFacade } from './state/users.facade';
import {CardModule} from 'primeng/card';
import {InputMaskModule} from 'primeng/inputmask';

import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UserInfoComponent } from './components/user-info/user-info.component';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        InputTextModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        ImageModule,
        CardModule,
        InputMaskModule,
        ToastModule,
        RouterModule.forChild(routes),
        StoreModule.forFeature(fromUsers.USERS_FEATURE_KEY, fromUsers.reducer),
        EffectsModule.forFeature([UsersEffects])
    ],
    declarations: [LoginComponent, RegisterComponent, UserInfoComponent],
    providers: [UsersFacade, MessageService],
    exports: [
      RegisterComponent,
      LoginComponent,
      UserInfoComponent
    ]
})
export class UsersModule {}
