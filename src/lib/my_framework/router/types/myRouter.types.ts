
export interface RoutesI {
  path: string;
  modulePage: any;
}

export interface MatchRouteI<T = any>{
  modulePage: any,
  params: T
}