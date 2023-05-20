import { MyModuleT } from "../decorators/myModule.ts";
import { ChildrenAttachingI } from "../decorators/types/myNode.types.ts";
import { EventController } from "./eventController.ts";
import { InputController } from "./inputController.ts";
import { LifeComponent } from "./lifeComponent.ts";
import { MyDOM } from "./myDOM.js";
import { MyTemplateEngine } from "./myTemplateEngine.ts";
import { InputModelI } from "./types/inputController.types.ts";
import { DirectiveTemplateI } from "./types/myComponents.types.ts";


export class MyComponent {

  /** flag que determina si el componente se encuentra
   * o no, previamnte inicializado
   */
  private initialized: boolean = false;
  /** flag que determina si el componente se encuentra
   * o no renderizado
   */
  private rendered: boolean = false;

  /** valor único que desitingue al componente dentro del virtual DOM
   * de los demás componentes
   */
  private _key!: string;

  private _module!: MyModuleT;
  private firstMount: boolean = true;

  private eventController: EventController = new EventController(this);

  private inputController: InputController = new InputController(this);

  private engineTemplate: MyTemplateEngine = new MyTemplateEngine();

  /**
   * Propiedad destindad a almacenar el modelo de los inputs que se encuentren en 
   * existencia en el componente
   */
  inputModel!: InputModelI;

  /** Propiedades del componente dispuestas
   * representan los datos que son inyectados desde el constructor
   */
  props: any;

  styles?: string;

  /** Atributo encargado de subscribir lógica al ciclo de
   * vida del componente
   */
  $: LifeComponent = new LifeComponent(this);

  /** Nodo HTML al que corresponde el presente componente
   * @type {Element}
   */
  body: any;
  
  parent?: MyComponent;
  
  childAttaching: ChildrenAttachingI = {child: 0 as any, children: 0 as any};
  static selector: string;
  static module: any;

  pendingAttach: Map<string, Map<string,any>> = new Map<string, Map<string,any>>();


  constructor(svc?: any) {
    this.attach = this.attach.bind(this)
    this.template = this.template.bind(this)
    this.refresh = this.refresh.bind(this)
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
  //SETTERS------------------
  setKey(key: string): void{
    this._key = key;
  }
  setModule(module: MyModuleT): void{
    this._module = module;
  }
  //STATIC METHODS-------------------

  static factory(parentkey:string, key: string, props?: any): MyComponent{
    throw new Error('This method is only available from a class derived from the MyComponent class with the MyNode decorator.')
  };

  //METHODS------------
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
    throw new Error('Método sin implementar por clase deribada: '+this.key);
  }//end build

  /**
   * función encargada de ejecutar lógica previa al desrenderizado definitivo del
   * componente, es decir durante la eliminación del mismo
   */
  destroy(): void{/*método que se espera sea sobre escrito */}//end destroy

  private addStyles(){
    if(!this.styles) return;
      const styleElement = document.createElement('style');
      styleElement.innerHTML = this.styles;
      styleElement.id = `${this.key}-style-head`;
      document.head.appendChild(styleElement);
  }// end addStyles

  private removeStyles(){
    if(!this.styles) return;
    const target = document.getElementById(`${this.key}-style-head`);
    if(target) document.head.removeChild(target);
  }
  
  /**
   * Método especializado se jecuta al finalizar la renderización del componente
   */
  private async didMount(){
    try {
      if(!this.initialized) {
        this.eventController.addEvents();
        this.inputController.addInputController();
        this.initialized = true;
        this.rendered = true;
        this.ready();
        this.addStyles();
        this.$.initialize();
      }
    } catch (error) {
      console.error(error);
    }
  }//end didMount

  /**
   * Método especializado se ejecuta al des-renderizar el componente
   * 
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
   * Encargada de construir el componente generando el 
   * nodo HTML
   */
  create() {
    //convertimos el template a un nodo del DOM
    const componentNode = this.string2html(this.build());
    this.body = componentNode;
  }//end create

/**
 * Transforma un texto plano en nodos html
 */
  private string2html = (str: string): Element => {
  let parser = new DOMParser();
  let doc = parser.parseFromString(str, "text/html");
  const element = doc.body.children[0];
  return element;
}

  /**
   * Encargado de generar la plantilla del componente
   */
  template(builder: (_: DirectiveTemplateI)=>string): string{

    const obj: DirectiveTemplateI = {
     on: (name, callback, options)=>{
       return this.eventController.onEvent(name, callback, options);
      },
      inputController: (modelName, name, callback)=>{
        return this.inputController.onInputController(modelName, name, callback);
      },
      myIf: this.engineTemplate.myIf,
      child: this.childAttaching.child,
      children: this.childAttaching.children,
      myMul: this.engineTemplate.myMul
    }

    let templatetext = builder(obj);
    templatetext = this.engineTemplate.getTemplateDepurated(templatetext);
    templatetext = this.engineTemplate.gettemplateDepuratedStr(templatetext);
    
    return templatetext;
  }//end template

  /**
   * Encargada de acoplar el componente hijo al padre y retornar una raíz para futuro renderizado
   */
  attach(parent: MyComponent): string{
    this.parent = parent;
    return `<div id="root-${this.key}"></div>`;
  }//end attach

  /**
   * Método encargado de actualizar un componente que lo requiera,
   * es decir, un componente mutable
  */
 refresh(callback?: ()=>void, forceChange: boolean = false) {
   if(callback) callback();
   
    MyDOM.notifyInTree(this.key,(node)=>{
      node.instance.didUnmount();
    });

    MyDOM.updateTree(this.key);

    //establecemos el estado actual como previo en 
    //espera de una proxima comparación
    MyDOM.notifyInTree(this.key,(node)=>{
      node.instance.didUpdate();
    });
  }//end update

  /** Encargada de renderizar el componente en
   * la raiz que se estipule
   */
  render(root: HTMLElement | Element | null , principal = false){
    if(root === null) {
      /**
       * si la raíz no existe significa que el componente
       * ha sido desrenderizado por ende podemos removerlo del 
       * arbol
       */
      console.log(this.key);
      
      MyDOM.notifyInTreeReverse(this.key,(node)=>{
        node.instance.clear();
        node.instance.parent && MyDOM.deleteChildNode(node.instance.parent.key, node.instance.key)
        MyDOM.deleteNode(node.instance.key);
      })
      return;
    };

    if(principal){
      root.innerHTML = '';
      root.appendChild(this.body);
    }else{
      root.replaceWith(this.body);
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

export function child(){
  
}