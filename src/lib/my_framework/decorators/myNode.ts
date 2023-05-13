import { MyNodeI } from "@my_framework/core/types/myDOM.types";
import { ArgsAttachI, ChildrenAttachingI, DataBuilderT, FamilyArgsI } from "@my_framework/decorators/types/myNode.types";
import { MyComponent } from "../core/myComponent";
import { MyDOM } from "../core/myDOM";


/**
 * Decorador encargado de acoplar el componente al árbol principal y ejecutar métodos 
 * relacionados a su construcción
 */
export function MyNode(Fargs: FamilyArgsI) {

  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      constructor(...args: any) {
        super(...args);
      }

      static selector: string = Fargs.selector;
      
      static factory(parentKey: string, key: string, props?: any): MyComponent {
        if(MyDOM.isInTree(key) && parentKey !== 'root'){ 
          if(parentKey === 'root'){
            const comp1 = MyDOM.getMemberNode(key)!
            comp1.instance.create();
            return comp1.instance
          }
          const comp = MyDOM.getMemberNode(key)
          
          if(!comp) throw new Error('El componente '+key+' no existe en el arbol de componentes')
          comp.instance.props = props ?? {};
          comp.instance.create();
          return comp.instance
        }
        
        // Realizar acciones adicionales con la instancia
         let services: any = Fargs.services?.reduce((acc, cur: any)=>{
          return {...acc, [cur.serviceName]: new cur()}
        },{});
        
        const instancia = new this(services) as MyComponent;
        instancia.props = props;
        instancia.setKey(key);

        //firma para dom virtual
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
        const directiveChildren: ChildrenAttachingI = Fargs?.children?.reduce((acc, cur, indx)=>{
          const parentKeyuninqe = key.split('__')
          
          const nkey = `comp__${this.selector}__${cur.selector}__${parentKeyuninqe[4]}__${indx}__key`

          /**
           * interceptor encargado de evitar redundancia de key cuando 
           * una misma clase del componente se renderiza en más de una ocación 
           */
          const interceptorT = (oldKey?: string)=>{
            if(oldKey) return `comp__${this.selector}__${cur.selector}__${parentKeyuninqe[4]}__${oldKey}__key`
            return nkey
          }

          /**
           * Función wrapper encargada de envolver el proceso de 
           * attaching del componente, es decir, ejecuta lógica antes de acomplar el componente
           * al template, en esta capa se dota de su key única además de emparentarlo
           * en el árbol, es a través de este que se injectan las props en le template
           */
          const wrapperAttachOne = (childKey: string, propsC?: any,): string=>{
            const inst = cur.factory(key,childKey,propsC);//instanciamos el componente
            //emparentamos con el nodo padre
            const parentNode = MyDOM.getMemberNode(key)!;
            parentNode.children.add(childKey);
            
            return inst.attach(instancia);
          }
          const wrapperAttachmany = (builder: DataBuilderT): string => {
            const realiceAttach = builder.reduce((accData,curData)=>{
              accData += wrapperAttachOne(interceptorT(curData.key), curData.props)
              return accData;
            },'')
            
            return realiceAttach;
          }

          return {
            children: {
              ...acc.children, 
              [cur.selector]: (dataBuilder: DataBuilderT)=>wrapperAttachmany(dataBuilder)
            },
            child: {
              ...acc.child, 
              [cur.selector]: (args?: ArgsAttachI)=> wrapperAttachOne(interceptorT(args?.key), args?.props)
            } 
          }
        },{child: {}, children: {}} as any) ?? {}
        if(Fargs?.children?.length){
          instancia.childAttaching.child = directiveChildren.child;
          instancia.childAttaching.children = directiveChildren.children;
        }
        
        instancia.init();
        instancia.create();

        return instancia;
      }
    };//end class extends
  };//end return

}

