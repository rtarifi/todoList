import { createAction } from '@ngrx/store';

export const setToken = createAction('setToken', (token: string) => ({token}));