import { ArgsInterceptor, InterceptorReturn, InterceptorT } from "../../lib/my_framework/router/types/myRouter.types";

export const IResultIn: InterceptorT = async (path:string, args?: ArgsInterceptor): Promise<InterceptorReturn|void> =>{
  //lógica de interceptor
} 

export const IResultOut: InterceptorT = async (path:string, args?: ArgsInterceptor): Promise<InterceptorReturn | void>=>{
  //lógica de interceptor
}