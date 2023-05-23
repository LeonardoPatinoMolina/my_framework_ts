import { MyComponent } from "../core/myComponent";

export type MyModuleT = {
  key: string;
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
export function MyModule({key, rootNode, nodes = [], services = [], modules}:MyModuleT){
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
      key!: string;
      
      constructor(...args: any){
        super(...args)
        if(!!instance){
          //lógica asociada al patrón singleton
          return instance
        }
        this.key = key
        this.rootNode = rootNode;
        this.modules = modules;
        rootNode.module = this;
        this.nodes = nodes;
        this.services = services;

        nodes.forEach((n)=>{n.module = this});
        modules?.forEach((m)=>{
          this.nodes.push(new m().rootNode)
        })
        
        instance = this; //lógica asociada al patrón singleton
      }//end constructor
    }//end class return
  }//end function return
}