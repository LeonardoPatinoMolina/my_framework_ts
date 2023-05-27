import { EventController } from "./eventController";
import { InputController } from "./inputController";
import { MyComponent } from "./myComponent";
import { DirectiveTemplateI } from "./types/myComponents.types";

export class MyTemplateEngine{
    
  /**
   * Este regex depura el template en busca de palabras reservadas de js
   */
  private regexDepurator: RegExp = /\b(?:true|false|undefined)\b/gi;

  private owner: MyComponent;
  /**
   * Este regex aisla el contexto en el que se aplicará el regexDepurator
   */
  private regexDepuratorContext: RegExp = />([^<>]*)\b(true|false|undefined)\b([^<>]*)</gmi;

  constructor(owner: MyComponent){
    this.owner = owner;
  } 
  myIf(predicate: boolean): string{
    return predicate ? '': ' if-to-delete '
  }
  myMul(amount: number): string{
    return ` mul-to-multiply="${amount}" `
  }

  /**
   * Método encargado de depurar el template de palabras reservadas
   */
  getTemplateDepurated(template: string): string{
    const temp = template.replace(this.regexDepuratorContext,(match)=>{
      return match.replace(this.regexDepurator,'')
    })
    return temp
  }//end getTemplateDepurated

  /**
   * Método encargado de aplicar todas las directivas sobre el template
   */
  getTemplateAfterDirective(template: string): string{

    const node = document.createElement('div')
    node.innerHTML = template;
    node.querySelectorAll('[if-to-delete]').forEach(el=>{
      el.parentNode?.removeChild(el)
    });
    node.querySelectorAll(`[mul-to-multiply]`).forEach(el=>{
      const at = el.getAttribute('mul-to-multiply');
      
      if(!at) return;
      const fr = new DocumentFragment();
      let epa: Node[] = Array.from({length: parseInt(at)})
      epa = epa.map((ep)=>{
        el.removeAttribute('mul-to-multiply')
        return el.cloneNode(true)
      })
      
      epa.forEach(e=>{
        fr.appendChild(e);
      });
      el.replaceWith(fr)
      
    })
    return node.children[0].outerHTML;
  }//end getTemplateAfterDirective

  buildTemplate(builder: (
      _: DirectiveTemplateI)=>string, 
      eventController: EventController, 
      inputController: InputController
    ): string{

    const getChild = (key: string) =>{
      const m = this.owner.childAttaching.child[key]
      if(m === undefined) throw new Error('El componente hijo con el selector '+key+' no existe en el presente módulo, intente añadirlo en el decorador MyModule que corresponda')
      return m
    }
    const getChildren = (key: string) =>{
      const m = this.owner.childAttaching.children[key]
      if(m === undefined) throw new Error('Los componentes hijos con el selector '+key+' no existen en el presente módulo, intente añadirlos en el decorador MyModule que corresponda')
      return m
    }
    const obj: DirectiveTemplateI = {
     on: (name, callback, options)=>{
       return eventController.onEvent(name, callback, options);
      },
      inputController: (modelName, fieldName, callback)=>{
        return inputController.onInputController(modelName, fieldName, callback);
      },
      myIf: this.myIf,
      child: getChild,
      children: getChildren,
      myMul: this.myMul,
      If: (condition: boolean, template: string)=>{
        if(condition)return template;
        else return '';
      }
    }

    let templatetext = builder(obj);
    // templatetext = this.getTemplateDepurated(templatetext);
    templatetext = this.getTemplateAfterDirective(templatetext);
    
    return templatetext;
  }


}