import { MyDOM } from "../core/myDOM.ts";
import { MyCentralService } from "../service/myCentralService.ts";
import { _404Module } from "../template/404/404.module.ts";
import { InterceptorReturn, MatchRouteI, RoutesI } from "./types/myRouter.types.ts";

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
  private currentRouteS!: string;

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
   * Datos discretos de la página que se encuentra renderizada
   */
  currentDiscreet: any; 
  
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

    window.addEventListener('popstate',()=>{
      this.renderRoute();
    });

    window.addEventListener('DOMContentLoaded',()=>{
      this.renderRoute();
    });

    MyRouter.instanceRouter = this;
  }

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
  }
  
  /**
   * Método encargado de renderizar el módulo correspondiente
   * a la ruta ingresada
   */
  private renderRoute(){
    const path = window.location.pathname;
    //almacenamos un posible dato discreto
    const hState = history.state;
    this.currentDiscreet = hState?.discreet;
    
    if(!!this.currentRoute){
      const interOutResponse = this.interOut()
      if(interOutResponse) {
        if(interOutResponse.cancel) {
          MyRouter.back();
          return;
        }//end if
        if(interOutResponse.redirect){
          this.currentRoute = undefined;
          MyRouter.go(interOutResponse.redirect);
          return;
        }//end if
      }//end if
    }//end if

    const mathed = this.matchRoute(path);
    
    let page
    if(mathed === null) {
      page =  this.notFound;
      this.currentParamsSlug = undefined
    }else {
      this.currentRoute = mathed.route;
      const interInResponse = this.interIn(path, {params: {slugs: mathed.paramsSlug, querys: MyRouter.queryParams()}})
      if(interInResponse) {
        if(interInResponse.cancel) {
          MyRouter.back();
          return;
        };
        if(interInResponse.redirect){
          this.currentRoute = undefined;
          MyRouter.go(interInResponse.redirect);
          return;
        }
      }
      page = mathed.route.modulePage;
      this.currentParamsSlug = mathed.paramsSlug;
    }
    
    MyDOM.clearDOM();
    MyCentralService.clearServices(); 
    const newPage = page ?? this.notFound;
    this.currentRouteS = path;
    MyDOM.renderTree(newPage);
  }

  private interOut(): InterceptorReturn | void{
    const router = new MyRouter();
    if(!router.currentRoute?.out) return;
    const e = {
      params: {
        slugs: MyRouter.paramSlug(),
        querys: MyRouter.queryParams()
      }
    }
    return router.currentRoute.out(router.currentRouteS, e)
  }

  private interIn(path: string, params: any): InterceptorReturn | void{
    const router = new MyRouter();
    if(router.currentRoute?.in === undefined) return;
    return router.currentRoute.in(path, params)
  }

  /**
   * Método encargado de navegar a otra página
   * @param path - Ruta válida obetivo
   * @param discreet - Datos discretos para comunicar entre páginas
   */
  static go<T = any>(path: string, discreet?: T): void{
    const router = new MyRouter();
    window.history.pushState({path, discreet}, path, window.location.origin + path);
    router.renderRoute();
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
    window.history.forward();
  }

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
  static disgreetData<T = any>(): T | undefined{
    const router = new MyRouter();
    return router.currentDiscreet;
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