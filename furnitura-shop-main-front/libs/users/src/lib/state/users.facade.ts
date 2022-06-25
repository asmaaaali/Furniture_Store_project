import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as UsersActions from './users.actions';
import * as UsersSelectors from './users.selectors';

@Injectable()
export class UsersFacade { //Fascade is for beautifying the code
    
    //Calling a Selector => select
    currentUser$ = this.store.pipe(select(UsersSelectors.getUser));
    isAuthenticated$ = this.store.pipe(select(UsersSelectors.getUserIsAuth));

    constructor(private readonly store: Store) {}

    //Calling an Action => dispatch
    buildUserSession() {
        this.store.dispatch(UsersActions.buildUserSession());
        //on build User Session 
        //=> affects will observe the action 
        //=> returns a success or fail action 
        //=> the reducer takes the action and the store initial state and decide upon that. (alter the state or leave as its)   
    }
}
