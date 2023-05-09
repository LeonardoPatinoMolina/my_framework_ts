import { MyComponent } from "./myComponent.ts";
   interface Reducer {
    [x: string]: (data: any, payload: any)=>void
  }
   type Action = (payload: any)=>void;

export class MyGlobalStore {
  static globalStoreInstance: MyGlobalStore;

  store: Map<string, MyShelf> = new Map();
  observers: Map<string, Set<MyComponent>> = new Map();

  constructor() {
    if (!!MyGlobalStore.globalStoreInstance) {
      return MyGlobalStore.globalStoreInstance;
    }
    MyGlobalStore.globalStoreInstance = this;
  }
  /**
   * Establece la configuración egenral de la store global
   */
  static configStore(config: {reducers: {[x: string]: MyShelf}}): ()=>void {
    return ()=>{
      const gStore = new MyGlobalStore();
      gStore.store = new Map(Object.entries(config.reducers));
    }
  }

  /**
   * Método encargado de despachar los eventos
   * de actualización en base a un reducerPath
   * @param {string} shelfName
   */
  static dispatch(shelfName: string) {
    const gStore = new MyGlobalStore()
    const obs = gStore.observers.get(shelfName)
    if(obs){
      gStore.observers.get(shelfName)?.forEach(o=>{
        //forzamos un actualización de los observers
        o.update(()=>{}, true)
      });
    }
  }//end dispatch

  /**
   * Método que subscribe componentes al store global
   */
  static subscribe(shelfName: string, observer: MyComponent){
    const gStore = new MyGlobalStore();
    const myStore = gStore.store.get(shelfName);
    if(myStore){
      const obs = gStore.observers.get(shelfName);
      if(obs){
        obs.add(observer);
      }else gStore.observers.set(shelfName, new Set<MyComponent>().add(observer))
      // gStore.observers.set(shelfName,  obs.set ;
      if(observer.globalStore){
        observer.globalStore = {
          ...observer.globalStore,
          [myStore.name]: myStore.data
        };
      }else{
        observer.globalStore = {[myStore.name]: myStore.data}
      }
      return myStore.data;

    }else throw new Error(`store inexistente: la store identificada con el nombre ${shelfName} no existe`);
  }//end subscribe
}//end calss

class MyShelf {

  private keyStore: string;

  private _data: any;
  private _actions: {[x: string]: Action};

  /**
   * @param {} args
   */
  constructor({ name, initialData, reducers }: {name: string, initialData?: any, reducers: Reducer}) {
    this.keyStore = name;
    this._data = initialData;

    //generamos todos las funciones disparadoras
    //partiendo de los reducers configurados
     const actionsArr: any[] = Object.entries(reducers).map(([k, v]) => {
      return {
        [`${k}Dispatch`]: (payload: any) => {
          v(this._data, payload);
          MyGlobalStore.dispatch(this.keyStore);
        },
      };
    })//end map
  
    //convertimo sel arreglo de objetos en un solo objeto
    this._actions = actionsArr.reduce((acc, cur) => {
      return { ...acc, ...cur };
    }, {});
  }

  get name(){
    return this.keyStore;
  }
  get actions(){
    return this._actions;
  }
  get data(){
    return this._data
  }
}

interface ShelfConfigI{
  name: string, 
  initialData: any, 
  reducers: Reducer
}

interface shelfReturnI {name: string, shelf: MyShelf, actions: {[x: string]: Action}}
/**
 */
export const createShelf = (args: ShelfConfigI): shelfReturnI => {
  const newShelf = new MyShelf(args)
  return {
    name: newShelf.name,
    shelf: newShelf,
    actions: newShelf.actions
  }
};