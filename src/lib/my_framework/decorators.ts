import { MyDOM } from "./myDOM";
import { MyComponent } from "./mycomponent";

interface TDataBuilder {
  key: string,
  agrs?: {
    props?: any
  }
}

interface ChildI {
  component: typeof MyComponent,
  selector: string,
  attachMany?: boolean,
  dataBuilder?: TDataBuilder[]
}
interface FamilyArgs{
  children?: ChildI[],
}


/**
 * Decorador encargado de acoplar el componente al árbol principal y ejecutar métodos 
 * relacionados a su construcción
 */
export function MyNode(Fargs?: FamilyArgs) {


  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      constructor(...args: any) {
        super(...args);
      }

      static create$(key: string, props?: any): any {
        if(MyDOM.memberCompare(key)){
          const comp = MyDOM.getMember(key!);
          if(!comp) throw new Error('El componente '+key+' no existe en el arbol de componentes')
          comp.props = props;
          comp.create();
          return comp
        }
        
        // Realizar acciones adicionales con la instancia
        const instancia = new this() as MyComponent;
        instancia.props = props;

        const getKey = (key: string)=>{
          const firm: string[] = key.split('-');
          instancia.setKey(`${firm[0]}-${firm[1]}-0`)
          
          const arrC = Fargs?.children?.reduce((acc, cur, indx)=>{
            instancia.setKey(`${firm[0]}-${firm[1]}-1`)

            return {...acc, [cur.selector]: (props?: any)=>cur.component.create$(`${firm[0]}-${indx + 1}-0`, props).attach(instancia)}


          },{}) ?? {}
          instancia.childrenAttaching = arrC;
        }
        getKey(key);
        
        instancia.init();
        MyDOM.initFamily(instancia);
        MyDOM.setMember(instancia);
        instancia.create();
        return instancia;
      }
    };//end class extends
  };//end return
}

