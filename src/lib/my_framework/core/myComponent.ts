import { ChildrenAttachingI } from "../decorators/types/myNode.types.ts";
import { EventController } from "./eventController.ts";
import { InputController } from "./inputController.ts";
import { LifeComponent } from "./lifeComponent.ts";
import { MyDOM } from "./myDOM.js";
import { MyTemplateEngine } from "./myTemplateEngine.ts";
import { MyTree } from "./myTree.ts";
import { InputModelI } from "./types/inputController.types.ts";
import { DirectiveTemplateI } from "./types/myComponents.types.ts";

export class MyComponent {
  /** 
   * Variable booleana que refleja el estado de inicialización
   * del componente, esta toma el valor de true cuando el 
   * componente ha sido inicializado
   */
  private initialized: boolean = false;
  /**
   * Variable booleana que refleja el estado de renderización
   * del componente, esta toma el valor de true cuando el 
   * componente ha sido renderizado
   */
  private rendered: boolean = false;
  /** valor único que desitingue al componente dentro del virtual DOM
   * de los demás componentes
   */
  private _key!: string;
  /**
   * Variable booleana que confirma si el componente se 
   * encuentra en su primera montura, es decir, su primera renderización
   */
  private firstMount: boolean = true;
  /**
   * Controlador de eventos del componente
   */
  private eventController: EventController = new EventController(this);
  /**
   * Controlador de campos de texo de formularios del componente
   */
  private inputController: InputController = new InputController(this);
  /**
   * Motor de plantillas del componente
   */
  private engineTemplate: MyTemplateEngine = new MyTemplateEngine(this);
  /**
   * Variable encardada de alamacenar los estilos del componente que serán asignados de forma dinámica
   *  durante renderizado
   */
  private styles?: string;
  /** 
   * Nodo HTML al que corresponde el presente componente
   */
  private _body!: Element;
  /**
   * Propiedad destindad a almacenar el modelo de los inputs que se encuentren en 
   * existencia en el componente
   */
  inputModel?: InputModelI;
  /** Propiedades del componente dispuestas
   * representan los datos que son inyectados desde el componente padre
   */
  props?: any;
  /** Atributo encargado de subscribir lógica al ciclo de
   * vida del componente
   */
  $: LifeComponent = new LifeComponent(this);
  /**
   * Componente padre
   */
  parent?: MyComponent;
  /**
   * Este método indexa todos los hijos potenciales
   * estos son todos los nodos que han sido declarados en el módulo al que pertenece el presente componente.
   * La diferenciación ente child y children es debido a que cada uno reserva una capa interceptora en la cual se realiza
   * un manejo distinto del emparentamiento y la injeción de props
   */
  childAttaching: ChildrenAttachingI = {child: 0 as any, children: 0 as any};
  /**
   * Virtual dom local del componente
   */
  myTree: MyTree = new MyTree(this);
  /**
   * Slelector de la clase de componente
   */
  static selector: string;
  /**
   * Modulo al que pertence la clase del componente
   */
  static module: any;

  constructor(svc?: any) {
    this.attach = this.attach.bind(this)
    this.template = this.template.bind(this)
    this.refresh = this.refresh.bind(this)
    this.render = this.render.bind(this)
    this.clear = this.clear.bind(this)
    this.addStyles = this.addStyles.bind(this)
  }//end constructor

  //GETTERS------------------
  get key(){
    return this._key;
  }
  get isInitialized(){
    return this.initialized;
  }
  get isRendered(){
    return this.rendered;
  }
  get isFirstMount(){
    return this.firstMount;
  }
  get body(){
    return this._body.cloneNode(true) as Element;
  }
  //SETTERS------------------
  setKey(key: string): void{
    this._key = key;
  }
  setStyle(style?: string): void{
    this.styles = style;
  }
  setBody(body: Element): void{
    this._body = body;
  }
  //STATIC METHODS-------------------

  static factory(parentkey:string, key: string, props?: any): MyComponent{
    throw new Error('Este método solo está disponible en una clase derivada de MyComponent que haya sido decorada con el decorador "MyNode"')
  };

  //PRIVATE METHODS------------
  /**
   * Método encargado de añadir los estilos por renderizado,
   * estos son estilos que solo estaran disponibles en el BOM 
   * mientras que el presnete componente esté renderizado
   */
  private addStyles(){
    if(!this.styles) return;
      const styleElement = document.createElement('style');
      styleElement.innerHTML = this.styles;
      styleElement.id = `${this.key}-style-head`;
      document.head.appendChild(styleElement);
  }// end addStyles

    /**
   * Método encargado de remover los estilos al des-renderizado
   * al des-renderzar el componente,
   */
  private removeStyles(){
    if(!this.styles) return;
    const target = document.getElementById(`${this.key}-style-head`);
    if(target) document.head.removeChild(target);
  }
  
  /**
   * Método especializado se jecuta al finalizar la renderización del componente
   */
  private async didMount(){
    if(this.initialized) return;
    this.eventController.addEvents();
    this.inputController.addInputController();
    this.initialized = true;
    this.rendered = true;
    this.ready();
    this.addStyles();
    this.$.initialize();
  }//end didMount

