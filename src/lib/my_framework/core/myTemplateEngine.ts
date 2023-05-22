export class MyTemplateEngine{
    
  /**
   * Este regex depura el template en busca de palabras reservadas de js
   */
  private regexDepurator: RegExp = /\b(?:true|false|undefined)\b/gi;

  /**
   * Este regex aisla el contexto en el que se aplicará el regexDepurator
   */
  private regexDepuratorContext: RegExp = />([^<>]*)\b(true|false|undefined)\b([^<>]*)</gmi;

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
    const temp = template.replace(new MyTemplateEngine().regexDepuratorContext,(match)=>{
      return match.replace(new MyTemplateEngine().regexDepurator,'')
    })
    return temp
  }

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
  }
}