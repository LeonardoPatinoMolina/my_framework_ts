import { MyComponent } from "../core/myComponent";
import { generateGuid } from "../utils";

export type MyModuleT = {
  rootNode: typeof MyComponent,
  nodes: typeof MyComponent[],
  services?: any[],
  modules?: any[]
}

/**
 * Decorador encargado de establecer un nuevo módulo al cual se podrán acoplar 
 * cada declaradión de componentes y también proveer servicios de interes,
 * incluso a traves del mismo se puede asociar otros módulos
 */
export function MyModule({rootNode,nodes = [], services = [], modules}:MyModuleT){
  return function <T extends { new(...args: any[]): {} }>(constructor: T){
    /**
     * Espacio de mempria dedicado a la instancia de la clase decoradora, esto se debe a que el decorador "MyModule"
     * convierte a la clase decorada en un Singleton válido para componente involucrado e su declaración
     */
    let instance: any;
    return class extends constructor{
      nodes: typeof MyComponent[] = [];
      rootNode!: typeof MyComponent;
      services?: any[] = [];
      modules?: any[];
      key: string = generateGuid()
      
      constructor(...args: any){
        super(...args)
        if(!!instance){
          //lógica asociada al patrón singleton
          return instance
        }
        this.rootNode = rootNode;
        this.modules = modules;
        rootNode.module = this;
        const newNS = modules?.reduce((acc,cur)=>{
          return {nodes: [...acc.nodes, ...cur.nodes], services: [acc.services, ...cur.services]}
        },{nodes: [], services: []} as any) ?? {nodes: [], services: []}
        
        this.nodes = [...newNS.nodes, ...nodes];
        this.services = [...newNS.services, ...services]

        nodes.forEach((n)=>{
          n.module = this
        });
        
        instance = this; //lógica asociada al patrón singleton
      }//end constructor
    }//end class return
  }//end function return
}