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
    if(this.isReconciled){
      this.isReconciled = false;
      return true
    }
    return false
  }

  private generateTree(targetNode: Element): MyTreeI{
    return {
      name: targetNode.tagName,
      node: targetNode,
      attr: targetNode.attributes,
      children: this.analize(targetNode)
    }
  }

  private analize(node: any): Array<MyTreeI>{
    const target: Element | Text = node;
    // const getToken = (itemTarget: Element | Text, key: any): string=>{
    //   let tag: string;
    //   if(!(itemTarget instanceof Text)){
    //     tag = itemTarget.tagName
    //   }else{
    //     tag = 'TEXT'
    //   }
    //   return tag+key+'-token';

    // }
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
        backyard: targetArr[i - 1] as Element | Text,
        forward: targetArr[i + 1] as Element | Text,
      })
    }
    return epa;
  }//end analize
  
  private reconsiliation(currentTree: MyTreeI, oldtree: MyTreeI){
   
    this.mismatches(currentTree, oldtree)
    if(oldtree.children.length !== currentTree.children.length) return;
    for (let i = 0; i < currentTree.children.length; i++) {
      const element1 = currentTree.children[i];
      const element2 = oldtree.children[i];

      if(!(element1!.node instanceof Text)){
      const outcasting = element1!.node.getAttribute('data-rootcomponent-outcast');
      if(outcasting === 'false') {
        console.log('epa');
        continue;
      }
    }
    this.reconsiliation(element1!, element2!);
    }
  }//end reconisliation

  private mismatches(currentTree: MyTreeI, oldtree: MyTreeI): void{
    if(currentTree.name === 'TEXT'){
      if(currentTree.node.textContent !== oldtree.node.textContent ){
        // oldtree.node.replaceWith(currentTree.node);
        oldtree.node.textContent = currentTree.node.textContent
        // oldtree.node = currentTree.node
        this.isReconciled = true;
      }
      return;
    }
    
    if(oldtree.children.length !== currentTree.children.length) {
      // if(oldtree.children.length > currentTree.children.length){
      //   //hay ausencia de hijos
      //   const epa: any[] = []
      //   oldtree.children.forEach((value,key)=>{
      //     const ep = currentTree.children.get(key)
      //     if(!ep) epa.push(value)
      //   })
        
      //   epa.forEach((el: MyTreeI)=>{
      //     el.node.remove();
      //   })
      // }else{
      //   //hay presencia de hijos
      //   const epa: any[] = []
      //   currentTree.children.forEach((value,key)=>{
      //     const ep = oldtree.children.get(key)
      //     if(!ep) epa.push(value)
      //   })
      //   epa.forEach((el: MyTreeI)=>{
      //     if(el.forward){
      //         if(!(el.forward instanceof Text)){
      //           el.forward.insertAdjacentElement('beforebegin',el.node as Element);
      //         }else{
      //           el.node.remove()
      //           el.forward.parentNode?.insertBefore(el.node, el.forward)
      //         }
      //       }
      //   })
      // }
      oldtree.node.replaceWith(currentTree.node);
      oldtree.node = currentTree.node;
      oldtree.children = currentTree.children;
      this.isReconciled = true
    }
    this.findMisAttr(currentTree,oldtree);

  }//end mismatches


  private findMisAttr(currentT: MyTreeI, oldT: MyTreeI){

    const oldKeys = Object.keys(oldT.attr);
    const currentKeys = Object.keys(currentT.attr);
    const currentEntries = Object.entries(currentT.attr);
    const oldEntries = Object.entries(oldT.attr);

    const removeAttr = ()=>{
       oldEntries.forEach(([key,value]: any)=>{
        if(!(oldT.node instanceof Text)) oldT.node.removeAttribute(key);
      })
    }

    if(oldKeys.length !== currentKeys.length){
      this.isReconciled = true;      
      if(oldKeys.length > currentKeys.length) removeAttr();
      currentEntries.forEach(([key,value]: any)=>{
        if(!(oldT.node instanceof Text)) oldT.node.setAttribute(value.name,value.value);
      });
    }else{
      currentEntries.forEach(([key,value]: any)=>{
        if(oldT.attr[key].value !== currentT.attr[key].value){
          this.isReconciled = true;
          
          if(!(oldT.node instanceof Text)) oldT.node.setAttribute(key.name,value.value);
        }
      });
    }//end else
    oldT.attr = currentT.attr;
  }//end findAttr
}