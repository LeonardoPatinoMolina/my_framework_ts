# __My Framework TS__

<p align="center">
  <img src="https://i.postimg.cc/RhrgmkP4/logo-myframework-ts-big.png" width="40%" height="auto" alt="my framework logo" title="my framework logo">
</p>

El presente ejercicio es una versión potenciada de uno anterior llamado __[My framework](https://github.com/LeonardoPatinoMolina/my-framework)__, en el cual me propuse crear un framework front-end de _javascript_ desde los cimientos teniendo como única dependencia de terceros __vite__; en esta ocasión fui un paso más adelante y apunté a mejorar muchas carácterísticas que resultaron bastante problemáticas luego de experimentar con casos de prueva más elavorados.

Otro punto a destacar es que my framework apuntaba a ser un reproducción de __React.js__, pero recientemente he interactuado con otras tecnologías como __Angular 16__ y puedo decir que, exponerme a otras posibilidades y enfoques influyó directamente en el futuro de este proyecto.

El primer gran salto que salta a la vista es la incluisión de __Typescript__ como base, haciendo que su nombre cambie a __My Framework TS__

## __Cuadro comparativo My Framework vs My Framework TS__
Aspecto a comparar |My Framework|My Framework TS|
|-|-|-|
|__Ciclo de vida de componentes__|Se encuentra centralizado en el funcionamiento de un atributo __$__ el cual es capaz de ejecutar lógica reactiva, esta característica sería análoga a useEffect de React.js. Respecto a la participación del ciclo en el _store global_, se encuentra acoplado de forma tal, que la propagación de una modificación del store al cual se encuentra subscrito, demanda un re-renderizado obligatorio.|Además de su atributo __$__, posee un métodos adicional ``"destroy()"`` específico para la des-renderización del componente, pudiendo ejecutar lógica durante dicho evento. Los re-renderizados obligatorios por demanda del store global han sido reemplazados por una implementación del patrón observer, en el cual, el componente cuenta con una notificación en virtud de la modificación del store al cual se encuentra subscrito, el componente puede ejecutar lógica en consecuencia pudiendo decidir si se re-renderiza o no|
|__Renderizado condicional de componentes y nodos__|Todos los componentes tienen la capacidad de renderizarse en cualquier momento que se demande, incluso pueden hacerlo por lotes, todo ello en base a un sistema de attaching, en el cual el componente debe ejecutar un método en el __template__ donde fijará una raíz de referencia; sin embargo, cada componente renderizado demanda una __key__ única, de lo contrario su comportamiento no será el esperado. En cuanto al renderizado condicional de nodos comunes, puede lograrse con interpolación de lógica en el template, pero realmente  no es una caracteística contemplada en my framework|Todos los componentes tienen la capacidad de renderizarse en cualquier momento que se demande, incluso pueden hacerlo por lotes, todo ello en base a una conbinación de __selector__ y __llave (key)__, esto consiste en un sistema de parentezco mediado por módulos, donde el componente debe declararse como nodo de un módulo y hasta entonces puede implementarse en el __template__, la ventaja de este sistema frente al anterior es una reducción del riesgo de conflicto entre keys, esto surgió por una serie de problemas que emergían del previo sistema de llaves por componente. En cuanto al renderizado condicional de nodos comunes, hay a disposición del template dos directivas estructurales diseñadas específicamente para ello, inspirado en __Angular 16__|
|__Estado local de componente__|Todo el estado del componente está centralizado en una propiedad __state__ específica de la clase del componente, esta tiene la capacidad de persistir entre re-renderizados. Existe un método explicito para actualizar el estado del componente, este funciona de forma similar al método __setState()__ de los _StateFulWidget_ de __Flutter__, el cual evalúa si hubo algún cambio en el estado del componente y lo re-renderiza en consecuencia, en caso de no hallar cambios, simplemente ignora su invocación.|El estado del componente se encuentra descentralizado, en sí, toda la clase persiste entre re renderizados, esto debido a que el sistema de instanciamiento de componentes es mucho más sofísticado y cualquier propiedad puede ser usada como almacén de datos persistente, al igual que un estado común, estos no persisten ante un des-renderizado del componente, el método de actualizado de estado fue reemplazado por un método "__refresco__", la principal ventaja de este cambio es que ahora sí disponemos de todo el cuerpo de la clase para ejecutar lógica, pudiendo declarar métodos y utilizarlos en el template, algo impensable en my framework|
|__Enrutamiento__|Cuenta con un sistema de enrutamiento sencillo del lado del cliente capaz de renderizar páginas de forma satisfactoria y añadir estados al historial de navegación|Conserba el mismo principio del sistema de enrutamiento de my framework, pero el enfoque es distinto, pues ahora se enrutan módulos en lugar de componentes, y la sintaxis de implementación de params entre navegación es un poco más imperativa para evitar sobrecargas de cómputo|
|__Virtual DOM__|Técnicamente inexistente, el único DOM virtual que implementa my framework refleja la estructura del ``álrbol de componentes``, en otras palabras, my framework solo se preocupa por la dispocisión estructural de los componentes, no del DOM. Debido a que cada componente guarda una referencia de su nodo raíz, no requieren mayor información del DOM que esa|My framework ts posee un sistema de DOM virtual dinámico y parcial, es decir, cada componente posee su propio __virtual DOM__ para efectos del __algoritmo de reconciliación__, este refleja la disposición estructural de los nodos del DOM que corresponden al componente y es generado en el primer render y durante cada re-renderizado con propósitos de reactividad|
|__Reactividad__|El sistema de reactividad de my framework se basa en un redibujado de la interfaz a __nivel de componente__, esto significa que cada véz que se demanda una actualización de la vista, no importa que tan ``insignificante`` sea el cambio, todo el árbol de nodos del componente será redibujado, incluyendo sus componentes hijos, esto garantiza que la actualización de la vista será efectiva y reflejará todos los cambios efectuados en el template|La reactividad en my framework ts se basa en un sensillo __algoritmo de reconciliación__, este realiza un análisis del __dom virtual__ que refleja los cambios efectuados en el template y lo compara con el __DOM__ actual en busca de discrepancias, en caso de hallarlas realiza las modificaciones correspondientes. Este sistema de reactividad implica un redibujado de la interfaz a __nivel de nodo__, es decir, cada vez que se demanda un refresco de la vista, el algoritmo se encarga que solo los nodos que presenten cambios sean afectados|

<hr>

## __Tecnologías__
Las tecnologías empleadas son __HTML 5__ y __Javascrit ES6__, los estilos no son objeto de interés para el presente ejercicio, solamente la estructura y manipulación de la interfaz; al contar con html para el maquetado, puede aplicarse cualquiera de los estilizados que este admita: __CSS__, __SASS__, etc.

<hr>

## __Entrada de la App__
My framework tiene una estructura inicial inspirada en React.js esto significa que toda la composición será anclada a una raíz que se establece desde el inicio del proyecto, la sintaxis es la siguiente:
~~~Typescript
import { MyDOM } from "@my_framework/core/myDOM";
import { MyRouter } from "./lib/my_framework/router/myRouter";
import { AppModule } from "./app.module";

const root = MyDOM.createRoot(document.getElementById('root'));
root.render(AppModule)
~~~
La clase __MyDom__ nos porevee una serie de métodos de interés para la estructura general del árbol de componentes, pero realmente son muy pocos los que nos interesan, el primero es el método estático ``createRoot()``, este método establece cuál será la raíz de la app en el __DOM__, este será el pivote y la referencia para renderizar todo el árbol de componentes. Este retorna un objeto con una función _render()_ la cual recibe como parámetro el módulo que se espera sea renderizado en la raíz

<hr>

## __Componentes__
Los componentes son fragmentos o maquetas que nos permiten componer las vistas de forma modular, cada uno de ellos se responsabiliza de su diseño y lógica intrínseca, de esta forma podemos modularizar nuestro código haciendo más amena la experiencia de desarrollo, en my framework ts estos se basan en plantillas literales que siguen un par de reglas para poder transformarse en código html entendible para el navegador, poseen la siguiente sintaxis:
~~~Typescript
import { MyComponent } from "@my_framework/component";

@MyNode({selector: 'my-counter'})
export class CounterComponent extends MyComponent{
  count: number = 0;

  addCount = ()=>{
    this.refresh(()=>{
      this.state.count++;
    })
  }

  build(){
    return this.template((_)=>`
    <main>
      <h2>Mi Contador</h2>
      <p>${this.count}</p>
      <button ${_.on('click', this.addCount)}>add</button>
    </main>
    `);
  }
}
~~~
Inmediatamente se puede apreciar que se trata de un __componente de clase__, efectivamente my framework ts tiene como base componentes de clase, tal y como lo era mi anterior ejercicio: [__My framework__](https://github.com/LeonardoPatinoMolina/my-framework), pero este es posee ciertas novedades.
 
 El componente __CounterComponent__ está heredando de la clase __MyComponent__, de la acual obtiene todos los métodos propios de un componente reactivo, pero advertimos una diferencia respecto a my framework: adicionalmente la clase está siendo decorada con el decorador de fabrica __@MyNode()__ este recibe obligatoriamente un objeto como parámetro con el atributo __selector__.

En este caso tenemos un clásico contador, gracias a este ejemplo tan típico tengo espacio para exponer rápidamente la existencia del método refresh, este es el método utilizado por el componente para sus re-renderizados.

### __MyComponent__
La clase cuenta con __ocho 8__ atributos públicos y unos __4 cuatro 4__ getters que tendremos a nuestra disposición para diversas operaciones, estos son los siguientes:

### __Atributos__

- __$__: atributo encargado de efectos reactivos al ciclo de vida del componente, este atributo es una instancia de otra clase que detallaré más adelante.
- __body__: almacena la estructura ``HTML`` del template, esta no es una referencia al DOM, su finalizad es para detección de cambios entre re-renderizados, y realización de directivas estructurales, todas ellas operaciones internas, en general tiene una utilizad de solo lectura.
- __isInitialized__: atributo ``booleano`` que hace un seguimiento a la inicialización del componente, este estatus se establece en ``true`` cuando es _instanciado_, y vuelve a ``false`` cuando es _des renderizado_, el ciclo de vida de los componentes se detallará más adelante.
- __isFirstMount__: atributo ``booleano`` que hace un seguimiento a la primera renderización del componente, este estatus es ``true`` al renderizarse por primera vez y vuelve a ``false`` en los renderizados siguientes, sin embargo, regresa a ser ``true`` cuando se desrenderiza, más detalles en la explicación del ciclo de vida.
- __isRendered__: atributo ``booleano`` que hace un seguimiento al renderizado en vigor del componente, la diferencia con _isInitialized_, es que este asegura que el componente se encuentra renderizado en cambio aquel no, de nuevo, estará algo más claro cuando detalle el ciclo de vida de un componente.
- __key__: cadena de texto que identifica al componente y lo distinque de los demás.
- __parent__: este atributo hace referencia al componente que funge como padre del presente componente, si por el contrario no hace parte de la familia de ningun otro, el atributo permanece en ``undefined``
- __props__: atributo a través del cual el componente _padre_ puede comunicarse con el componente, este puede ser cualquier dato que quiera recibirse desde su invocación.
- __inputModel__: atributo opcional reservado para fines de control de formularios, más detalles en la sección de [formularios controlados](#formularios-controlados).
- __childAttaching__: Este método indexa todos los hijos potenciales del componente, estos son todos los nodos que han sido declarados en el módulo al que pertenece el presente componente. 
Este atributo tiene un propósito de uso interno, no hace falta manipularle, ya que está diseñado para operar en un contexto específico.

### __Métodos__
Ahora pasamos a los métodos, la clase __MyComponent__ sin contar el método constructor, posee __10__ métodos púbicos puestos a nuestra disposición para realizar diversas funciones, de estos 10, __cuatro 4__ están destinados a ser sobrescritos, __dos 2__ de los 10 son _obligatorios_ si queremos un mínimo para la adecuada funcionalidad del componente y como último detalle __dos 2__ de los 10 no están destinados a uso regular, son propiamente utilizados por la lógica interna del framework, sin embargo, conviene conocerlos. 

clasificados son los siguientes: 
#### __Constructor__
- __constructor(svc?: any)__: el método constructor recibe como parámetros un objeto opcional, este puede contener todos los servicios declarados en el módulo, en caso contrario estará vacio, la ide central es poder recibir por injección un servicio compartido entre nodos del mismo nodo en el cual sea provisto. al ser este un parámetro opcional, los componentes hijos no están obligados a pasarlo por la función __super()__ durante herencia, simplemente pueden asignarlo y usarlo a conveniencia, ejemplo:
  ~~~typescript
  class AppComponent extends MyComponent{
    service: SomeServie;

    constructor(svc?: any){
      super();
      this.service = svc.someService;
    }
  }
  ~~~

#### __Obligatorios__
- __(para sobreescritura) build()__: método destinado a ser sobre escrito. El propósito del método es construir la _plantilla_ del componente, esta tarea la ejecuta en conjunto con el siguiente método _template_ , la sintaxis final la pudimos ver con anterioridad:

  ~~~typescript
  build(){
    return this.template((_)=>`
      <main>
        Hello world!
      </main>
    `);
  }
  ~~~
- __template(builder: (_: DirectiveTemplateI)=>string)__: método encargado de administrar la plantilla literal donde reza la sintaxis del nodo del componente, recive como parámetro un ``builder`` el cual consiste en una función que recibe como parámetro un objeto que obedece a la interfaz ``DirectiveTemplateI`` la cual tiene el siguiente contrato:
  ~~~typescript
  export interface DirectiveTemplateI {
    on: (
      name: keyof HTMLElementEventMap, 
      callback: (e: any)=>void, 
      options?: ConfigEventI
    )=>string;
    inputController: (
      modelName: string, 
      name: string, 
      callback?: (string: string)=>string
    )=>string;
    myIf: (predicate: boolean)=>string;
    myMul: (amount: number)=> string;
    child: (key: string)=>(args?: ArgsAttachI)=>string;
    children: (key: string)=> (dataBuilder: DataBuilderT)=>string;
  }
  ~~~
  Básicamente es un recuento de todas los manejadores y directivas del template, estos serán detallados más adelante, más sin embargo, ya en el ejemplo del contador se pudo ver una muestra del atributo ``_.on()``.

#### __Opcionales__
- __(para sobreescritura) init()__: método destinado a ser sobre escrito, no tiene parámetros, esté metodo se ejecuta automáticamente al inicializar el componente y no vuelve a ejecutarse hasta que el componente sea desrenderizado y en un eventual futuro vuelto a inicializar, lo cual es distinito de un re renderizado, este comportamiento lo hace idóneo para tareas de una sola ejecución como subscripciones a globalStore o peticiones a un servidor remoto.
- __(para sobreescritura) ready()__:  método destinado a ser sobre escrito, no tiene parámetros, este método se ejecuta automáticamente cada vés que el componente se renderiza, incluyendo los re renderizados, es decir, su función es proveer un espacio para ejecutar lógica cuando el componente se encuentra en el _DOM_, esto es útil para la lógica interesada en manipular el DOM, aunque también puede usarse en cojunto al atributo __$__, para un manejo complejo de ``ciclo de vida``.
- __(para sobreescritura) destroy()__:  método destinado a ser sobre escrito, no tiene parámetros, este método se ejecuta automáticamente cada vés que el componente se des-renderiza, es decir, su función es proveer un espacio para ejecutar lógica cuando el componente es removido del árbol principal, esto es útil para la lógica interesada en desubscripciones y semejantes.
- __refresh(callback?)__: método encargado de actualizar la vista, en otras palabras, es el equivalente a un _setState()_, pero no funciona como ``React.js``, en su lugar funciona como ``Flutter``, ejecuta una serie de operaciones en busca de un cambio en la vista en caso de aberlo realiza el ``refrescado``. El método tiene como parámetros una función ``callback`` donde podremos ejecutar lógica previa a la actualización de la vista, este sistema es un simil del ``setState()`` de flutter, su propósito es simplemente una ayuda visual para ejecutar la lógica que modiffique la vista antes del refresh, por ello basta con invocar el método despues de realizar las modificaciónes sin necesidad de pasarle ese callback.

#### __De lógica interna__
- __render()__: método encargado de renderizar el componente, notificando la montura del mismo.
- __(asíncrono) clear()__: método encargado de "limpiar" el componente del árbol, esto implica removerlo de _MyDOM_, del árbol en sí y reestablecer todos los eventos y funciones asociadas al mismo. Es la forma que tiene my framework ts de liberar de la estructura principal un componente para dar espacio a los demás.

## __Ciclo de vida__
El ciclo de vida de un componente tiene __cuatro__  estadios o estados, estos atienden a su invocación, montura, reactividad y desmonte:

1. __inicialización__: es la etapa en la cual el componente es invocado ya sea como la raíz del árbol o en el template de su padre, en esta etapa conviene realizar las subscripciones e inicializaciones de propiedades de interés. LAs formas que podemos usar para asociar la ejecución de lógica a esta etapa son el método ``init()`` o el ``contructor`` mismo del componente. En el siguiente ejemplo vemos estas dos formas para hacer una consulta http:

    ~~~typescript
    //constructor
    @MyNode({selector: 'my-child'})
    class ChildComponent extends MyComponent{
      response: Response;

      constructor(){
        super()
        fetch('https://someurl')
          .then((res)=>{
            this.response = res
          })
      }
    }
    //init method
    @MyNode({selector: 'my-child'})
    class ChildComponent extends MyComponent{
      response: Response;
      
      init(): void{
        fetch('https://someurl')
          .then((res)=>{
            this.response = res
          })
      }
    }
    ~~~
2. __Renderización__: esta etapa equivale al momento en el que el componente se encuentra finalmente integrado en el ``DOM`` es decir, la montura del mismo, el método asociado a esta etapa es ``ready()``, en el siguiente ejemplo vemos como seleccionamos un elemento del DOM perteneciente al componente, si intetamos acceder a los nodos de nuestro componente antes de estar renderizado, la operación será fallida, por ello esta etapa del ciclo de vida es relevante:
    
    ~~~typescript
      
      ready(): void{
        const title = document.getElementById('title');
        console.log(title.innerText) //output: Mi contador
      }

      addCount = ()=>{
        this.refresh(()=>{
          this.count++;
        })
      }
      build(): void{

        return super.template((_)=>`
        <main>
          <h2 id="title">Mi Contador</h2>
          <p>${this.count}</p>
          <button ${_.on('click', addCount)}>add</button>
        </main>
      `);
    }
    ~~~
3. __Actualización (re-renderizado)__: etapa en la cual el componente se desmonta y se vuelve a montar con la finalidad de actualizar la vista, el método encargado de ejecutarse en cada actualización es el mismo ``ready()``, en cada actualización el componente vuelve a ejecutar este método, por este mótivo la lógica que éste envuelva debe contemplar esta característica. Para manejar de forma controlada esta etapa del ciclo de vida del componente my framework ts emplea un atributo que consiste en la instancia de una clase llamada __LifeComponent__ cuya principal función es hacer seguimiento a esta etapa, este atributo es: __$__, provee un método llamado __effect()__, el cual es un análogo a ``useEffect()`` de React.js, y funciona exactamente igual. un ejemplo rápido de como imprimir un "hola mundo" en cada actualización es diretamente hacerlo en el método ``ready()``:
    ~~~Javascript
      ready(){
        console.log("hola mundo");
      }
    ~~~
4. __Des renderización__: por último pero no menos importante la etapa final del ciclo de vida es el desmonte o des renderizado del componente, este corresponde con la remoción del DOM, en esta etapa todo los nodos asociados se desacoplan del documento principal, este comportamiento está presente también en la etapa de ``actualización``, pero aquel des renderizado no es definitivo, este en cambio establece el atributo _isInitialized_ en "false". Para asociar lógica a esta etapa disponemos de dos formas distintas, una es el método __destroy()__ el cual está espeíficamente destinado a esta tarea, pero también podemos usar una convinación del métod _ready()_ y nuestro atributo _$_ y su método _effect_ (__$.effect()__), como previa veamos un ejemplo rápido de como imprimir un "adios mundo" al des renderizar el componente usando ambas formas:

    ~~~typescript
    //destroy method
    @MyNode({selector: 'my-child'})
    class ChildComponent extends MyComponent{
      destroy(): void{
        console.log('adios mundo')
      }
      build(): void{
        return `<div>Child component</div>`
      }
    }
    //$ attribute
    @MyNode({selector: 'my-child'})
    class ChildComponent extends MyComponent{
      ready(): void{
        this.$.effect(()=>{
          return ()=>{
            console.log('adios mundo')
          }
        },[])
      }

      build(): void{
        return `<div>Child component<div>`
      }
    }
    ~~~
    En este ejemplo es evidente lo simple que es el uso del método ``destroy()`` en comparación con el método ``effect()``, pero ello se debe a que al atributo __$__ le conciernen muchas otras operaciones, y es acá cuando advierto de las grandes similitudes con ``useEffect()`` de React.js, este pequeño ejemplo imprimirá en consola "adios mundo" en cada des renderizado.


### __LifeComponent__
La clase LifeComponent tiene como finalidad asociar lógica reactiva al ciclo de vida de componentes, de allí que esté diseñada para componer la estructura básica de un componente particular.

### __Métodos__
Esta posee cuatro métodos públicos de los cuales solo usaremos uno de ellos, ya que los otras hacen parte de la lógica interna, pero de nuevo, conviene conocerlos. 

clasificados son los siguientes:
#### __De uso regular__
- __effect(callback, dependency)__: este método es un análogo al hook de ``React.js`` __useEffect__, funciona casi exactamente igual, este está destinado a ejecutarse al menos ``una vez``, ello cuando el componente ha sido _renderizado_ o _actualizado_ y volver a hacerlo en base a un arreglo de dependencias, además brinda la posibilidad de asociar lógica al des renderizado. Su primer parámetro es un ``callback``, este contiene la lógica que se ejecutará al menos una vez y en cada ocasión que las dependencias permitan su llamada, el segundo parámetro es el arreglo de dependencias, estos son datos que serán analizados antes de ejecutar el callback, si resulta que han mutado, el callback será ejecutado. 
veamos en el siguiente ejemplo donde lo implementamos para que imprima en consola un "hola mundo" cada vez que la propiedad "saludo" cambie:

    ~~~typescript
    //my framework ts
    ready(): void{
      this.$.effect(()=>{
        console.log("hola mundo");
      },[this.saludo]);
    }
    ~~~
  para notar el gran parecido con ``React.js`` veamos esto mismo, pero con sintaxis de react.js:

    ~~~Javascript
    //react.js
    useEffect(()=>{
      console.log("hola mundo");
    },[saludo]);
    ~~~

    Aquí otro ejemplo para imprimir un "Hola mundo" al renderizar el componente y un adios mundo al des renderizar una sola vez:

    ~~~Javascript
    //my framework ts
    ready(): void{

      this.$.effect(()=>{
        console.log("hola mundo");

        return ()=>{
          console.log("adios mundo");
        }
      },[]);

    }
    ~~~

    Ahora esto mismo en ``React.js``:

    ~~~typescript
    //react
    useEffect(()=>{
      console.log("hola mundo");

      return ()=>{
        console.log("adios mundo");
      }
    },[]);
    ~~~

    >``Importante:`` tanto el callback principal como el retornado solo se ejecutarán una vez, esto se debe a que ambos validan el arreglo de dependencias, si desea darle un caracter reactivo distinto a la lógica de des renderizado (el callback retornado) debe optar por otro __effect()__ con las dependencias que le convengan.
    
    La diferencia que guarda el método __this.$.effect()__ de my framework con __useEffect()__ de React.js es que no pueden repetirse si cuentan con las mismas dependencias, si se intenta crear otro effect() con las mismas dependecias de otro que se encuentra vigente, obtendrá una ``excepción de redundancia``, aunque el callback sea distinto, las dependencias no pueden ser las mismas en distintos effect(). Otra diferencia algo más práctica es que este método retorna la misma instancia __LifeComponent__, esta característica fue pensada para concatenar effects, ejemplo:
    
    ~~~typescript
    ready(): void{

      this.$.effect(()=>{
        console.log("hola mundo");
      },[this.saludo])
      .effect(()=>{
        console.log("hola mundo 2")
      },[])

    }
    ~~~

    Lo que sucederá en este ejemplo es que la consola imprimirá:
    ~~~ Bash
    -% hola mundo
    -% hola mundo 2
    ~~~

    y a partir de allí seguirá imprimiendo "hola mundo" cuando cambie el estado saludo, mientras que "hola mundo 2" no volverá a ejecutarse hasta un nuevo renderizado.
#### __De lógica interna__
LifeComponent cataloga en dos categorías las funciones asociadas a efectos, aquellas que se ejecutan al renderizar el componente son efectos __update__, y aquellas que están destinadas a ejecutarse cuando el componente se desrenderice son efectos __dispose__, existen métodos encargados de propagarlos y son públicos, sin embargo, están asociados a la lógica interna de my framework ts no para uso regular:

- __update()__: método encargado de ejecutar todos los callbacks de efectos de renderizado, esto siempre y cuando se encuentren en condiciones de ser invocados, es decir, que sus dependencias lo permitan ya sea porque han mutado o porque están indefinidas.
- __dispose()__: método encargado de ejecutar todos los callbacks de efectos de des renderizado, esto siempre y cuando se encuentren en condiciones de ser invocados, es decir, que sus dependencias lo permitan ya sea porque han mutado o porque están indefinidas.
- __initialize()__: este método se asegura que cada callback asociada a un efecto update se ejecute mínimo una véz. esto es necesario para poder almacenar el efecto de dispose en caso de existir. pero esta es una característica del framework y no requiere manipularse.

<hr>

## __Eventos en línea__
esta característica no ha cambiado mucho respecto a la anterior inmplementación en __[My framework](https://github.com/LeonardoPatinoMolina/my-framework)__, donde más hubo cambios fue en los controladores de formularios. En esencia esta característica consiste en un sistema de manejo o control de eventos asociados a los nodos del componente que lo demanden, ello basándonos en un par de reglas a la hora de declararlos en en el template.

### __on(name: keyof HTMLElementEventMap, callback: (e: any)=>void, config:  ConfigEventI)__
Esta es  una característica que hace posible asignar un evento en la plantilla del componente asignando un manejador, podemos asumir que se trata de un ``addEventListener()`` especializado para funcionar en las plantillas de my framework ts, este cuenta con __tres__ parámetros:

- __name__: refiere al nombre del evento, los eventos que pueden ser asignados, son exactamente los mismos que añadirías en un _addEventListener()_ de toda la vida.
- __callback__: refiere al manejador del evento, es quella unción que será ejecutada en cada ocación que el evento se dispare, recibiendo como parámetro el evento.
- __config__: este es un objeto de configuración análogo al objeto de configuración de un addEventListener y de igual forma es opcional, posee todos los atributos del mismo a excepción del atributo ``signal`` el cual se recerba para funciones internas del framework, repasando las opciones a configurar tenemos:

  ~~~Typescript
  interface ConfigEventI {
    capture?: boolean, 
    passive?: boolean, 
    once?: boolean
  }
  ~~~
>``Nota:`` No me detendré a explicar qué hace cada uno, porque esto no es algo de my framework ts, es una funcionalidad propia del método __addEventListener()__ de la clase EventTarget en __Javascript__ 

Podemos ver en acción esta característica de my framework ts en el siguiente método _build()_ del componente Counter del ejemplo anterior:
~~~typescript
      count: number: 0;
      addCount = ()=>{
        this.refresh(()=>{
          this.count++;
        })
      }
      build(): void{

        return this.template((_)=>`
        <main>
          <h2 id="title">Mi Contador</h2>
          <p>${this.count}</p>
          <button ${_.on('click', this.addCount)}>add</button>
        </main>
      `);
    }
~~~
En la etiqueta ``button`` podemos ver el eventController, este proviente desde el parámetro del método __template()__, en este caso particular está identificado con un guión bajo "**_**", este ejemplo añade un evento click al botón de modo que en cada click se ejecutará el manejador __addCount()__ incremementando el valor de la propiedad __count__.
Si aislamos su sintaxis tenemos lo siguiente:
~~~typescript
_.on('click', addCount)
~~~
como dije anteriormente podemos interpretarlo como un addEventListener:
~~~typescript
element.addEventListener('click', addCount)
~~~
Con la particularidad ser un manejador añadido a la etiqueta puntual en la que se declara, por ello es una especie de  ``asignación de evento en línea``, y pueden añadirse tantos como se necesite en un solo componente. Estos son administrados internamente, no hace falta preocuparse por removerlos, eso es tarea de my framework ts, internamente se determina cual es el momento oportuno para ello.

<hr>

## __Formularios controlados__
Este fue uno de los retos principales de my framework y en este caso my framework ts buscó mejorar la solución al mismo, repasemos __¿cuál es el problema a resolver?__.


### __El problema__
``My framework ts`` es una herramienta para desarrollar aplicaciones front-end de página única con componentes _reactivos_ cuya principal característica es que constantemente se re renderizan con la finalidad de actualizar la vista. 

Imagine un usuario ingresando su información en un formulario de registro, el valor ingresado es un dato que pertenece al campo de texto que se encuentra renderizado en ese momento, pero antes de culminar su diligencia, el usuario decide hacer una pequeña acción en la vista que implica ``re-renderizar`` el árbol de componentes del cual participan los campos del formulario. Aquel dato previamente ingresado en el campo del formulario __no es persitente por definición__, solo el estado local del componente y el globalStore son los datos capaces de persisitir entre re-rederizados, __¿debemos hacer que el valor del campo sea un estado?__, pero por supuesto, __¿se solucionó el problema?__, lastimosamente no, o no exactamente.

Esta situación acarrea una serie de problemas con arreglo a la experiencia del usuario en los campos de un formulario lo suficientemente elaborados (pérdida del foco, perdida de la ubicación del cursor y pérdida de datos ingresados) como para requerir una solución especializada. Si quería garantizar la correcta funcionalidad de los __formularios__ en my framework ts debía lidiar con estos asuntos.


### __La solución__

>``Nota:`` Me reservo los detalles internos de su implementación, tiene a su disposición el código empleado para ello.

La forma solución empleada en ``my framework`` implicó resguardar los datos ingresados y el estado de foco del campo involucrado. Sin embargo, la forma en la que esto se efectuaba estaba pensado para re-renderizar el componente en cada manipulación que se realizara sobre los campos de los formularios. Como imaginará esto era muy costoso a nivel de recursos, pero funcional a fin de cuentas, esto era así debido al sisitema de reactividad empleado entonces, __my framework ts__ implementa un sistema de reactividad distinto, por ello se pudo permitir un manejo distinto de esta problemática.

La sintaxis solo tuvo pequeños cambios respecto a my framework, pero la implementación interna es mucho más eficiente y sofísticada. Antes de recurrir a un ejemplo de my framework veamos cómo es un ``formulario controlado`` en una biblioteca de componentes reactivos como __React.js__:

~~~javascript
"use strict"
import React from 'react';

export const Form ()=>{
  
  const [formData, setFormData] = React.useState({
    nombre: 'Roberto',
    apellido: 'Rodriguez',
  });

  const changeHandler = ({target}) =>{
    const {name, value} = target;
    //manipulamos el valor a nuestro antojo
    //para ser asignado al campo con un control previo
    
    setFormData(prevData => ({
      ...prevData, 
      [name]: value
    }));
  }

  return (
    <form onSubmit={(e)=>{e.preventDefault()}}>
      <label>
        nombre:
        <input 
          type="text" 
          onChange={changeHandler} 
          name="nombre"
          value={formData.nombre}
        >
      </label>
      <label>
        apellido:
        <input 
          type="text" 
          onChange={changeHandler} 
          name="apellido"
          value={formData.apellido}
        >
      </label>
      <button type="submit">Enviar</button>
    </form>
  );
}
~~~
Aquí tenemos un rápido ejemplo de un componente funcional de __React.js__ de nombre __Form__ que consiste en un formulario con dos campos de texto que se encuetran controlados por un estado __formData__ con el valor inicial de "Roberto" y "Rodriguez" respectivamente, se observa el evento ``onChange`` y se maneja actualizándolo y mostrando siempre el valor ingresado en el atributo value de la etiqueta __input__, esto permite que podamos manipular el valor del campo a nuestro antojo. Esta es la forma en la que __React.js__ soluciona el problema que he mencionado respecto a la persistencia de los datos ingresados en el formulario, los demás detalles los soluciona de forma interna.

Ahora veamos este mismo ejemplo, pero en un componente de my framework ts:

~~~typescript
import { MyComponent } from "@my_framework/core/myComponent";
import { MyNode } from "@my_framework/decorators/myNode";

@MyNode({selector: 'my-form'})
export class FormComponent extends MyComponent{

  inputModel: InputModelI = {
    formData: {
      nombre: 'Roberto',
      apellido: 'Rodriguez'
    }
  }

  controlValue = (value: string): string=>{
    //manipulamos el valor a nuestro antojo
    //para ser asignado al campo con un control previo
    return value;
  }

  build(): void{
    return this.template((_)=>`
    <form ${_.on('submit',(e)=>{e.preventDefault()})}>
      <label>
        nombre:
        <input 
          type="text" 
          ${_.inputController("formData","nombre",this.controlValue)} 
          name="nombre"
        >
      </label>
      <label>
        apellido:
        <input 
          type="text" 
          ${_.inputController("formData","apellido",this.controlValue)} 
          name="apellido"
        >
      </label>
      <button type="submit">Enviar</button>
    </form>
    `);
  }
}
~~~
En este ejemplo vemos la misma situación que con el componente Form de _React.js_, pero con todas las reglas ``de my framework ts`` y sus métodos.

En este caso particular declaramos un modelo con el atributo __inputModel__ este el modelo del controlador y sus valores equivalen a las cedena de texto que recibirán como primer valor los inputs y a su vez estos equivalen a los parámetros establecidos en el _inputController_.

 La sintaxis es semejante a un __eventController()__, pero no podemos afirmar que se trata de un __addEventListener__, este es un controlador específico para etiquetas de entrada de teclado, lo cual incluye:
~~~html
<input type="text">
<input type="number">
<input type="email">
<input type="date">
<input type="time">
<input type="tel">
<input type="password">
<textarea></textarea>
~~~

> ``Importante:`` evidentemente no están contempladas todas las etiquetas __input__, debido a que solo las previamente señaladas originaron la necesidad de esta solución tan específica; para controlar el resto de etiquetas _input_ como checkbox o radio, etc. puede optar por el __eventController()__ y manejar su valor con el evento que corresponda, en esos casos el _inputController_ no funcionará adecuadamente y sufrirá comportamientos inesperados.

### __inputController(name, fieldName, callback)__
el __inputController__ es una directiva cuyo propósito es manejar los campos del formulario en los que se declare, esta funciona en conjunto con un atributo __inputModel__, en el cual se almacenarán los valores, para ello, antes de usar el inputController hay que declarar el atributo con la siguiente sintaxis:
~~~typescript
/**
 * declaramos el modelo a través del atrubuoto inpuModel
 * este está tipado con la interfaz InputModelI que se asegura
 * de mantener los tipos de cada valor como una cadena de texto.
 * Esta es la única forma válida para declarar el modelo.
 * Los atributos "name" y "name2" hacen referencia a cada uno a un formulario en el componente, es decir, a cada formulario le corresponde un modelo, y a través de él se podrá acceder en todo momento al valor actual de los campos que contengnan la directiva inputController
 */
inputModel: InputModelI = {
  name: {
    fieldName: 'text1'
  },
  name2: {
    fieldName: 'text2'
  },
}
/**
 * el primer parámetro de la directiva inputController correponde al nombre del modelo, y el segundo al nombre del campo en particular, estos son arbitrarios y pueden tener el nombre que consideremos pertinente y descriptivo para cada caso de uso
 */
build: void{
  return this.template(()=>`
    <main>
      <form>
        <input type="text" ${_.inputController('name','fieldName')}> 
      </form>
      <form>
        <input type="number" ${_.inputController('name2','fieldName')}> 
      </form>
    </main>
  `);
}
~~~

#### __Parametros__
``name:`` nombre del modelo del formulario que está siendo controlado.
``nameState:`` refiere al campo de texto en el modelo al cual será asociado el valor del input en el que se declara el __inputController__.

``callback(value):`` este parámero es opcional, recibe como parámetro el valor actual del input y obligatoriamente debe retornar una cadena de texto que corresponde al nuevo valor luego de realizarle los cambios de nuestro interés. Es a travéz de este callback que podemos controlar el valor ingresado en la etiqueta con la garantía de la peristencia de la información entre re-renderizados.

#### __Últimas apreciaciones__
Es importante recalcar que esta implementación no consiste en formularios reactivos, sino formularios controlados con persistencia de datos.

<hr>


















<!-- actalización en proseso -->
<!--
## __MyDOM__
A esta entidad me refiero cuando hablo de árbol de componentes, consiste en una instancia única que sigue el patrón __Singleton__ pues solo debe existir uno en todo la app. Este no es un __virtual dom__, pero cumple un rol semejante, es gracias a esta entidad que existe un pivote, un soporte sobre el cual ensamblar la estrcutura general de todos los componentes que se encuentren en funciones. Aspectos como sus familias, su petenencia al árbol y la raíz principal.

### __Atributos__
MyDOM cuenta con __cuatro__ atributos públicos, los cuales no tienen una trascendencia mayor a la lógica interna del framework, pero de igual forma conviene conocerles:

- __family__: este atributo es un objeto __Map__ que almacena estructuras __Set__ las cuales encapsulan referencias a los componentes hijos de cada componente en funciones, es decir, que están siendo renderizados. Cada set es indexado por una cadena de texto correspondiente a la key única del componente padre.
- __nodes__: este atributo es un objeto __Map__ que almacena las refernencias a todos los componentes que se encuentren en funciones, indexados por su propia key.
- __root__: este atributo almacena una referencia a la raíz de la aplicación, la cual es el elemento del DOM en el cual se renderiza el árbol, un ejemplo podía ser:

    ~~~Html
    <div id="root"></div>
    ~~~

### __Métodos__
los métodos de la entidad MyDOM son todos estáticos, cuenta con __doce__ métodos de los cuales están destinados para usarse en la lógica interna del framework, sin embargo, algunos pueden ser de utilidad para el uso regular, por ello conviene conocerlos:

- __clearDOM()__: método encargado de vaciar y eliminar todos los datos del árbol, este método tiene el propósito de ser empleado en el enrutador, tema que será tratado más adelante.
- __createRoot(root)__: método encargado de asignar el elemento del dom que será la raíz del árbol de componentes, ya en el ejemplo de la entrada de la app se pudo observar su uso, este recibe como parámetro el elemento destinado a este fin.
- __getMember(key)__: función encargada de retornar el componente del árbol que corresponda a la ``key`` que se recibe como parámetro.
- __getFamily(parent)__: método que retorna la estructura ``Set`` que almacena todos los componentes hijos del componente padre que será recibido como parámetro.
- __initFamily(parent)__: método encargado de inicializar un espacio del atributo ``family`` del árbol para un componente en caso de poseer componentes hijos. recibe como parámetro el componente padre.
- __memberCompare(member)__: este método recibe como parámetro la instancia de un componente y realiza una validación en la que verifica si el presente componente es miembro del árbol, retorna ``true`` si esto es así, y ``false`` si no lo es.
- __removeChild(parent, child)__: método encargado de remover un componente hijo de la familia de un componente padre, para ello recibe como parametro el componente _child_ el cual será removido y el componente __parent__ que es el padre.
- __removeFamily(parent)__: método encargado de remover una familia entera del árbol, este método está orientado a remover familias de componentes que ya no pertenecen al árbol.
- __setChild(parent, child)__: método encargado de añadir un nuevo hijo a la familia de un componente padre, para ello recibe como parámetro el componente _child_ el cual será añadido y el componente __parent__ que es el padre de la familia.
- __setGlobalStore(store)__: método encargado de asignar el store global al árbol de componentes, recibe como parámetro el objeto retornado por el método configStore de la clase ``MyGlobalStore`` que será tratada más adelante. 
- __setMember(newMember)__: este método añade un nuevo miembro a los nodos del árbol, recibe como parámetro una instancia del  componente que será añadido.
- __removeMember(targetMember)__: método encargado de remover un componente que ya es miembro de los nodos del árbol, este se reibe como parámetro. Este método es empleado por el framework para remover componentes que son des renderizados.

<hr>

## __MyGlobalStore__
La administración del estado global en my framework es llevada a cabo por la clase MyGlobalStore, esta se vale de otra clase llamada __MyShelf__ y una función auxiliar llamada __createShelf__. AL igual que la clase MyDOM es una entidad de única instancia, y engloba la estructura y lógica necesaría para proveer una serie de datos en forma de store global, este sistema sigue el ``patrón reductor`` para la asignación de funciones de mutabilidad de datos del store, y el ``patrón mediador`` para subscribir componentes reactivos al mismo, pues, efectivamente se trata del estado global de la app.

### __Atributos__
 La clase MyGlobalStore cuenta con __dos__ atributos que normalmente no tendremos que manipular:

 - __store__: este atributo es un objeto __Map__ que almacena todas las store las cuales consisten en instancias de la clase ``MyShelf``, estánson indexadas por su ``reducerpath``, el cual es una cadena de texto que se declara en la clase MyShelf, cual será detallada más adelante.
 - __observers__: este atributo es un objeto __Map__ que almacena todos los componentes que se encuentran subscritos a un store concreto.

 ### __Métodos__
 Todos los métodos de la clase MyGlobalStore son estáticos, cuenta con __tres__ métodos destinados a declarar, subscribir y despachar:

 - __configStore(config)__: método encargado de configurar la store principal, este recibe como parámetro un objeto de configuración donde se asignan los reductores de cada Shelf para ser proveidos por la clase. En el ejemplo siguiente, vemos como se utiliza el método para configurar una store que distribuye un shelf de nombre ``userShelf``, con este fin recibe el objeto de configuración el cual posee un atributo ``reducers`` en el cual se asigna, a la propiedad con el nombre correspondiente de userShelf, la instancia de este Shelf, la creación de este último será tratada más adelante.

    ~~~Javascript
    "use strict"
    import { MyGlobalStore } from "../lib/my_framework/GlobalStore.js";
    import { userShef } from "./feature/user.js";

    export const store = MyGlobalStore.configStore({
      reducers: {
        [userShef.name]: userShef.shelf
      }
    });
    ~~~

    El paso inmediato a este debe ser establecer el store en el árbol de componentes, para ello recordamos un método mencionado anteriormente: ``setGlobalStorage``, este recibe como parámetro el store, de esta forma la entrada de la app se habrá actualizado de la forma siguiente:
    ~~~Javascript
    "use strict"
    import { MyDOM } from "./lib/my_framework/myDOM.js";
    import { store } from "./context/store.js";
    import { App } from './app.js'

    const root = MyDOM.createRoot(document.getElementById("root"));
    root.render(new App());

    MyDOM.setGlobalStore(store);
    ~~~

 - __subscribe(shelfName, observer)__: método encargado de subscribir un nuevo componente a un shelf concreto del store, para ello recibe como parámetro el nombre del shelf y la instancia del componente (observer), hemos podido ver un ejemplo con anterioridad, en el cual sibscribimos un componente a través del método ``init()``:

     ~~~Javascript
      init(){
        MyGLobalStore.subscribe('products',this);
      }
    ~~~

    con esta sintaxisi es suficiente para que el componente en cuentión reaccione a las modificaciónes del store a través del ``dispatch()``.

 - __dispatch(shelfName)__: método encargado de propagar el evento de actualización de estado a todos los componentes _observers_ que esten subscritos un ``shelf`` concreto en el store, para ello recibe como parámetro el nombre del shelf en cuestión. A diferencia de los anteriores métodos, este no está destinado a usarse durante el desarrollo, en cambio hace parte de la lógica interna del administfrador de estao global del framework, por eso no tendremos que manipularle.

### __MyShelf__
clase encargada de organizar todo lo relacionado a un estado concreto del store, este es muy parecido a los slide de __Redux Toolkit__, a estas alturas queda claro que el presente proyecto (my framework) es mi cosecha de distintas tecnologías que he podido aprender durante mi tiempo de formación como analista y desarrollador de sistemas de información, y redux es una de ellas
. para configutar un shelf contamos con una fución auxiliar, opté por este diseño porque no quería que este se convirtiera en una preocupación demaciado grande para la experiencia de desarrollo, relmente nunca estamos en contacto directo con la clase MyShelf, solo con su instancia, pero conviene conocerle:

#### __Accessors / Getters__
La clase MyShelf cuenta con __tres__ _accesors_ o _getters_ los cuales tenemos a disposición:

- __name__: consiste en el nombre del shelf, este que lo identifica y lo distinque de los demás, se espera que sea único.
- __actions__: consiste en un objeto que almacena las funciones dispatch encargadas de mutar el estado que almacena el shelf, es decir, los datos del store, estos está destinados a ser usados regularmente.
- __data__: consiste en los datos almacenados en el shelf, pueden ser cualquier cosa, un objeto o un dato primitivo, al final será indexado por el nombre del shelf.

#### __createShelf(config)__
Esta es la función auxiliar a través de la cual podremos crear un shelf, esta retorna un objeto una instancia de la clase MyShelf, el nombre y las actions. La mejor forma de detallarla es viéndola en acción.

Continuando con el ejemplo anterior de la configuración del __store__ con el método de la clase MyGLobalStore, ``configStore()``, donde se empleó un shelf de nombre __userShelf__, en este veremos como se creó:

~~~Javascript
"use strict"
import { createShelf } from "../../lib/my_framework/GlobalStore.js";

export const userShelf = createShelf({
  name: 'user',
  initialData: ['user 1', 'user 2'],
  reducers: {
    setUser: (data, payload)=>{
      data.push(payload);
    },
  }
});

export const { setUserDispatch } = userShelf.reducers;
~~~

En este ejemplo podemos apreciar le creación de un shelf partiendo de la función __createShelft__, esta recibe como parámetro un objeto de configuración, este objeto se corresponde con los accesors que tratamos previamente, el atributo ``name`` refiere al atributo name del _shelf_, el atributo ``initialData`` se coresponde con el valor que inicializa el atributo data del shelf, este es opcional, por último el atributo ``reducers`` consiste en un objeto que contiene cada _función reductora_, en este caso particular tenemos la función reductora: __setUser__, todas ellas reciben como parámetro la ``data`` del shelf y un valor ``payload``, es menester detenernos aquí y detallar un poco más este asunto:s

- __data__: se corresponde con los datos almacenados en el shelf, este parámetro se prevee para poder modificarlo a nuestra conveniencia, es esencialmente una referencia de los datos almacenados, por ello debe tratarse de forma adecuada si no queremos sorpresas.
- __payload__: este parámetro corresponde a el nuevo valor proveniente de la función dispatch, se espera que sea el recurso necesario para la modifcación deseadad del shelf.
- __setUserDispatch()__:  podemos verla hasta el final del ejemplo, esta proviene del accesor __reducers__, y su nombre es el mismo que la función reductora con la palabra ``Dispatch`` al final, cosa que la distingue de la función reductora. la nomenclatura se da dinámicamente, el nombre "setUser" es arbitrario facilmente pude elegir otro nombre y este le sería añadido la palabra Dispatch al final:
~~~Javascript
  removeUser => removeUserDispatch
~~~

Una vez aclarado estos puntos quiero recordar lo dicho previamente, este diseño está inspirado en __Redux Toolkit__, quiero mostrar un ejemplo en esta tecnología con el mismo store:

~~~Javascript
"use strict"
import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: ['user 1','user 2'],
  reducers: {
    setUser: (state, action)=>{
      state.user.push(action.payload);
    },
  }
});

export const { setUser } = userSlice.actions;
~~~

Es muy parecida la sintaxis, y de nuevo, elegí este diseño porque quise mantenerlo familiar. Aunque su forma de operar es muy distinta.

<hr>

## __MyRouter__
Una vez que hemos conocido la forma de renderizar el componente raíz, a través del método render provisto por el método ``createRoot()`` de la clase __MyDOM__ tenemos como alternativa usar el ``enrutador`` de my framework, este es una entidad única que tiene la capacidad de definir páginas con sus respectivas rutas y estados propios en el historial del navegador.

### __Atributos__:
La clase MyRouter cuenta con __dos__ atributos públicos que realmente no están destinados a ser usados regularmente, sin embargo conviene conconerlos:

- __currentPage__: refiere al componente raíz que se encuentra renderizado, a fin de cuentas es quien cumple el rol de página en la app.
- __pages__: son todos los componentes raices que están dispuestos a participar del enrutamiento.

## __Métodos__
La clase MyRouter además del constructor cuenta con __cuatro__ métodos públicos, todos estáticos y destinados a uso regular.

### __Constructor__
El método constructor debe recibir un objeto de configuración en el cual se definan las _painas_, las _rutas_, _params_ y la pestaña _notFound_. Efectivamente este debe inicializarse en la entrada de la app, de esta forma teneos una nueva actualización al fichero main.js:
~~~Javascript
//main.js 
"use strict"
import { MyDOM } from "./lib/my_framework/myDOM.js";
import { MyRouter } from "./lib/my_framework/router.js";
import { store } from "./context/store.js";
import { PAGES } from "./pages/routes.js";
import { NotFound } from "./components/notFound.js";

const root = MyDOM.createRoot(document.getElementById("root"));

MyDOM.setGlobalStore(store);

//declaración de router - start
const router = new MyRouter({
  pages: PAGES, 
  notFound: NotFound
});
  //declaración de router - end


///pages/routes.js
import { Counter } from "./counter.js";
import { NotFound } from "./notFound";
import { Result } from "./result";

export const PAGES = new Map([
  [ "/", Counter],
  ["/otra", NotFound],
  ["/resultado/:result", Result],
]);
~~~

en este ejemplo vemos la declaración del enrutador, este consiste en inyectar un objeto de configuración cons dos atributos:
- __pages__: consiste en un objeto __Map__ el cual contiene las rutas como ``key`` y la clase correspondiente a la page como ``value``, algo de suma importancia es que la tercera ruta contiene un _param_, este se declara ubicando dos puntos (:) y su respectivo nombre, en este caso particular tenemos el ``param result``, es a través de este que podremos enviar datos desde una página a otra.
- __notFound__: este atributo es simplemente un componente o mejor dicho la clase de un componente que tiene la tarea de mostrar una vista que indique el clásico error __not found 404__:

>``Importante:`` Esta inicialización es de suma importancia porque es desde aquí que empezarán los renderizados de nuestras páginas, como se puede apreciar el método render() no aparece por ninguna parte, y eso se debe a que la entidad MyRouter se encarga de ello internamente, de allí que sea importante una correcta declaración de las rutas y componentes raices.

### __De uso regular__
Estos son métodos que tienen tareas específicas, pero fundamentales en el enrutamiento:

- __go(path)__: método encargado de navegar a la ruta que se le administre mediante el parámetro ``path``. Debe asegurarse que la ruta exista caso contrario deberá asociar una pestaña __notFound__.
- __next()__: método específico para navegar hacia adelante en el historial siempre que haya un registro ``forward``, es decir, que se haya navegado a otra página con anterioridad.
- __back()__: método específico para navegar hacia atrás en el historial siempre que haya un registro ``back``, es decir, que se haya navegado a una nueva ventana dejando atrás una ruta previa.
- __params()__: método especial que obtiene los valores params que hayan sido enviados desde la página anterior, lastimosamente el presente enrutamiento es bastante básico y no admite rutas dinámicas en la _url_, por ello hay una regla base que se debe obedecer para enviar params de una page a otra.

### __Params__
La comunicación entre una página y otra en my framework se realiza de forma discreta mediante ``params``, estos son datos que se adjuntan en la declaración de las rutas y el uso del método __go(path)__. Para abordar mejor este concepto entremos en materia de declaración de rutas.

#### __Declaración de rutas__
 previamente mencionamos la sintaxis de declaración. En caso de desear un ruta sin params podemos escribirla directamente, importante que las barras inclinadas estén al principio del nombre de la ruta y del param, caso contrario obtendremos comportamientos inesperados:
~~~Javascript
 "/about" 
 "/about/ticked" 
~~~

En otro caso donde precisemos comunicar un dato de una página a otra como puede ser el típico paso de un ``id`` de _producto_ o de _cliente_, declaramos el nombre del param antecedido por una barra inclinada y dos puntos "__/:__"
~~~Javascript
 "/product/:id"
 "/client/:id"
~~~
Realizada esta declaración ahora si podemos navegar entre rutas y de ser necesario, enviar y manipular datos a través de params.

#### __Navegación a ruta__
Para navegar hasta una ruta específica utilizamos el método __go(path)__, este recibe un string correspondiente a la ruta deseada:
~~~Javascript
MyRouter.go('/about');
MyRouter.go('/about/ticked');
~~~
importante que la barra inclinada "/" esté presente siempre, caso contrario obtendremos comportamientos inesperados.

#### __Navegación a ruta con params__
En caso de que necesitemos comunicar un dato mediante un param utilizamos la siguiente sintaxis:

~~~Javascript
const clientId = 10002392;

MyRouter.go('/product/{1001}');
MyRouter.go(`/client/{${clientId}}`);
~~~
el valor del param debe estar rodeado por llaves ``"{}"`` esta es una de las reglas que advertí con anterioridad, es una sintaxis necesaria para el adecuado funcionamiento del framework. Estos params pueden ser más de uno sin mayor problema, por ejemplo:
~~~Javascript
//routes
const PAGES = Map([["/product/:code/:price": Product]])

// navigation
const productCode = 72304923;
const productPrice = 2000;

MyRouter.go(`/product/{${productCode}}/{${productPrice}}`);
~~~
Aquí otra regla, al ser varios params igual deben estar precedidos por una barra "__/__". 
> ``A tener en cuenta:`` los params no se ven reflejados en el url, estos son transmitidos de forma discreta, por ello no tienen la capacidad de intercalarse con nombres de ruta como por ejemplo: "/product/:id/popular"

#### __Obtención de datos params del lado de la página__
Para la obtención de los params en el cuerpo de la página, el cual no es más que la clase del componente raíz, damos uso del método __params()__, siguiendo con el ejemplo anterior donde navegamos a una página con nombre de ruta ``"product/:code/:price"``, la forma de obtener los datos es la siguiente:

~~~Javascript
import { MyComponent } from "../lib/my_framework/component.js";
import { MyRouter } from "../lib/my_framework/router";

export class Product extends MyComponent{
  constructor(){
    super('product-page'); //key
  }

  init(){
    const { code, price } = MyRouter.params(); 
    this.state = {
      code,
      price
    };
  }

  build(){
    return super.template((_)=>`
    <main>
      <h2>Producto</h2>
      <p>Producto con el código: ${this.state.code}</p>
      <p>Precio del producto: ${this.state.price}</p>
      <button ${_.on('click', ()=>{MyRouter.back()})}>Volver</button>
    </main>
    `);
  }
}
~~~

Fácilmente contamos con un componente que invoca al método __MyRouter.params()__ desde su método ``init()``, posteriormente lo almacena en su estado local y lo imprime en su plantilla. Así de sensillo, los nombres que declaramos en las rutas serán los que tendrán los atributos del objeto que será retornado por el método params().

<hr>

Documentación en proceso...