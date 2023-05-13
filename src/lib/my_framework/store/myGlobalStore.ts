import { MyShelf } from "./myShelf";
import { ObserverI } from "./types/myGlobalStore.types";

export class MyGlobalStore {
  static globalStoreInstance: MyGlobalStore;

  store: Map<string, MyShelf<any>> = new Map();
  observers: Map<string, Set<ObserverI>> = new Map();
  observersN: Map<string, Set<string>> = new Map();

  constructor() {
    if (!!MyGlobalStore.globalStoreInstance) {
      return MyGlobalStore.globalStoreInstance;
    }
    MyGlobalStore.globalStoreInstance = this;
  }
  /**
   * Establece la configuración egenral de la store global
   */
  static configStore(config: {
    reducers: { [key: string]: MyShelf<any> };
  }): () => void {
    return () => {
      const gStore = new MyGlobalStore();
      gStore.store = new Map(Object.entries(config.reducers));
    };
  }

  /**
   * Método encargado de despachar los eventos
   * de actualización en base a un reducerPath
   */
  static dispatch(shelfName: string): void {
    const gStore = new MyGlobalStore();
    const obs = gStore.observers.get(shelfName);
    if (obs) {
      const sh = gStore.getShelf(shelfName);
      gStore.observers.get(shelfName)?.forEach((o) => {
        //forzamos un actualización de los observers
        o.storeNotify({data: sh?.data, shelf: shelfName});
      });
    }
  } //end dispatch

  private getShelf(shlefName: string): MyShelf<any> | undefined{
    const shelf = this.store.get(shlefName);
    return shelf;
  }
  /**
   * Método que subscribe componentes al store global
   */
  static subscribe<T = any>(shelfName: string, observer: ObserverI): T {
    const gStore = new MyGlobalStore();
    const myShelf = gStore.store.get(shelfName);
    if (!myShelf) throw new Error(
      `store inexistente: la store identificada con el nombre ${shelfName} no existe`
    );

    const obs = gStore.observers.get(shelfName);
    if (obs) {
      obs.add(observer);
    } else
      gStore.observers.set(shelfName, new Set<ObserverI>().add(observer));
    return myShelf.data;
      
  } //end subscribe

  /**
   * Método que des subscribe un componentes del store global,
   *  en caso de desubscribirlo correctamente retorna true, en caso de no encontrar el componente
   */
  static unSubscribe(shelfName: string, observer: ObserverI): boolean {
    const gStore = new MyGlobalStore();
    const myShelf = gStore.store.get(shelfName);
    if (!myShelf)
      throw new Error(
        `Shelf inexistente: el shelf identificado con el nombre ${shelfName} no existe`
      );

    const obs = gStore.observers.get(shelfName);
    if (!obs)
      throw new Error(
        `Shelf sin subscriptores: el shelf identificado con el nombre ${shelfName} no posee ningún subscriptor`
      );
    return obs.delete(observer);
  } //end subscribe
} //end calss


