import { MyShelf } from "@my_framework/store/myShelf";

/**
 * interfa para funciones reductoras
 */
export interface ReducerI<T> {
  [key: string]: (data: T, payload: any) => T;
}

export type ActionT<T = any> = (payload: T)=> void;

export interface ShelfReturnI<T> {
  name: string;
  shelf: MyShelf<T>;
  actions: { [x: string]: ActionT };
}
export interface ShelfConfigI<T> {
  name: string;
  initialData: T;
  reducers: ReducerI<T>;
}