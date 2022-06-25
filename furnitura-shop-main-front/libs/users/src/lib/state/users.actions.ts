import { createAction, props } from '@ngrx/store';
import { User } from '../models/user';


export const buildUserSession = createAction('[users] Build User Session');

export const buildUserSessionSuccess = createAction(
    '[users] Build User Session Success', 
    props<{ user: User }>()
);

export const buildUserSessionFailed = createAction('[users] Build User Session Failed');
