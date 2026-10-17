import { createAction, props } from '@ngrx/store';
export const addItem = createAction('[Cart] Add Item', props<{ code: string; price: number }>());
export const removeItem = createAction('[Cart] Remove Item', props<{ code: string }>());
