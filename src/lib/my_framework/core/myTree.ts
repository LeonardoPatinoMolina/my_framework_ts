import { MyComponent } from "./myComponent";
import { MyTreeI } from "./types/myComponents.types";

export class MyTree {
  /**
   * Componente propietario del presente árbol
   */
  owner: MyComponent;

  /**
   * Propiedad encargada de hacer seguimiento a la modificación 
   * efectiva del árbol
   */
  private isReconciled: boolean = false;

  constructor(owner: MyComponent){
    this.owner = owner;
  }

  /**
   * Método encargado de actualizar el árbol de nodos correspondiente al
   * componente propietario
   * @param targetNode nodo del dom correspondiente al nodo
   */
  update(targetNode: Element): boolean{
    const oldTree = this.generateTree(targetNode);
    const newTree = this.generateTree(this.owner.body);
    this.reconsiliation(newTree, oldTree)
    // this.newReconciliationAlgoritm(oldTree, newTree)
    if(this.isReconciled){
      this.isReconciled = false;
      return true
    }
    return false
  }

  /**
   * Método encargado de generar los árboles que representnas
   * los distintos esptadios del virtual DOM 
   */
  private generateTree(targetNode: Element): MyTreeI{
    return {
      name: targetNode.tagName,
      node: targetNode,
      attr: targetNode.attributes,
      children: this.analize(targetNode)
    }
  }

  /**
   * Métod recursivo que mapea un árbol de nodos em busca de generar una estructura
   * ramificada predefinida en la interfaz "MyTreeI"
   */
  private analize(node: any): Array<MyTreeI>{
    const target: Element | Text = node;
    let epa: Array<MyTreeI> = [];
    const targetArr = Array.from(target.childNodes);
    for (let i = 0; i < targetArr.length; i++) {
      const item: any = targetArr[i];
      let tag: string;
      if(!item.tagName){
        tag = 'TEXT'
      }else tag = item.tagName;

      epa.push({
        name: tag, 
        children: this.analize(item),
        attr: item.attributes,
        node: item,
      })
    }
    return epa;
  }//end analize
  
  /**
   * Método encargado de reconcicliar ambos árboles incidiendo lo necesario
   * para refleajar los cambios e  el DOM
   */
  private reconsiliation(currentTree: MyTreeI, oldTree: MyTreeI){
   
    this.mismatches(currentTree, oldTree);
    if(oldTree.children.length !== currentTree.children.length) return;
    for (let i = 0; i < currentTree.children.length; i++) {
      const element1 = currentTree.children[i];
      const element2 = oldTree.children[i];
    
      if(!(element1!.node instanceof Text)){
        const outcasting = element1!.node.getAttribute('data-rootcomponent-outcast');
        if(outcasting) continue; //nos aseguramos que los hijos desamparados no sean reconciliados jeje
      }
      this.reconsiliation(element1!, element2!);
    }
  }//end reconisliation

  /**
   * Método encargado de encontrar discrepancias entre los áboles comparados,
   * rectificando en consecuencia
   */
  private mismatches(currentTree: MyTreeI, oldtree: MyTreeI): void{
    if(currentTree.name === 'TEXT'){ //en caso de ser un nodo de texto directamente alteramos su contenido
      if(currentTree.node.textContent !== oldtree.node.textContent ){
        // oldtree.node.replaceWith(currentTree.node);
        oldtree.node.textContent = currentTree.node.textContent
        // oldtree.node = currentTree.node
        this.isReconciled = true;
      }
      return;
    }

    //en caso de tener distinto nombre, es decir, que la discrepancia sea del tagname,
    //remplazar directamente el nodo
    if(currentTree.name !== oldtree.name){
      oldtree.node.replaceWith(currentTree.node);
      oldtree.node = currentTree.node;
      oldtree.name = currentTree.name;
      oldtree.attr = currentTree.attr;
      oldtree.children = currentTree.children;
      this.isReconciled = true;
      return;
    }
    
    this.findMisChildren(currentTree,oldtree);
    this.findMisAttr(currentTree,oldtree);

  }//end mismatches

  private findMisChildren(currentT: MyTreeI, oldT: MyTreeI){
    if(oldT.children.length !== currentT.children.length) {//en caso de una diferencia de hijos
      oldT.node.replaceWith(currentT.node);
      oldT.node = currentT.node;
      oldT.children = currentT.children;
      this.isReconciled = true;
    }
  }//end findMisChildren

  /**
   * Método encargdo de hallar diferencias entre los atributos de los árboles y reconciliarlos
   * en consecuencias
   */
  private findMisAttr(currentT: MyTreeI, oldT: MyTreeI){

    const oldKeys = Object.keys(oldT.attr);
    const currentKeys = Object.keys(currentT.attr);
    const currentEntries = Object.entries(currentT.attr);
    const oldEntries = Object.entries(oldT.attr);

    function removeAttr(){
       oldEntries.forEach(([key,value]: any)=>{
        if(!(oldT.node instanceof Text)) oldT.node.removeAttribute(key);
      })
    }

    function addAttr(){
      currentEntries.forEach(([key,value]: any)=>{
        if(!(oldT.node instanceof Text)) oldT.node.setAttribute(value.name,value.value);
      });
    }

    if(oldKeys.length !== currentKeys.length){//en caso de una difrencia en la catidad de atributos
      this.isReconciled = true;      
      if(oldKeys.length > currentKeys.length) removeAttr(); // en caso de haber menos atributos remover los excedidos
      else addAttr(); //en caso de haber atributos adicionales, añadirl los nuevos
    }else{ //en caso de no haber diferencia de cantidad, actaulizar los atributos que tengan valores distintos
      currentEntries.forEach(([key, value]: any)=>{
        if(oldT.attr[value.name]?.value !== currentT.attr[value.name]?.value){
          this.isReconciled = true;
          if(!(oldT.node instanceof Text)) oldT.node.setAttribute(value.name,value.value);
        }
      });
    }//end else
    oldT.attr = currentT.attr;
  }//end findAttr
}