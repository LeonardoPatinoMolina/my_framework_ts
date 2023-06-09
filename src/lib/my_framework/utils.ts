
//utilidades destinadas a proyectos venideros com my framework
type OptionsCacheInterceptor = {cacheName: string, revalidate: number}
type OptionsIndxDBInterceptor = {storeName: string, revalidate?: number, dbName: string}
/**
 * Función encargada de realizar consultas a servicios api,
 * mientras las almacena en cache para evitar sobre carga de consultas
 * @param urlResponse ruta de consulta de la consulta
 * @param options cacheName: es el nombre del storge donde se almacena la cache,
 * revalidate:  es el tiempo en minutos que debe transcurrir para que la consulta almacenada en cache sea actualizada con otra consulta
 */
export const fetchCacheInterceptor = async (
  urlResponse: string,
  { cacheName, revalidate }: OptionsCacheInterceptor
): Promise<JSON> => {
  try {
    //verificamos si la ultima consulta de este url tiene tiempo
    //suficiente para ser revalidada, para ello llevamos un
    //control del tiempo con el local storage
    const confirmDate = window.localStorage.getItem(`timeof_${urlResponse}`);
    let isOutTime = false;
    if (confirmDate === null)
      window.localStorage.setItem(`timeof_${urlResponse}`, `${Date.now()}`);
    else if (Date.now() - parseInt(confirmDate) > 1000 * 60 * 60 * revalidate) {
      isOutTime = true;
    }

    const cache = await window.caches.open(cacheName);
    const resCache = await cache.match(urlResponse);
    if (!resCache || isOutTime) {
      window.localStorage.setItem(`timeof_${urlResponse}`, `${Date.now()}`);
      const req = await fetch(urlResponse);
      const responseToReturn = await req.json();
      //creamos un clon de la respuesta para poder resolverla
      //y al mimso tiempo almacenarla en cache, esto debido
      //a que el body de un objeto Response solo puede
      //leerse una vez
      const responseToCache = new Response(JSON.stringify(responseToReturn), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
      await cache.put(urlResponse, responseToCache);
      return responseToReturn;
    } else {
      return await resCache.json();
    }
  } catch (error) {
    alert(`${error}`);
    throw error;
  }
}; //end fetchCacheInterceptor


/**
 * @classdesc clase encargaada de administrar fetching de datos
 * a una url persistieendo el resulado en una indexedDB para 
 * evitar sobreconsultas
 */
export class FetchingPI {
  /** Nombre de la base de datos donde se almacenan los datos
   */
  private dbName: string;
  
  /** encargado de cancelar peticiones
   * @type {}
   */
  private abortController: AbortController = new AbortController();

  /** Nombre del storage donde se almacenan los datos
   */
  private storeName: string;

  /** Tiempo en minutos que debe transcurrir para que la consulta almacenada en cache sea actualizada con otra consulta
   */
  private revalidate: number;

  /** Ruta de consulta a fetching de datos
   */
  private urlResponse: string;
  /**
   * @param {string} urlResponse
   * @param {{dbName: string, storeName: string, revalidate?: number}} options
   */
  constructor(
    urlResponse: string,
    { dbName, storeName, revalidate = 0 }: OptionsIndxDBInterceptor
  ) {
    this.storeName = storeName;
    this.urlResponse = urlResponse;
    this.revalidate = revalidate;
    this.dbName = dbName;

  }

  /**realiza la apertura de la base de datos asegurandonos
   * que esté lista para cualquier transacción
   */
  private async dbReady(): Promise<IDBDatabase>{
    return new Promise((resolve, reject) => {
      const indxDB = window.indexedDB;
      if (!indxDB) reject(new Error("no hay indexedDB"));

      const request: IDBOpenDBRequest = indxDB.open(this.dbName, 1);
      request.onerror = (err) => {
        reject(new Error(`error al abrir base de datos: ${err}`));
      };
      request.onsuccess = () => {
        console.log("base de datos abierta");
        resolve(request.result);
      };

      /**
       *
       * @type {(event: IDBVersionChangeEvent)=>void}
       */
      request.onupgradeneeded = ({ target }) => {
        console.log("base de datos creada");
        // @ts-ignore
        target.result.createObjectStore([this.storeName]);
      };
    });
  }; //end dbready

  /**
   * Transaccion de consulta de registro en la base de datos en función a una key
   */
  private async dbTransactionGet (db: IDBDatabase, key: string): Promise<any>{
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const getRequest = store.get(key);
      getRequest.onerror = (err) => {
        reject(`error en peticion get: ${err}`);
      };
      getRequest.onsuccess = () => {
        transaction.oncomplete = () => {
          resolve(getRequest.result);
        };
      };
    });
  }; //end method

  /**
   * Transación de modificacion de registro en base de datos
   * en funcion de una key
   */
  private async dbTransactionPut(db: IDBDatabase, data: any, key: string): Promise<any>{
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const putRequest = store.put(data, key);
      putRequest.onerror = (err) => {
        reject(`error en oeticion put: ${err}`);
      };
      putRequest.onsuccess = () => {
        transaction.oncomplete = () => {
          resolve(putRequest.result);
        };
      };
    });

  }; //end method
  /**
   * Función encargada de realizar consultas a servicios api,
   * mientras las almacena en indexedDB para evitar sobre carga de consultas
   */
  async fetchPI(config: RequestInit = {}): Promise<JSON>{
    //verificamos si la ultima consulta de este url se encuentra dentro aun
    //con tiempo antes de ser relavidada
    const confirmDate = window.localStorage.getItem(`timeof_${this.urlResponse}`);
    let isOutTime = false; //true==> lista para revalidar; false==> se pospone la revalidación
    //si es la primera vez que se relaiza esta consulta guardamos el registro
    if (!confirmDate)
      {window.localStorage.setItem(`timeof_${this.urlResponse}`, `${Date.now()}`);}
    //si el tiempo transcurrido es mayor al estipulado en revalidate...
    else if (Date.now() - parseInt(confirmDate) > 1000 * 60 * 60 * this.revalidate) {
      isOutTime = true;
    }

    //consultamos la base de datos local---------------------

    const db = await this.dbReady();
    const resultGet = await this.dbTransactionGet(db, this.urlResponse);

    if (!resultGet || isOutTime) {
      try {
        const req = await fetch(this.urlResponse,{
          ...config, signal: this.abortController.signal
        });
        const response = await req.json();

        await this.dbTransactionPut(db, response, this.urlResponse);

        window.localStorage.setItem(`timeof_${this.urlResponse}`, `${Date.now()}`);
        return response;
      } catch (error) {
        console.error("fetchPersistenceInterceptor error: ", error);
        throw error;
      }
    } else {
      return resultGet;
    }
  }; //end fetchPI

  /**
   * Método encargaop de cancelar el fetching de datos
   * actual
   */
  abortFetchPI(){
    this.abortController.abort();
  }
} //end class
