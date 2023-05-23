import { MyDOM } from "../core/myDOM.ts";
import { MyCentralService } from "../service/myCentralService.ts";
import { _404Module } from "../template/404/404.module.ts";
import { RoutesI } from "./types/myRouter.types.ts";

export class MyRouter {
  static instanceRouter: MyRouter;

  /**
   * Params declarados en su respectiva ruta, corresponde a la key empleada 
   * para declarar un param en una ruta
   */
  private paramRoutes: Map<string, string[]> = new Map()
 
  /**
   * Modulo de página notFound encargada de renderizarse cuando no se 
   * intenta navegar a una ruta desconocida
   */
  private notFound?: any;

  /**
   * Página que se encuentra actualmente renderizada, corresponde al
   * module actual
   */
  currentPage!: any;

  /**
   * Páginas dispuestas al enrutamiento, corresponde a los módulos asociados a una ruta
   * en el enrutador
   */
  pages!: Map<string, any>;

  constructor(args?: {routes: RoutesI[], notFound?: any}){
    if(!!MyRouter.instanceRouter){
      return MyRouter.instanceRouter;
    }

    //obtenemos los params de cada ruta y 
    //nos deshacemos de su declaración
    const newPages = new Map()
    args?.routes.forEach((route)=>{
      newPages.set(route.path, route.modulePage);

      this.paramRoutes.set(route.path,route.params ?? []);
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
    
    MyDOM.clearDOM();
    MyCentralService.clearServices();
    const newPage = page ?? this.notFound;
    MyDOM.renderTree(newPage);
  }

  /**
   * Método encargado de navegar a otra página
   */
  static go(path: string, params: any[]): void{
    const router = new MyRouter();
    if(!router.pages.has(path)) return;

    window.history.pushState({path, params}, path, window.location.origin + path);
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
    const routes = router.paramRoutes.get(hState?.path);

    //creamos un objeto a partir de las rutas y los params asociados
    //esto es posible gracias a que el orden de los
    //elementos es equivalente en ambos arreglos
    const params =  routes?.reduce((acc, cur, indx) => {
      return { ...acc, [cur]: hState.params[indx] };
    }, {});

    return params;
  }
}