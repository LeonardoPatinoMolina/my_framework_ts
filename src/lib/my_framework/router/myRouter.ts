import { MyDOM } from "../core/myDOM.ts";
import { MyCentralService } from "../service/myCentralService.ts";
import { _404Module } from "../template/404/404.module.ts";
import { MatchRouteI, RoutesI } from "./types/myRouter.types.ts";

export class MyRouter {
  static instanceRouter: MyRouter;
 
  /**
   * Modulo de página notFound encargada de renderizarse cuando no se 
   * intenta navegar a una ruta desconocida
   */
  private notFound?: any;

  /**
   * Ruta actualmente en función
   */
  private currentRoute?: RoutesI;

  /**
   * Rutas de páginas visitadas, el indice "0" es la página anterior, el indice "1" es la página actual
   */
  private pathVisited: string[] = ['/','/'];
  
  /**
   * Datos discretos de páginas visitadas, el indice "0" es la página anterior, el indice "1" es la página actual
   */
  private discreetVisited: any[] = [undefined,undefined];

  /**
   * Página que se encuentra actualmente renderizada, corresponde al
   * module actual
   */
  currentPage: any;

  /**
   * Params tipo slug de la página que se encuentra renderizada
   * corresponde a un objeto con el nombre del param declarado en la ruta
   * como key y el valor que le acompaña en la url
   */
  currentParamsSlug: any;
  
  /**
   * Rutas con los params y con las páginas dispuestas al enrutamiento, estas corresponden a 
   * los módulos designados como páginas a renderizar
   */
  routes!: any;

  constructor(args?: {routes: RoutesI[], notFound?: any}){
    if(!!MyRouter.instanceRouter){
      return MyRouter.instanceRouter;
    }

    this.routes = args?.routes;
    this.notFound = args?.notFound ?? _404Module;

    window.addEventListener('popstate',(e)=>{
      this.renderRoute();
    });

    window.addEventListener('DOMContentLoaded',()=>{
      this.renderRoute();
    });

    MyRouter.instanceRouter = this;
  }//end constructor

  /**
   * Método encargado de hallar la ruta coincidente y sus respectivos
   * slugPrams si los hay
   */
  matchRoute(url: string): MatchRouteI | null {
    const routes = this.routes;
    
    for (const route of routes) {
      const routeSegments = route.path.slice(1).split('/');
      const urlSegments = url.slice(1).split('/');
      //si el primer segmento es un string vacio, entonces se trata de la ruta incial
      if(urlSegments[0] === ''){
        for (const r of routes) {
          if(r.path === '/'){
            return {route: r, paramsSlug: {}}
          }
        }
      }
      //si hay una correspondencia en el tamaño de los segmentos podemos verificar 
      //si existen parametros slug  o si no existe ninguna correspondencia con las rutas definidas
      if (routeSegments.length === urlSegments.length) {
        const paramsSlug: any = {};
  
        let isMatch = true;
        for (let i = 0; i < routeSegments.length; i++) {
          if (routeSegments[i].startsWith(':')) {
            const paramName = routeSegments[i].slice(1);
            paramsSlug[paramName] = urlSegments[i];
          } else if (routeSegments[i] !== urlSegments[i]) {
            isMatch = false;
            break;// salimos del bucle si se haya una discrepancia
          }
        }
  
        if (isMatch) {
          return { route, paramsSlug };
        }
      }
    }
  
    return null; // retornamos null porque no se encontró ninguna coincidencia de ruta
  }//end matchRoute
  
  /**
   * Método encargado de renderizar el módulo correspondiente
   * a la ruta ingresada mientras verifica la existencia de interceptores
   */
  private async renderRoute(){
    const path = window.location.pathname; //ruta actual
    const mathed = this.matchRoute(path); //buscamos las coincidenciar entre las rutas declaradas
    const hState = history.state; //almacenamos el estado del historial en una constante

    //actualizamos las páginas visitadas recientemente
    this.pathVisited.push(path);
    this.pathVisited.shift();

    //actualizamos el los datos discretos de las páginas visitadas recientemente
    this.discreetVisited.push(hState?.discreet);
    this.discreetVisited.shift();
    
    //si existe una ruta actualmente referenciada, verificar si existe un interceptor out
    if(!!this.currentRoute){
      const interOutResponse = await this.interOut();
      if(interOutResponse) return; //salimos de la función, esto debido al retorno del interceptor out
    }//end if
    
    let page; // varibale auxiliar para almacenar la página final
    if(mathed === null) {//si no existe match estamos frente a una ruta desconocida
      page =  this.notFound;
      //vaciamos de la memoria los parametros slug
      this.currentParamsSlug = undefined;
    }else {
      this.currentRoute = mathed.route;
      const interInResponse = await this.interIn();
      if(interInResponse) return;//salimos de la función, esto debido al retorno del interceptor out

      page = mathed.route.modulePage;
      this.currentParamsSlug = mathed.paramsSlug;
    }
    
    //limpiamos el árbol de componentes y los servicios
    MyDOM.clearDOM();
    MyCentralService.clearServices();
    window.document.title = page.title;
    MyDOM.renderTree(page);
  }//end renderRoute

