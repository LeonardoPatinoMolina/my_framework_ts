import { MyGlobalStore } from "./myGlobalStore";
import { ActionT, ReducerI, ShelfConfigI, ShelfReturnI } from "./types/myShelf.types";

export class MyShelf<T> {
  private keyStore: string;

  private _data: T;
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
    this._actions = Object.entries(reducers).reduce((acc, [k, v]) => ({
      ...acc,
      [`${k}Dispatch`]: (payload: any) => {
        this._data = v(this._data, payload);
        MyGlobalStore.dispatch(this.keyStore);
      }
    }), {} as typeof this._actions); //end reduce
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
 * use en el store
 */
export const createShelf = <T = any>(args: ShelfConfigI<T>): ShelfReturnI<T> => {
  const newShelf = new MyShelf<T>(args);
  return {
    name: newShelf.name,
    shelf: newShelf,
    actions: newShelf.actions,
  };
};