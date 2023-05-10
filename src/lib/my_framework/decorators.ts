import { MyComponent } from "./myComponent";
import { MyDOM, MyNodeI } from "./myDOM";

interface TDataBuilder {
  key: string,
  agrs?: {
    props?: any
  }
}

interface ChildI {
  component: typeof MyComponent,
  attachMany?: boolean,
  dataBuilder?: TDataBuilder[]
}
interface FamilyArgs{
  selector: string;
  children?: ChildI[],
}


/**
 * Decorador encargado de acoplar el componente al árbol principal y ejecutar métodos 
 * relacionados a su construcción
 */
export function MyNode(Fargs: FamilyArgs) {

  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      constructor(...args: any) {
        super(...args);
      }

      static selector: string = Fargs.selector;
      
      static factory(parentKey: string, key: string, props?: any): any {
        if(MyDOM.isInTree(key) && parentKey !== 'root'){ 
          const comp = MyDOM.getMemberNode(key)
          
          if(!comp) throw new Error('El componente '+key+' no existe en el arbol de componentes')
          comp.instance.props = props ?? {};
          comp.instance.create();
          return comp.instance
        }
        
        // Realizar acciones adicionales con la instancia
        const instancia = new this() as MyComponent;
        instancia.props = props;
        instancia.setKey(key);

        const newNode: MyNodeI = {
          key,
          instance: instancia,
          children: new Set(),
          parentKey
        }

        if(parentKey !== 'root') {
          MyDOM.addMember(newNode)
        }

        //variable auxiliar para verificar los  tipos del interceptor
        let currentTypeComponent: any = MyComponent;
        let auxCounter: number = 1;
        const arrC = Fargs?.children?.reduce((acc, cur, indx)=>{
          
          const nkey = `comp__${cur.component.selector}__${indx}__key`

          /**
           * interceptor encargado de evitar redundancia de key cuando 
           * una misma clase del componente se renderiza en más de una ocación 
           */
          const interceptorT = (oldKey: string)=>{
            if(!MyDOM.isInTree(oldKey)){
            // if(cur.component !== currentTypeComponent){
              currentTypeComponent = cur.component;
              auxCounter = 1;
              return oldKey;
            }
            
            const i = parseInt(oldKey.split('__')[2])
            const k = `comp__${cur.component.selector}__${(i + auxCounter)}__key`
            auxCounter += 1;
            return k;
          }

          /**
           * Función wrapper encargada de envolver el proceso de 
           * attaching del componente, es decir, ejecuta lógica antes de acomplar el componente
           * al template, en esta capa se dota de su key única además de emparentarlo
           * en el árbol, es a través de este que se injectan las props en le template
           */
          const wrapperAttach = ( interceptorType: any, propsC?: any,)=>{
            
            const childKey = interceptorType(nkey)//obtenemos la key segura
            const inst = cur.component.factory(key,childKey,propsC);//instanciamos el componente
            //emparentamos con el nodo padre
            const parentNode = MyDOM.getMemberNode(newNode.key)!;
            parentNode.children.add(childKey);
            
            return inst.attach(instancia);
          }
          return {...acc, [cur.component.selector]: (propsC?: any)=> wrapperAttach(interceptorT, propsC)}
        },{}) ?? {}
        instancia.childrenAttaching = arrC;
        
        //firma para dom virtual
        
        MyDOM.initFamily(instancia);
        MyDOM.setMember(instancia);
        
        instancia.init();
        instancia.create();

        return instancia;
      }
    };//end class extends
  };//end return

}

