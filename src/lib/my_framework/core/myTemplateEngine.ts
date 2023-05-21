export class MyTemplateEngine{
    
  /**
   * este regex depura el template en busca de palabras reservadas de js
   */
  private regexDepurator: RegExp = /\b(?:true|false|undefined)\b/gi;
  /**
   * este regex depura el template en busca de la directiva todelete en una etiqueta con renderizado condicional
   */
  private regexToMultiply: RegExp =  /<(\w+)[^>]*?\[tomultiply\][^>]*>(?:[\s\S]*?(<\/\1>)|$)/gm;
  private regexToFor: RegExp =  /<(\w+)[^>]*?\[tofor\][^>]*>(?:[\s\S]*?(<\/\1>)|$)/gm;


  myIf(predicate: boolean): string{
    return predicate ? '': ' if-to-delete '
  }
  myMul(amount: number): string{
    return ` mul-to-multiply="${amount}" `
  }
  myFor(amount: number): string{
    return 0 ? '': 'for-'
  }

  /**
   * Método encargado de depurar el template de palabras reservadas
   */
  getTemplateDepurated(template: string): string{
    return template.replace(new MyTemplateEngine().regexDepurator,'')
  }

  getTemplateMultiply(template: string): string{
    
    return ''
  }

  gettemplateDepuratedStr(template: string): string{

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