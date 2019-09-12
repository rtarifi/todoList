import { createReducer, on } from '@ngrx/store';
import { setToken } from './token.actions';

export const initialState = null;

const _tokenReducer = createReducer(initialState,
  on(setToken, (state, { token }) => {
  	return token;
  })
);
 
export function tokenReducer(state, action) {
  return _tokenReducer(state, action);
}
