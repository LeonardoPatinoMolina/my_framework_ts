import { ArgsAttach, ChildrenAttachingI, DataBuilder } from "./decorators.ts";
import { ConfigEventI, EventController } from "./eventController.ts";
import { InputController } from "./inputController.ts";
import { LifeComponent } from "./lifeComponent.ts";
import { MyDOM } from "./myDOM.js";
import { MyTemplateEngine } from "./myTemplateEngine.ts";

export interface DirectiveTemplateI {
  on: (name: keyof HTMLElementEventMap, callback: any, options?: ConfigEventI)=>string, 
  inputController: (name: string, stateName: string, callback?: (string: string)=>string)=>string,
  myIf: (predicate: boolean)=>string,
  child: {[x: string]: (args?: ArgsAttach)=>string}
  children: {[x: string]: (dataBuilder: DataBuilder)=>string}
}

export interface BuildArgsI{
  children?: Array<()=>string>,
  props?: any
}

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

  /** espacio de memoria dedicado a almacenar el estado previo del 
   * componente para veirificaciones de reactividad
   */
  private previusState: any;

  /** Stores de datos a las cuales se encuentra subscrito el componente,
   * representan el estado global de la app e igualmente 
   * cuentan con la capacidad de persistir entre re renderizados.
   */
  private _globalStore: any;

  private firstMount: boolean = true;

  private eventController: EventController = new EventController(this);

  private inputController: InputController = new InputController(this);

  private engineTemplate: MyTemplateEngine = new MyTemplateEngine();

  /** Propiedades del componente dispuestas
   * representan los datos que son inyectados desde el constructor
   */
  props: any;
  /** Estado del componente, consiste en una serie
   * de datos con la capacidad de persistir entre re renderizados.
   */
  state: any;

  /** Atributo encargado de subscribir lógica al ciclo de
   * vida del componente
   */
  $!: LifeComponent;

  /** Nodo HTML al que corresponde el presente componente
   * @type {Element}
   */
  body: any;
  
  parent?: MyComponent;
  
  childAttaching: ChildrenAttachingI = {child: 0 as any, children: 0 as any};
  static selector: string

  constructor() {
    
    this.$ = new LifeComponent(this);
    this.attach = this.attach.bind(this)
    this.build = this.build.bind(this)
    this.template = this.template.bind(this)
    this.init = this.init.bind(this)
    this.ready = this.ready.bind(this)
    this.update = this.update.bind(this)
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
  get globalStore(){
    return this._globalStore;
  }
  get isFirstMount(){
    return this.firstMount;
  }
  //SETTERS------------------
  set globalStore(shelf: any){
    this._globalStore = {...this._globalStore, ...shelf}
  }

  setKey(key: string): void{
    this._key = key;
  }
  //STATIC METHODS-------------------
  /**
   * Metodo encargado de realizar un acoplamiento de componentes
   * en lote, esto reduce las manipulaciones de DOM de 1-N a 1
   * por acople
   */
  // static attachMany(ClassComponent: typeof MyComponent, parent: MyComponent, dataBuilder: ({key: string, props?: any})[]){
  //   let rootsString = '';
  //   dataBuilder.forEach((args)=>{
  //     const instance = ClassComponent.factory(parent.key, args.key, args?.props);
  //     rootsString += instance.attach(parent);
  //   })
  //   return rootsString;
  // }

  static factory(parentkey:string, key: string, props?: any): MyComponent{
    throw new Error('this method is only available from a class derived from the MyComponent class with the MyNode decorator.')
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
  ready(){/*método que se espera sea sobre escrito */}

  /**
   * función encargada de ejecutar lógica previa a la 
   * construcción de la plantilla
   */
  build(): string{
    throw new Error('Método sin implementar por clase deribada: '+this.key);
  }//end build
  obtenerPropiedades(): object {
    const propiedades: any = {};
    const keys = Object.getOwnPropertyNames(this);
  
    
    return propiedades;
  }
  /**
   * Método especializado se jecuta al renderizar el componente
   */
  private async didMount(){
    try {
      if(!this.initialized) {
        this.eventController.addEvents();
        this.inputController.addInputController();
        this.$.initialize();
        this.initialized = true;
        this.rendered = true;
        this.ready();
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
  this.engineTemplate.getNodeDepured(element)
  return element;
}

  /**
   * Encargado de generar la plantilla del componente
   */
  template(template: (_: DirectiveTemplateI)=>string): string{
    const obj: DirectiveTemplateI = {
     on: (name, callback, options)=>{
       return this.eventController.onEvent(name, callback, options);
      },
      inputController: (stateName, name, callback)=>{
        return this.inputController.onInputController(stateName,name, callback);
      },
      myIf: this.engineTemplate.myIf,
      child: this.childAttaching.child,
      children: this.childAttaching.children
    }

    let templatetext = template(obj);
    templatetext = this.engineTemplate.getTemplateDepurated(templatetext);
    // templatetext = this.engineTemplate.getTemplateAfterIfDirective(templatetext);
    
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
 update(callback?: ()=>void, forceChange: boolean = false) {
   if(callback) callback();
   
   const compare = JSON.stringify(this.state) === JSON.stringify(this.previusState);
   
    // solo actualizar el componente si el estado a cambiado
    //o si el cambio es forzado
    // if(compare && !forceChange) return;
    MyDOM.notifyInTree(this.key,(node)=>{
      node.instance.didUnmount();
    });

    MyDOM.updateTree(this.key);

    //establecemos el estado actual como previo en 
    //espera de una proxima comparación
    this.previusState = this.state ? structuredClone(this.state) : undefined;
    MyDOM.notifyInTree(this.key,(node)=>{
      node.instance.didUpdate();
    });
  }//end update

  /** Encargada de renderizar el componente en
   * la raiz que se estipule
   */
  render(root: HTMLElement | Element | null , principal = true){
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
    this.rendered = false;
    this.firstMount = true;
  }// end clear
}