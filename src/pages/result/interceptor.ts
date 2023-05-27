import { ArgsInterceptor, InterceptorReturn, InterceptorT } from "../../lib/my_framework/router/types/myRouter.types";

export const IResultIn: InterceptorT = (path:string, args?: ArgsInterceptor): InterceptorReturn | void=>{
  console.log(path+'.....in',args);
}


export const IResultOut: InterceptorT = (path:string, args?: ArgsInterceptor): InterceptorReturn | void=>{
  const choice = confirm('desea salir de la presente página?')
  return {
    cancel: !choice
  }
}