   /**
  * Método encargado de ejecutar el interceptor "out" de salida de ruta
  * @returns - retorna una promesa la cuyalva resuelve "true" si el interceptor ejecutó una operación importante, 
  * ya sea redirección o cancelación de cambio de ruta y "false" si el interceptor 
  * no le afecto significativamente
  */
  private async interOut(): Promise<boolean>{
    const router = new MyRouter();
    if(!router.currentRoute?.out) return false;
    const e = {
      discreet: router.discreetVisited[0],
      params: {
        slugs: MyRouter.paramSlug(),
        querys: MyRouter.queryParams()
      }
    }//end e
    const interOutResponse = await router.currentRoute.out(router.pathVisited[0], e);

    if(!interOutResponse) return false; 
    if(interOutResponse.cancel) {//verificar si el interceptor canceló el cambio de ruta
      //la razón detrás de declarar undefined esta propiedad es para garantizar que
      //el interceptor out solo será ejecutado esta ocación
      this.currentRoute = undefined;
      MyRouter.go(this.pathVisited[0], this.discreetVisited[0]);
      return true;
    }//end if
    if(interOutResponse.redirect){//verificar si el interceptor demanda una redirección de ruta
      //la razón detrás de declarar undefined esta propiedad es para garantizar que
      //el interceptor out solo será ejecutado esta ocación
      this.currentRoute = undefined;
      MyRouter.go(interOutResponse.redirect.path, interOutResponse.redirect?.discreet);
      return true;
    }//end if
    return false;
  }//end interOut

   /**
  * Método encargado de ejecutar el interceptor "in" de entrada a ruta
  * @returns - retorna una promesa la cuyalva resuelve "true" si el interceptor ejecutó una operación importante, 
  * ya sea redirección o cancelación de cambio de ruta y "false" si el interceptor 
  * no le afecto significativamente
  */
  private async interIn(): Promise<boolean>{
    const router = new MyRouter();
    if(router.currentRoute?.in === undefined) return false;
    const e = {
      discreet: router.discreetVisited[1],
      params: {
        slugs: MyRouter.paramSlug(),
        querys: MyRouter.queryParams()
      }
    }//end e
    const interInResponse = await router.currentRoute.in(router.pathVisited[1], e);
    if(!interInResponse) return false;
      if(interInResponse.cancel) {
        MyRouter.go(this.pathVisited[0], this.discreetVisited[0]);
        return false;
      };
      if(interInResponse.redirect){
        this.currentRoute = undefined;
        MyRouter.redirect(interInResponse.redirect.path, interInResponse.redirect.discreet);
        return false;
      }
    return false
  }//end enterIn

  /**
   * Método encargado de navegar a otra página
   * @param path - Ruta válida obetivo
   * @param discreet - Datos discretos para comunicar entre páginas
   */
  static go<T = any>(path: string, discreet?: T): void{
    const router = new MyRouter();
    window.history.pushState({path, discreet}, path, window.location.origin + path);
    router.renderRoute();
  }//end go

  /**
   * Método encargado de navegar a otra página
   * @param path - Ruta válida obetivo
   * @param discreet - Datos discretos para comunicar entre páginas
   */
  static redirect<T = any>(path: string, discreet?: T): void{
    const router = new MyRouter();
    window.history.replaceState({path, discreet}, path, window.location.origin + path);
    router.renderRoute();
  }//end go
  
  /**
   * Método que navegar hacia atrás en la navegación
   */
  static back(){
    window.history.back()
  }//end back

  /**
   * Método que navegar hacia adelante en la navegación
   */
  static next(){
    window.history.forward();
  }//end next

  /**
   * Método encargado de obtener los parámetros los params slug
   * en la url actual
   */
  static paramSlug<T = any>(): T | undefined{
    const router = new MyRouter();
    return router.currentParamsSlug;
  }//end paramsSlug

  /**
   * Método encargado de obtener los datos discretos de la página actual
   */
  static discreetData<T = any>(): T | undefined{
    const router = new MyRouter();
    return router.discreetVisited[1];
  }//end discreetData
  
  /**
   * Método encargado de obtener los query params de la url
   */
  static queryParams<T = any>(): T | undefined{
    const searchUrl = window.location.search;
    let matchQuerys: boolean = false;
    const q = searchUrl.slice(1).split('&')
    const qq = q.filter(q=>q!=='')
    const querys = qq.reduce((acc: any, cur)=>{
      matchQuerys = true;
      acc[cur.split('=')[0]] =  cur.split('=')[1]
      return acc
    },{} as any)
    if(!matchQuerys) return;
    return querys
  }//queryParams
}