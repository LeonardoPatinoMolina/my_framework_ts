import { MyComponent } from "./myComponent.ts";
import { MyNodeI } from "./types/myDOM.types.ts";

export class MyDOM {
  static MyDOMtInstancia: MyDOM;
  /**
   * key destinada a indentificar el nodo principal del árbol,
   */
  private firstKey: string = `comp__root__first__root__0__key`
  /**
   * Árbol principal donde se aloja la raiz el nodo raíz
   */
  tree!: {root: MyNodeI};
  /**
   * Almacén de las key de cada nodo existente en el árbol
   */
  nodesT: Set<string> = new Set();
  /**
   * Cuepo completo del árbol declarado de forma horizontal, es decir, las relaciones jerárquicas 
   * están relacionadas por key
   */
  treeC: Map<string,MyNodeI> = new Map();
  /** Elemento del DOM el cual actua de raíz para el árbol de nodos
   */
  root?: HTMLElement | Element | null;


  constructor(root?: HTMLElement | Element | null){
    if(!!MyDOM.MyDOMtInstancia){
      return MyDOM.MyDOMtInstancia;
    }
    this.root = root;
    MyDOM.MyDOMtInstancia = this;
  }
  static createRoot(root: Element | HTMLElement | null): {render:(module: any)=>void}{
    new MyDOM(root);
    return {
      render: MyDOM.renderTree
    }
  }//end createRoot


  static configModules(modules: any[]){
    modules.forEach(m=>{
      new m().nodes.forEach((n: typeof MyComponent)=>{
        n.module = m;
      })
    })
  }

  static renderTree(myModule: any): void{
    const dom = new MyDOM()
    const firstKey = dom.firstKey
    const rootNode = {
      children: new Set(),
      key: firstKey, 
      instance: 0 as any,
      parentKey: 'root'
    } as MyNodeI
    
    dom.tree = {root: rootNode};
    dom.treeC.set(firstKey,rootNode);
    const comp = new myModule().rootNode.factory('root',firstKey);
    
    comp.setKey(firstKey);
    dom.tree.root.instance = comp;
    dom.treeC.get(firstKey)!.instance = comp;
    dom.nodesT.add(firstKey);
    
    dom.renderTreeCC('root');
  }

  static updateTree(key: string,){
    const dom = new MyDOM();
    const rootNode = key === 'root' ? dom.tree.root : MyDOM.getMemberNode(key)!;
    let isFirst = true;
    dom.exploreTree(rootNode!, (node)=>{
      const previusBody = node.instance.body;
      if(isFirst){
        node.instance.create();
        previusBody.replaceWith(node.instance.body);
        isFirst = false;
        return;
      }
      const r = document.getElementById(`root-${node.key}`);
      node.instance.render(r,false)

    })

  }

  /**
   * Establece el store global 
   */
  static setGlobalStore(store: ()=>void): void{
    store();
  }

  /**
   * Método encarga de explorar, es decir, recorrer el un árbol nodo a nodo de forma descendene
   * partiendo de su nodo raíz
   * @param node - nodo raiz a partr del cual se selecciona el árbol para explorar
   * @param action - función destinada a reicibir cada nodo por su parámetro
   */
  private exploreTree(node: MyNodeI, action: (node: MyNodeI)=>void):void {
    action(node);
    node.children.forEach(child=>{
      const childN = MyDOM.getMemberNode(child)!
      this.exploreTree(childN, action)
    })
  }
  /**
   * Método encarga de explorar, es decir, recorrer un árbol nodo a nodo de forma ascendente
   * partiendo de los notos extremos hasta la raiz
   * @param node - nodo raiz a partr del cual se selecciona el árbol para explorar
   * @param action - función destinada a reicibir cada nodo por su parámetro
   */
  private exploreTreeReverse(node: MyNodeI, action: (node: MyNodeI)=>void):void {
    node.children.forEach(child=>{
      const childN = MyDOM.getMemberNode(child)!
      this.exploreTree(childN, action)
    })
    action(node);
  }

  /**
   * Método encargado de propagar una notificación en un arbol
   * especificado de forma descendente partiendo de un nodo raíz
   * @param keyNode key del nodo raiz del arbol a notificar
   * @param notify función callback encargada de realizar la notificación
   */
  static notifyInTree(keyNode: string, notify: (component: MyNodeI)=>void){
    const dom = new MyDOM()
    const nodeTarget = MyDOM.getMemberNode(keyNode)!;
    dom.exploreTree(nodeTarget,(node)=>{
      notify(node);
    })
  }

    /**
   * Método encargado de propagar una notificación en un arbol
   * especificado de forma ascendente partiendo de los nodos exremos
   * hasta el un nodo raíz
   * @param keyNode key del nodo raiz del arbol a notificar
   * @param notify función callback encargada de realizar la notificación
   */
  static notifyInTreeReverse(keyNode: string, notify: (component: MyNodeI)=>void){
    const dom = new MyDOM()
    const nodeTarget = MyDOM.getMemberNode(keyNode)!;
    dom.exploreTreeReverse(nodeTarget,(node)=>{
      notify(node);
    })
  }


  private renderTreeCC(key: string){
    const dom = new MyDOM();
    const rootNode = key === 'root' ? dom.tree.root : MyDOM.getMemberNode(key);

    dom.exploreTree(rootNode!, (node)=>{
      if(node.key === dom.firstKey){
        node.instance.render(dom.root!, true);
        return;
      }
      const r = document.getElementById(`root-${node.key}`);
      node.instance.render(r)
    });
  }
  
  static addMember(args: MyNodeI): void{
    if(MyDOM.isInTree(args.key)) return;
    const dom = new MyDOM()

    dom.nodesT.add(args.key);
    dom.treeC.set(args.key, args);
  }

  static getMemberNode(key: string,): MyNodeI| undefined{
    const dom = new MyDOM();
    return dom.treeC.get(key);
  }

  /**
   * Método encargado de eliminar un hijo en el nodo padre que se especifique
   * @param parentKey 
   * @param targetChildKey 
   */
  static deleteChildNode(parentKey: string, targetChildKey: string){
    MyDOM.getMemberNode(parentKey)?.children.delete(targetChildKey)
  }

  static deleteNode(key: string){
    const dom = new MyDOM()
    dom.treeC.delete(key);
    dom.nodesT.delete(key);
  }

  /**
   * Verifica si el actual componente existe como 
   * miembro del árbol
   */
  static isInTree(key: string){
    const dom = new MyDOM();
    return  dom.treeC.has(key);
  }
  
  static clearDOM(): void{
    const dom = new MyDOM();
    if(dom.tree === undefined) return;
    
    dom.exploreTreeReverse(dom.tree.root,(node)=>{
      node.instance.clear();
    })
    dom.nodesT.clear();
    dom.treeC.clear();
  }
}