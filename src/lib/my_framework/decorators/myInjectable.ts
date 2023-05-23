import { MyCentralService } from "@my_framework/service/myCentralService";

interface InjectableArgs{
  serviceName: string;
  provideIn: string[] | 'all';
}


export function MyInjectable(iArgs: InjectableArgs){
  return function <T extends {new (...args: any[]): {}}>(constructor: T){
    return class extends constructor{
      constructor(...args: any[]){
        super(...args)
        if(MyCentralService.isInCentral(iArgs.serviceName)){
          return MyCentralService.getService(iArgs.serviceName);
        }
        MyCentralService.setService(iArgs.serviceName, this);
      }
      static provideIn: string[] | 'all' = iArgs.provideIn;
      static serviceName: string = iArgs.serviceName;
    }
  }
}