  /**
   * Método especializado se ejecuta al des-renderizar el componente
  */
  private async didUnmount(){
    if(!this.initialized) return;
    this.eventController.removeEvents();
    this.inputController.removeInputController();
    this.firstMount = false;
    this.rendered = false;
  }//end didUnmount

  /**
  * Método especializado se ejecuta cuando el componente se ha actualizado exitosamente
  */
  private async didUpdate(){
    if(this.firstMount) return;
    this.inputController.addInputController();
    this.eventController.addEvents();
    this.rendered = true;
    this.ready();
  }//end didUpdate

  /**
  * Transforma un texto plano en nodos html
  */
  private string2html = (str: string): Element => {
    let parser = new DOMParser();
    let doc = parser.parseFromString(str, "text/html");
    const element = doc.body.children[0];
    return element;
  }// strin2html

  /**
   * Método encargado de verificar si un componente ha sido desrenderizado y lo elimina del árbol 
   * en consecuencia
   */
  private checkUnRender(): boolean{
    const root = document.querySelector(`[data-rootcomponent-key="${this.key}"]`)
    if(root === null) {
      /**
       * si la raíz no existe significa que el componente
       * ha sido desrenderizado por ende podemos removerlo del 
       * arbol
       */
      MyDOM.notifyInTreeReverse(this.key,(node)=>{
        node.instance.clear();
        node.instance.parent && MyDOM.deleteChildNode(node.instance.parent.key, node.instance.key)
        MyDOM.deleteNode(node.instance.key);
      })
      return true;
    };
    return false
  }//end checkUnrender

  //PUBLIC METHODS-------------------------------

 /**
  * Método encardado de ejecutarse al instanciar el componente
  * con la finalidad de inicializar props
  */
  init(){/*método que se espera sea sobre escrito */}

 /**
  * Método encargado de ejecutarse cuando el nodo HTML que 
  * representa al componente se encuentre disponible
  */
  ready(): void{/*método que se espera sea sobre escrito */}
  
  /**
   * función encargada de ejecutar lógica previa a la 
   * construcción de la plantilla
   */
  build(): string{
    throw new Error('Método sin implementar por clasederibada: '+this.key);
  }//end build

  /**
   * función encargada de ejecutar lógica previa aldesrenderizado definitivo del
   * componente, es decir durante la eliminación del mismo
   */
  destroy(): void{/*método que se espera sea sobre escrito*/}
  //end destroy

  /**
   * Encargada de construir el componente generando el 
   * nodo HTML
   */
  create() {
    //convertimos el template a un nodo del DOM
    const componentNode = this.string2html(this.build());
    if(this.props === undefined) componentNode.setAttribute('data-rootcomponent-outcast','true')
    componentNode.setAttribute('data-rootcomponent-key',this.key);
    this.setBody(componentNode)
  }//end create

  /**
   * Encargado de generar la plantilla del componente
   */
  template(builder: (_: DirectiveTemplateI)=>string): string{
    return this.engineTemplate.buildTemplate(builder, this.eventController,this.inputController)
  }//end template

  /**
   * Encargada de acoplar el componente hijo al padre y retornar la 
   * sintaxis html del componente actual
   */
  attach(parent: MyComponent): string{
    this.parent = parent;
    return this.body.outerHTML;
  }//end attach

  /**
   * Método encargado de actualizar un componente que lo requiera,
   * es decir, un componente mutable
  */
 refresh(callback?: ()=>void) {
   if(!!callback) callback();
   
    MyDOM.notifyInTree(this.key,(node)=>{
      node.instance.didUnmount();
    });

    this.create()
    const targetRoot = document.querySelector(`[data-rootcomponent-key="${this.key}"]`)
    if(!targetRoot) throw new Error('no se encontro el nodo del componente')
    this.myTree.update(targetRoot)
    
    //establecemos el estado actual como previo en 
    //espera de una proxima comparación
    MyDOM.notifyInTree(this.key,(node)=>{
      // en caso de desrenderizado, ignotar notificaciones
      if(node.instance.checkUnRender()) return;
      // en caso de ser la primera montura, notificar didMount();
      if(node.instance.isFirstMount) node.instance.didMount();
      // en caso contrario notificar actualización didUpdate();
      else node.instance.didUpdate();
    });
  }//end update
 
  /** 
   * Encargada de renderizar el componente en
   * la raiz que se estipule
   */
  render(root?: HTMLElement | Element | null){
    if(root){
      root!.innerHTML = '';
      root?.appendChild(this.body);
    }
    this.didMount();
  }//end render

  /**
   * Método que establece que el componente debe ser liberado de memoria
   * se espera que este método sea empleado al momento
   * de cambiar de página en el enrutador.
   */
  clear(){
    this.initialized = false;
    this.eventController.removeEvents();
    this.inputController.removeInputController();
    this.$.dispose();
    this.removeStyles();
    this.destroy();
    this.rendered = false;
    this.firstMount = true;
  }// end clear
}