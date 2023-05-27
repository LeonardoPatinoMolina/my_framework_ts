import { cloneDeep } from '../shared/cloneDeep';
import { MyGlobalStore } from "./myGlobalStore";
import { ActionT, ReducerI, ShelfConfigI, ShelfReturnI } from "./types/myShelf.types";
export class MyShelf<T> {
  private keyStore: string;

  /**
   * Datos puntuales del shelf
   */
  private _data: T;
  /**
   * Funciones disparadoras declarados en el reducer del 
   * shelf
   */
  private _actions: { [key: string]: ActionT<T> };

  constructor({
    name,
    initialData,
    reducers,
  }: {
    name: string;
    initialData: T;
    reducers: ReducerI<T>;
  }) {
    this.keyStore = name;
    this._data = initialData;

    //generamos todos las funciones disparadoras
    //partiendo de los reducers configurados
    this._actions = Object.entries(reducers).reduce((acc: any, [k, v]) => {
      acc[`${k}Dispatch`] = (payload: any) => {
        this._data = v(cloneDeep(this._data), payload);
        MyGlobalStore.dispatch(this.keyStore);
      }
      return acc;
    }, {} as typeof this._actions); //end reduce
  }//end constructor

  get name() {
    return this.keyStore;
  }
  get actions() {
    return this._actions;
  }
  get data() {
    return this._data;
  }
}

/**
 * Función factory encargada de crear un nuevo shelf para su posterior 
 * uso en el store
 */
// export const createShelf = <T = any>(args: ShelfConfigI<T>): ShelfReturnI<T> => {
export const createShelf = <T = any>(args: ShelfConfigI<T>): ShelfReturnI<T> => {
  const newShelf = new MyShelf<T>(args);
  return {
    name: newShelf.name,
    shelf: newShelf,
    actions: newShelf.actions,
  };
};