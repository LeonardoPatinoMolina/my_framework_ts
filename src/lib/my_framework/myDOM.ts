"use strict"
import { MyComponent } from "./mycomponent.ts";

export class MyDOM {
  static MyDOMtInstancia: MyDOM;

  /** estructura de datos que almacena las key de los componentes
   * hijos indexados por la key del componente padre
   */
  family: Map<string, Set<string>> = new Map();

  nodes: Map<string, MyComponent> = new Map();
  /** raíz del dom
   */
  root?: HTMLElement | Element | null;

  constructor(root?: HTMLElement | Element | null){
    if(!!MyDOM.MyDOMtInstancia){
      return MyDOM.MyDOMtInstancia;
    }
    this.root = root;
    MyDOM.MyDOMtInstancia = this;
  }
  static createRoot(root: Element | HTMLElement | null): {render:(component: typeof MyComponent)=>void}{
    new MyDOM(root);
    return {
      render: (component: typeof MyComponent)=>{
        const comp = component.create$('0-1-0$');
        comp.render(root);
      }
    }
  }//end createRoot

  /**
   * Establece el store global 
   */
  static setGlobalStore(store: ()=>void): void{
    store();
  }

  /**
   * Obtiene un componente almacenado en los nodos del
   * arbol
   */
  static getMember(key: string): MyComponent | undefined{
    return new MyDOM().nodes.get(key)
  }

  /** Inicialza una familia en el arbol
   */
  static initFamily(parent: MyComponent): Set<string> | undefined{
    const family = new MyDOM().family.set(parent.key, new Set());
    return  family.get(parent.key)
  }

  /**
   * Añade un nuevo hijo al atributo family del arbol
  */
 static setChild(parent: MyComponent, child: MyComponent): void{
   let family = MyDOM.getFamily(parent);
   family?.add(child.key);
  }
  
  /**
   * Remueve un hijo al atributo family del arbol
   */
  static removeChild(parent: MyComponent, child: MyComponent): void{
    const family = new MyDOM().family.get(parent?.key);
    if(family){
      family.delete(child.key);
    }
  }

  /**
   * Obtiene un Set con todos los hijos del actual componente
   */
  static getFamily(parent: MyComponent): Set<string>|undefined{
    return new MyDOM().family.get(parent.key)
  }

  /**
   */
  static removeFamily(parent: MyComponent): boolean{
    const dom = new MyDOM();
    return dom.family.delete(parent.key);
  }

    /** Añade un nuevo nodo al arbol
   * y false si no se añadíó correctamente
   */
  static setMember(newMember: MyComponent): boolean{
    const dom = new MyDOM();
    if(MyDOM.memberCompare(newMember.key)) return false;
    dom.nodes.set(newMember.key, newMember)
    return true;
  }

  /**
   */
  static removeMember(targetMember:MyComponent): boolean{
    const dom = new MyDOM();
    if(!dom.nodes.has(targetMember.key)) return false;
    dom.family.delete(targetMember.key);
    return  dom.nodes.delete(targetMember.key);
  }
  /**
   * Verifica si el actual componente existe como 
   * miembro del árbol
   */
  static memberCompare(key: string){
    const dom = new MyDOM();
    return  dom.nodes.has(key);
  }
  
  static clearDOM(): void{
    const dom = new MyDOM();
    dom.nodes.clear();
    dom.family.clear();
  }
}