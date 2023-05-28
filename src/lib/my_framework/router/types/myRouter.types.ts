/**
 * Rutas declaradas destindas a uso dentro de clase MyRouter
 */
export interface RoutesI {
  path: string;
  modulePage: any;
  in?: InterceptorT;
  out?:InterceptorT;
}

/**
 * Tipo especial para rutas coincidentes en el algoritmo 
 * de obtención de ruta actual
 */
export interface MatchRouteI<T = any>{
  route: RoutesI,
  paramsSlug: T
}

export type InterceptorT = (path: string, args: ArgsInterceptor)=>InterceptorReturn|void;

export interface InterceptorReturn {
  redirect?: string;
  cancel?: boolean;
}

export type ArgsInterceptor = {
  params:{slugs?: any, querys?: any}
}

export interface InterceptorI {
  request<T=any>(request: T): T;
}

export interface RouterTaskArgsI{
  path: string;
  discreet: any;
  params: {slugs: any, querys: any}
}

export type RouterTaskT = (args: RouterTaskArgsI)=>RouterTaskArgsI