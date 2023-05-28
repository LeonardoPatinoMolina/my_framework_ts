import { MyCentralService } from "@my_framework/service/myCentralService";

interface InjectableArgs{
  serviceName: string;
  provideIn?: string[] | 'all';
}


export function MyInjectable({serviceName, provideIn = 'all'}: InjectableArgs){
  return function <T extends {new (...args: any[]): {}}>(constructor: T){
    return class extends constructor{
      constructor(...args: any[]){
        super(...args)
        if(MyCentralService.isInCentral(serviceName)){
          return MyCentralService.getService(serviceName);
        }
        MyCentralService.setService(serviceName, this);
      }
      static provideIn: string[] | 'all' = provideIn;
      static serviceName: string = serviceName;
    }
  }
}