import { ConfigEventI, EventController } from "./eventController.ts";
import { InputController } from "./inputController.ts";
import { LifeComponent } from "./lifeComponent.ts";
import { MyDOM } from "./myDOM.js";
import { MyTemplateEngine } from "./myTemplateEngine.ts";

export interface DirectiveTemplateI {
  on: (name: string, callback: any, options?: ConfigEventI)=>string, 
  inputController: (name: string, stateName: string, callback?: (string: string)=>string)=>string,
  myIf: (predicate: boolean)=>string,
  child: {[x:string]:any}
  children?: (selector:string,builder: any[])=> string
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
  
  childrenAttaching: any = {}
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
  static attachMany(ClassComponent: typeof MyComponent, parent: MyComponent, dataBuilder: any[]){
    throw new Error('implementacion sin terminar')
    // let rootsString = '';
    // dataBuilder.forEach((args)=>{
    //   const newComponent = ClassComponent.factory(args);
    //   if(!MyDOM.getFamily(parent)?.has( newComponent.key)){
    //     MyDOM.setChild(parent, newComponent);
    //   }

    //   newComponent.parent = parent;
    //   rootsString += `<div class="root-component-${newComponent.key}"></div>`;
    // })
    // return rootsString;
  }

  static factory(parentkey:string, key: string, args?: any): any{
    throw new Error('method not implement')
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
    
    MyDOM.getFamily(this)?.forEach(childKey=>{
      const child = MyDOM.getMember(childKey)
      child?.didUnmount();
    })//end foreach
    this.firstMount = false;
    this.rendered = false;
  }//end didUnmount

  /**
   * Método especializado se ejecuta al des-renderizar el componente
  */
 private async didUpdate(){
  if(this.firstMount) return;
    this.inputController.addInputController();
    this.eventController.addEvents();
    
    MyDOM.getFamily(this)?.forEach(childKey=>{
      const child = MyDOM.getMember(childKey)
      child?.didUpdate();
    })//end foreach
    this.rendered = true;
    this.ready();
  }//end didUpdate

  /**
   * Encargada de construir el componente generando el 
   * nodo HTML
   */
  create(wait?: boolean) {
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
      child: this.childrenAttaching
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
    if(!MyDOM.getFamily(parent)?.has( this.key)){
      MyDOM.setChild(parent, this);
    }
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
   
  //  console.log('ja');
   // solo actualizar el componente si el estado a cambiado
   //o si el cambio es del estado global
   if(compare && !forceChange) return;
   this.didUnmount();
   MyDOM.updateTree(this.key);

    //establecemos el estado actual como previo en 
    //espera de una proxima comparación
    this.previusState = this.state ? structuredClone(this.state) : undefined;
    this.didUpdate();
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
      
      // if(this.isRendered){
        console.log(this.key,'no attach');
        this.clear();
      // }
      return;
    };

    // MyDOM.getFamily(this)?.forEach(childKey=>{
    //   const child = MyDOM.getMember(childKey)
    //   const roott = this.body.querySelector(`.root-component-${child?.key}`);
    //   child?.render(roott, false)
    // })

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
  async clear(){
    this.initialized = false;
    this.eventController.removeEvents();
    this.inputController.removeInputController();
    this.$.dispose();
    this.rendered = false;
    this.firstMount = true;
    
    MyDOM.getFamily(this)?.forEach(childKey=>{
      const child = MyDOM.getMember(childKey)
      child?.clear();
    })//end foreach
    MyDOM.removeFamily(this);
    //si existe un padre lo desconectamos de su familia
    this.parent && MyDOM.removeChild(this.parent, this);
    MyDOM.removeMember(this);
  }// end clear
}

