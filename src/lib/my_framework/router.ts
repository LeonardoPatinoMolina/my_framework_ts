import { MyComponent } from "./myComponent.ts";
import { MyDOM } from "./myDOM.ts";

export class MyRouter {
  static instanceRouter: MyRouter;

 private routes: Map<string, string[]> = new Map()
 
  private notFound?: typeof MyComponent;

  currentPage!: MyComponent;

  pages!: Map<string, typeof MyComponent>;

  constructor(args?: {pages: Map<string, typeof MyComponent>, notFound: typeof MyComponent}){
    if(!!MyRouter.instanceRouter){
      return MyRouter.instanceRouter;
    }

    this.pages = args?.pages!;

    //obtenemos los params de cada ruta y 
    //nos deshacemos de su declaración
    const newPages = new Map()
    this.pages.forEach((value, k)=>{
      //removemos los params de la ruta
      const newKey = k.slice(0, k.indexOf(':') === -1 ? k.length : k.indexOf(':') - 1);
      newPages.set(newKey, value);

      //almacenamos los params de la ruta
      const ss = k.slice(k.indexOf(':') === -1 ? 0 :k.indexOf(':'));
      //expreción regular para remover barras
      const rg = /[/]/g;
      const ns = ss.replace(rg,'').split(':');
      ns.shift();//removemos el espacio en blanco
      this.routes.set(newKey,ns);
    })//end foreach
    this.pages = newPages;
    this.notFound = args?.notFound;

    window.addEventListener('popstate',()=>{
      this.renderRoute();
    });

    window.addEventListener('DOMContentLoaded',()=>{
      this.renderRoute();
    });

    MyRouter.instanceRouter = this;
  }

  private renderRoute(){
    const path = window.location.pathname;
    const page = this.pages.get(path) ?? this.notFound; 
    
    const dom = new MyDOM();
    MyDOM.clearDOM();
    const newPage = page ? new page() : undefined;
    newPage?.render(dom.root!);

    this.currentPage?.clear();
    this.currentPage = newPage!;
  }

  /**
   * Método encargado de navegar a otra página
   */
  static go(path: string): void{
    //separamos los params de la ruta
    //los params están encerrados en llaves {},
    //las ubicamos y los aislamos
    const inOf_ = path.indexOf('{');
    //ruta limpiamasociada a la page
    const cleanPath = path.slice(0, inOf_ === -1 ? path.length : inOf_ -1)
    const paramsPath = path.slice(inOf_ !== -1 ? inOf_ : path.length, path.length).replace('/','');
    const params = paramsPath.split(/{|}/).filter(e=>e !== '');

    const router = new MyRouter();
    if(!router.pages.has(cleanPath)) return;

    window.history.pushState({path: cleanPath, params}, path, window.location.origin + cleanPath);
    new MyRouter().renderRoute();
  }

  /**
   * Método que navegar hacia atrás en la navegación
   */
  static back(){
    window.history.back()
  }

  /**
   * Método que navegar hacia adelante en la navegación
   */
  static next(){
    window.history.forward()
  }

  static params(): any{
    const router = new MyRouter();
    const hState = history.state;
    const routes = router.routes.get(hState?.path);

    //creamos un objeto a partir de las rutas y los params asociados
    //esto es posible gracias a que el orden de los
    //elementos es equivalente en ambos arreglos
    const params =  routes?.reduce((acc, cur, indx) => {
      return { ...acc, [cur]: hState.params[indx] };
    }, {});

    return params;
  }
}