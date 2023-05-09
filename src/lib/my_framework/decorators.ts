import { v4 as uuid } from "uuid";
import { MyComponent } from "./myComponent";
import { MyDOM } from "./myDOM";

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
        if(MyDOM.isInTree(key)){
          
          const comp = MyDOM.getMemberNode(key)
          if(!comp) throw new Error('El componente '+key+' no existe en el arbol de componentes')
          comp.instance.props = props;
          comp.instance.create();
          return comp.instance
        }
        
        // Realizar acciones adicionales con la instancia
        const instancia = new this() as MyComponent;
        instancia.props = props;
        instancia.setKey(key);
        //variable auxiliar para verificar los  tipos del interceptor
        let currentTypeComponent: any;
        const arrC = Fargs?.children?.reduce((acc, cur)=>{
          const nkey = MyDOM.generateNewKey()

          //interceptor encargado de evitar redundancia de key cuando 
          //una misma clase del componente se renderiza en más de iuna ocación
          const interceptorT = (oldKey: string)=>{
            if(cur.component !== currentTypeComponent){
              currentTypeComponent = cur.component;
              return oldKey;
            }
            const newK = oldKey.split('-')
            return `comp-${newK[1] + uuid()}-key`
          }

          //función encargada de ejecutar logica en cada renderizado desde template
          const wrapper = ( interceptorType: any, propsC?: any,)=>{

            const inst = cur.component.factory(key,interceptorType(nkey),propsC)
            return inst.attach(instancia)
          }
          return {...acc, [cur.component.selector]: (propsC?: any)=> wrapper(interceptorT, propsC)}
        },{}) ?? {}
        instancia.childrenAttaching = arrC;
        
        //firma para dom virtual
        if(parentKey !== '0') {
          MyDOM.addMember({
            key,
            instance: instancia,
            children: new Map()
          }, parentKey)
        }
        MyDOM.initFamily(instancia);
        MyDOM.setMember(instancia);
        instancia.init();
        instancia.create();

        return instancia;
      }
    };//end class extends
  };//end return

}
