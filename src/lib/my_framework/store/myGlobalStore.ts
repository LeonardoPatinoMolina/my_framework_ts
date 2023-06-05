import { cloneDeep } from "@my_framework/shared/cloneDeep";
import { MyShelf } from "./myShelf";
import { ObserverI } from "./types/myGlobalStore.types";

export class MyGlobalStore {
  static globalStoreInstance: MyGlobalStore;
  /**
   * Almacén principal del store global encargado de guardar cada shelf
   * declarado
   */
  private store: Map<string, MyShelf<any>> = new Map();
  /**
   * Componentes observadores susbcritos a un shelf particular
   */
  private observers: Map<string, Set<ObserverI>> = new Map();

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
      obs.forEach((o) => {
        //notificamos el cambio a los observers
        o?.storeNotify({data: cloneDeep(sh?.data), shelf: shelfName});
      });
    }
  } //end dispatch

  /**
   * Método encargado de obtener un shelf en base a su respectivo nombre
   * @returns 
   */
  private getShelf(shlefName: string): MyShelf<any> | undefined{
    const shelf = this.store.get(shlefName);
    return shelf;
  }
  /**
   * Método que subscribe componentes al store global
   * @returns Retorna un valor clonado de los datos actuales del shelf, esto para asegurar la consistencia 
   * en los datos suministrados a través de la store global, en otras palabras, esto no es una referencia, si desea mantener actualizados los datos debe establecer los nuevos datos a tavés del método storeNotify del observer
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
    } else{
      gStore.observers.set(shelfName, new Set<ObserverI>().add(observer));
    }
    return cloneDeep(myShelf.data);
      
  } //end subscribe

  /**
   * Método que des des-subscribe un componentes del store global,
   *  en caso de desubscribirlo correctamente retorna true, en caso de no encontrar el componente retorna false
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