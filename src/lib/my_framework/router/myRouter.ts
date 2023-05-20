import { MyDOM } from "../core/myDOM.ts";
import { _404Module } from "../template/404/404.module.ts";
import { RoutesI } from "./types/myRouter.types.ts";

export class MyRouter {
  static instanceRouter: MyRouter;

 private routes: Map<string, string[]> = new Map()
 
  private notFound?: any;

  currentPage!: any;

  pages!: Map<string, any>;

  constructor(args?: {routes: RoutesI[], notFound?: any}){
    if(!!MyRouter.instanceRouter){
      return MyRouter.instanceRouter;
    }

    //obtenemos los params de cada ruta y 
    //nos deshacemos de su declaración
    const newPages = new Map()
    args?.routes.forEach((route)=>{
    // this.pages.forEach((value, k)=>{
      //removemos los params de la ruta
      const newKey = route.paths.slice(0, route.paths.indexOf(':') === -1 ? route.paths.length : route.paths.indexOf(':') - 1);
      newPages.set(newKey, route.modulePage);

      //almacenamos los params de la ruta
      const ss = route.paths.slice(route.paths.indexOf(':') === -1 ? 0 :route.paths.indexOf(':'));
      //expreción regular para remover barras
      const rg = /[/]/g;
      const ns = ss.replace(rg,'').split(':');
      ns.shift();//removemos el espacio en blanco
      this.routes.set(newKey,ns);
    })//end foreach
    this.pages = newPages;
    this.notFound = args?.notFound ?? _404Module;

    window.addEventListener('popstate',()=>{
      this.renderRoute();
    });

    window.addEventListener('DOMContentLoaded',()=>{
      this.renderRoute();
    });

    MyRouter.instanceRouter = this;
  }

  private renderRoute(){
    const path = window.location.pathname;
    
    const page = this.pages.get(path);
    
    // const dom = new MyDOM();
    MyDOM.clearDOM();
    const newPage = page ?? this.notFound;
    MyDOM.renderTree(newPage);
  }

  /**
   * Método encargado de navegar a otra página
   */
  static go(path: string): void{
    //separamos los params de la ruta
    //los params están encerrados en llaves {},
    //las ubicamos y los aislamos
    const inOf_ = path.indexOf('{');
    //ruta limpiamasociada a la page
    const cleanPath = path.slice(0, inOf_ === -1 ? path.length : inOf_ -1)
    const paramsPath = path.slice(inOf_ !== -1 ? inOf_ : path.length, path.length).replace('/','');
    const params = paramsPath.split(/{|}/).filter(e=>e !== '');

    const router = new MyRouter();
    if(!router.pages.has(cleanPath)) return;

    window.history.pushState({path: cleanPath, params}, path, window.location.origin + cleanPath);
    new MyRouter().renderRoute();
  }

  /**
   * Método que navegar hacia atrás en la navegación
   */
  static back(){
    window.history.back()
  }

  /**
   * Método que navegar hacia adelante en la navegación
   */
  static next(){
    window.history.forward()
  }

  static params(): any{
    const router = new MyRouter();
    const hState = history.state;
    const routes = router.routes.get(hState?.path);

    //creamos un objeto a partir de las rutas y los params asociados
    //esto es posible gracias a que el orden de los
    //elementos es equivalente en ambos arreglos
    const params =  routes?.reduce((acc, cur, indx) => {
      return { ...acc, [cur]: hState.params[indx] };
    }, {});

    return params;
  }
}