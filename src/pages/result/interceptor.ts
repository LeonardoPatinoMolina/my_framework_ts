import { ArgsInterceptor, InterceptorReturn, InterceptorT } from "../../lib/my_framework/router/types/myRouter.types";

export const IResultIn: InterceptorT = (path:string, args?: ArgsInterceptor): InterceptorReturn | void=>{
  console.log(path+'.....in',args);
}


export const IResultOut: InterceptorT = (path:string, args?: ArgsInterceptor): InterceptorReturn | void=>{
  console.log(path+'.....out',args);
}