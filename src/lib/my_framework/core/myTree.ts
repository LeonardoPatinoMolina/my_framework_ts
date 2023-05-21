import { MyComponent } from "./myComponent";
import { MyTreeI } from "./types/myComponents.types";

export class MyTree {
  tree!: MyTreeI;
  owner: MyComponent;

  private isReconciled: boolean = false;

  constructor(owner: MyComponent){
    this.owner = owner;
  }

  create(){
    this.tree = this.generateTree()
  }

  update(){
    const newTree = this.generateTree();
    this.reconsiliation(newTree, this.tree)
    if(this.isReconciled){
      this.tree = newTree
      this.isReconciled = false;
    }
  }

  private mappingAttrs(attr: any[] | undefined): object{
    const finalAttr: {[key:string]:any} = {};
    if(attr){
      for (let i = 0; i < attr.length; i++) {
        const attribute: any = attr[i];
        finalAttr[attribute.name] = attribute.value;
      }
    }
    return finalAttr;
  }

  private generateTree(): MyTreeI{
    return {
      name: this.owner.body.tagName,
      node: this.owner.body,
      attr: this.mappingAttrs(this.owner.body.attributes),
      children: this.analize(this.owner.body)
    }
  }

  private analize(node: any): MyTreeI[]{
    const target = node;
    return Array.from(target.childNodes).map((item: any)=>{
      return {
        name: item.tagName ?? "TEXT", 
        children: this.analize(item),
        attr: this.mappingAttrs(item.attributes),
        node: item
      }
    })
  }//end analize
  
  private reconsiliation(currentTree: MyTreeI, oldtree: MyTreeI){
   
    this.mismatches(currentTree, oldtree)
    if(oldtree.children.length !== currentTree.children.length) return;
    for (let i = 0; i < currentTree.children.length; i++) {
      const element1 = currentTree.children[i];
      const element2 = oldtree.children[i];

      if(element1.name !== 'TEXT'){
      const outcasting = element1.node.getAttribute('data-rootcomponent-outcast');
      if(outcasting === 'false') {
        continue;
      }
    }
    this.reconsiliation(element1, element2);
    }
  }//end reconisliation

  private mismatches(currentTree: MyTreeI, oldtree: MyTreeI): boolean{
    if(currentTree.name === 'TEXT'){
      
      if(currentTree.node.nodeValue !== oldtree.node.nodeValue ){
        oldtree.node.replaceWith(currentTree.node);
        this.isReconciled = true;
      }
    }
    else if(oldtree.children.length !== currentTree.children.length) {
      oldtree.node.replaceWith(currentTree.node);
      this.isReconciled = true;
    }
    
    return false
  }

}