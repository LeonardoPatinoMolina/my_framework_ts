"use strict"
import { MyComponent } from "./mycomponent.ts";

export interface MyNode{
  key: string,
  instance: MyComponent
  children: Map<string,MyNode>,
}

export class MyDOM {
  static MyDOMtInstancia: MyDOM;
  static keyCounter: number = 0;

  tree!: {root: MyNode};

  /** estructura de datos que almacena las key de los componentes
   * hijos indexados por la key del componente padre
   */
  family: Map<string, Set<string>> = new Map();
  
  nodes: Map<string, MyComponent> = new Map();
  nodesT: Set<string> = new Set();
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
      render: new MyDOM().renderTree
    }
  }//end createRoot

  /**
   * Método generador de key única para cada nodo del árbol de componentes
   */
  private *generateNewkey(): Generator<string>{
    while(true){
      const newKey = `comp-${MyDOM.keyCounter}-key`
      MyDOM.keyCounter += 1;
      yield newKey;
    }
  }
  private renderTree(component: typeof MyComponent): void{
    const dom = new MyDOM()
    dom.tree = {
      root: {
        children: new Map(),
        key: 'comp-root-key', 
        instance: 0 as any
      }
    };
    const comp = component.factory('0','comp-root-key')
    comp.setKey('comp-root-key')
    comp.render(dom.root!)
    dom.tree.root.instance = comp;
    dom.nodesT.add('comp-root-key');
  }

  updateTree(node: MyComponent){

  }
  /**
   * Método encargado de generar una nueva key para un componente instanciado
   */
  static generateNewKey(): string{
    const nKey = new MyDOM()
      .generateNewkey()
      .next()
      .value;
    // console.log(nKey);
      
    return nKey;
  }
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
    // if(MyDOM.isInTree(newMember.key)) return false;
    dom.nodesT.add(newMember.key);
    dom.nodes.set(newMember.key, newMember)
    return true;
  }

  private searchNode(node: MyNode, target: string): MyNode | undefined {
    if(node.key === target){
      return node;
    }//end if
    let n;
    const isThere = node.children.get(target);
    if(isThere) return isThere;

    node.children.forEach(child=>{
      n = this.searchNode(child, target)!
    })
    return n;
  }
  
  static addMember(args: MyNode,parentKey: string): void{
    
    if(MyDOM.isInTree(args.key)) return;
    const dom = new MyDOM()
    const node = dom.searchNode(dom.tree.root, parentKey)
    node?.children.set(args.key,args);
    dom.nodesT.add(args.key);
  }

  static getMemberNode(key: string,): MyNode| undefined{
    
    const dom = new MyDOM();
    return dom.searchNode(dom.tree.root,key)
  }

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
  /**
   * Verifica si el actual componente existe como 
   * miembro del árbol
   */
  static isInTree(key: string){
    const dom = new MyDOM();
    return  dom.nodesT.has(key);
  }
  
  static clearDOM(): void{
    const dom = new MyDOM();
    dom.nodes.clear();
    dom.family.clear();
  }
}