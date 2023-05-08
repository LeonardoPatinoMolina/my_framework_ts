export class MyTemplateEngine{
    
  /**
   * este regex depura el template en busca de palabras reservadas de js
   */
  private regexDepurator: RegExp = /\b(?:true|false|undefined)\b/gi;
  /**
   * este regex depura el template en busca de la directiva todelete en una etiqueta con renderizado condicional
   */
  private regexTodelete: RegExp =  /<(\w+)[^>]*?\[todelete\][^>]*>(?:[\s\S]*?(<\/\1>)|$)/gm;
  private regexToMultiply: RegExp =  /<(\w+)[^>]*?\[tomultiply\][^>]*>(?:[\s\S]*?(<\/\1>)|$)/gm;
  private regexToFor: RegExp =  /<(\w+)[^>]*?\[tofor\][^>]*>(?:[\s\S]*?(<\/\1>)|$)/gm;


  myIf(predicate: boolean): string{
    return predicate ? '': '[todelete]'
  }
  myMul(predicate: boolean): string{
    return predicate ? '': '[tomultiply]'
  }
  myFor(predicate: boolean): string{
    return predicate ? '': '[tofor]'
  }

  /**
   * Método encargado de depurar el template de palabras reservadas
   */
  getTemplateDepurated(template: string): string{
    return template.replace(new MyTemplateEngine().regexDepurator,'')
  }

  /**
   * Método encargado de establecer los cambios de la directiva myIf
   */
  getTemplateAfterIfDirective(template: string): string{
    return template.replace(new MyTemplateEngine().regexTodelete,'')
  }

  getTemplateFored(template: string): string{
    return ''
  }
}