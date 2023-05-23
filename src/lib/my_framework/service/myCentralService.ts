
export class MyCentralService {
  static instanceMyCentralService: MyCentralService;

  services: Map<string, any> = new Map();

  constructor(){
    if(!! MyCentralService.instanceMyCentralService){
      return MyCentralService.instanceMyCentralService;
    }
    MyCentralService.instanceMyCentralService = this;
  }

  static setService(svcName:string, service: any){
    const svc = new MyCentralService();
    svc.services.set(svcName, service);
  }

  static removeService(svcName:string){
    const svc = new MyCentralService();
    svc.services.delete(svcName);
  }

  static isInCentral(svcName: string): boolean{
    const svc = new MyCentralService();
    return svc.services.has(svcName)
  }
  
  static getService(svcName: string): any | undefined{
    const svc = new MyCentralService();
    return svc.services.get(svcName);
  }
  
  static clearServices(): void{
    const svc = new MyCentralService();
    svc.services.clear();
  }
}