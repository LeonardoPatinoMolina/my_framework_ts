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
   * Cuepo completo del árbol declarado de forma horizontal, es decir, las relaciones jerárquicas 
   * están relacionadas por key
   */
  nodes: Map<string,MyNodeI> = new Map();
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
  static createRoot(root: Element | HTMLElement | null): {render: typeof MyDOM.renderTree}{
    new MyDOM(root);
    return {
      render: MyDOM.renderTree
    }
  }//end createRoot

  /**
   * Método encargado del renderizado inicial del árbol de componentes
   */
  static renderTree(myModule: any): void{
    const dom = new MyDOM()
    const firstKey = dom.firstKey
    const rootNode: MyNodeI = {//creamos el nodo raíz
      children: new Set(),
      key: firstKey, 
      instance: 0 as any,//añadimos un valor temporal mientras obtenemos la instancia
      parentKey: 'root'
    }
    //lo añadimos a las estructuras árbol de muyDOM
    dom.tree = {root: rootNode};
    dom.nodes.set(firstKey,rootNode);
    //obtenemos la instancia deS
    const comp = new myModule().rootNode.factory('root',firstKey);
    
    comp.setKey(firstKey);
    dom.tree.root.instance = comp;
    dom.nodes.get(firstKey)!.instance = comp;
    
    dom.renderEffect('root');
  }

  /**
   * Establece el store global 
   */
  static setGlobalStore(store: ()=>void): void{
    store();
  }

  /**
   * Algoritmo de Búsquea en amplitud que se encarga de explorar el árbol ejecutando acciones en cada
   *  visita en los nodos del árbol partiendo de un nodo raiz
   * @param node - nodo raiz a partr del cual se selecciona el árbol para explorar
   * @param action - función destinada a reicibir cada nodo por su parámetro
  */
  private exploreTreeBFS(node: MyNodeI, action: (node: MyNodeI)=>boolean | void): void{
    const queue: string[] = [];
    queue.push(node.key);

    while (queue.length > 0) {
      const currentNodeKey = queue.shift()
      const childN = MyDOM.getMemberNode(currentNodeKey!)
      if(childN === undefined) throw new Error('Inconsistencia entre el árbol y el componente referenciado '+currentNodeKey);

      const check = action(childN!)//el check determina si la exploración continúa o si es interrumpida
      if(check) break;
      for (const ch of childN.children) {
        queue.push(ch)
      }//end for
    }//end while
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
      this.exploreTreeReverse(childN, action)
    })
    action(node);
  }

  /**
   * Método encargado de propagar una notificación en un arbol
   * especificado de forma descendente partiendo de un nodo raíz especificado
   * @param keyNode key del nodo raiz del arbol a notificar
   * @param notify función callback encargada de realizar la notificación
   */
  static notifyInTree(keyNode: string, notify: (node: MyNodeI)=>void){
    const dom = new MyDOM()
    const nodeTarget = MyDOM.getMemberNode(keyNode)!;
    dom.exploreTreeBFS(nodeTarget,notify)
  }

    /**
   * Método encargado de propagar una notificación en un arbol
   * especificado de forma ascendente partiendo de los nodos extremos
   * hasta el un nodo raíz especificado
   * @param keyNode key del nodo raiz del arbol a notificar
   * @param notify función callback encargada de realizar la notificación
   */
  static notifyInTreeReverse(keyNode: string, notify: (component: MyNodeI)=>void){
    const dom = new MyDOM()
    const nodeTarget = MyDOM.getMemberNode(keyNode)!;
    dom.exploreTreeReverse(nodeTarget,notify)
  }

  /**
   * Método encargado de efectuar el renderizado en el dom y notificar el efecto en el árbol
   */
  private renderEffect(key: string){
    const dom = new MyDOM();
    const rootNode = key === 'root' ? dom.tree.root : MyDOM.getMemberNode(key);

    dom.exploreTreeBFS(rootNode!, (node)=>{
      if(node.key === dom.firstKey){
        node.instance.render(dom.root!);
        return;
      }
      node.instance.render();
    });
  }
  
  /**
   * Método que añade un nuevo nodo al árbol
   */
  static addMember(args: MyNodeI): void{
    if(MyDOM.isInTree(args.key)) return;
    const dom = new MyDOM()
    dom.nodes.set(args.key, args);
  }

  /**
   * Método que obtiene el nodo con la key especificada
   */
  static getMemberNode(key: string,): MyNodeI| undefined{
    const dom = new MyDOM();
    return dom.nodes.get(key);
  }

  /**
   * Método encargado de eliminar un hijo en el nodo padre que se especifique
   * @param parentKey 
   * @param targetChildKey 
   */
  static deleteChildNode(parentKey: string, targetChildKey: string){
    MyDOM.getMemberNode(parentKey)?.children.delete(targetChildKey)
  }

  /**
   * Método encargado de eliminar un nodo del árbol
   */
  static deleteNode(key: string){
    const dom = new MyDOM()
    dom.nodes.delete(key);
  }

  /**
   * Verifica si el actual componente existe como 
   * miembro del árbol
   */
  static isInTree(key: string){
    const dom = new MyDOM();
    return  dom.nodes.has(key);
  }
  
  /**
   * Método encargado de limpiar toda la estructura del árbol para
   * dar espacio a nuevos miembros
   */
  static clearDOM(): void{
    const dom = new MyDOM();
    if(dom.tree === undefined) return;
    
    dom.exploreTreeReverse(dom.tree.root,(node)=>{
      node.instance.clear();
    })
    dom.nodes.clear();
  }
}