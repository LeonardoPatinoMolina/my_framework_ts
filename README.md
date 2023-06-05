# __My Framework TS__

<p align="center">
  <img src="https://i.postimg.cc/RhrgmkP4/logo-myframework-ts-big.png" width="40%" height="auto" alt="my framework logo" title="my framework logo">
</p>

El presente ejercicio es una versión potenciada de uno anterior llamado __[My framework](https://github.com/LeonardoPatinoMolina/my-framework)__, en el cual me propuse crear un framework front-end de _javascript_ desde los cimientos teniendo como única dependencia de terceros __vite__; en esta ocasión fui un paso más adelante y apunté a mejorar muchas carácterísticas que resultaron bastante problemáticas en my framework, ello luego de experimentar con casos de prueva más elavorados.

## __Contenido__
El contenido que documenta el presente proyecto no comprende cada aspecto de la implementación y estructura en profundidad de las más de __2000__ líneas de código que fueron necesarias para su realización, se limita a documentar los aspectos fundamentales y necesarios para su uso y correcto funcionamiento, de suyo sea que los diagramas mostrarán algunos atributos y métodos que no son tratados de forma concreta en el presente documento.

<!-- - [Diagrama de clases](#) -->
- [Cuadro comparativo](#cuadro-comparativo-my-framework-vs-my-framework-ts)
- [Tecnologías](#tecnologías)
- [Entrada de la app](#entrada-de-la-app)
- [Modules](#modules)
  - [Composición modular](#composición-modular)
  - [Servicios en módulos](#servicios-en-módulos)
- [Componentes](#componentes)
  - [MyComponent](#mycomponent)
- [Decorador MyNode](#decorador-mynode)
- [Acoplamiento de componentes hijos](#acoplamiento-de-componentes-hijos)
  - [Acoplamiento en lotes](#acoplamiento-en-lotes)
- [Ciclo de vida](#ciclo-de-vida)
  - [LifeComponent](#lifecomponent)
- [Eventos en línea](#eventos-en-línea)
- [Formularios controlados](#eventos-en-línea)
- [Reactividad](#reactividad)
  - [Algoritmo de reconciliación](#algoritmo-de-reconciliación)
- [MyDOM](#mydom)
- [MyGlobalStore](#myglobalstore)
  - [MyShelf](#myshelf)
- [MyRouter](#myrouter)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Conclusiones](#conclusiones)


## __Diagrama de clases__
Este sencillo diagrama da cuenta de la composición general de las clases que participan del funcionamiento interno de my framework ts, de izquierda a derecha:
- Las clases __InputController__, __EventController__ y __LifeComponent__ componen a la clase __MyComponent__, esto significa que ellas solo cumplen funciones en la existencia de una instancia de la clase MyComponent, de allí que todas compartan un atributo _owner_ el cual refiere a su instancia propietaria y a su véz, estas son incluidas en atributos de la clase _MyComponent_.
- La clase __MyComponent__ mantiene una elación de agregación con la clase __MyDOM__, esta última se encarga de administrar y organizar todas las instancias de la primera, y a su véz determina su presencia en tiempo de ejecución.
- En la parte inferior la clase __MyShelf__ compone a la clase __MyGlobalStore__, esto significa que las funciones de la primera están subordinadas a la segunda, y sus instancias están contenidas en uno de los atributos de la clase __MyGlobalStore__; esta se relaciona con la clase __MyComponent__ en un orden de mediador observador, es aquí donde está implementado el patrón mediador de eventos u observer que los involucra, más adelante se darán más detalles al respecto.
- La clase __MyRouter__ guarda una relación con la clase __MyComponent__ y la clase __MyDOM__, esto debido a que sus funciones involucran la manipulación directa del renderizado de árboles de componentes.
- La clase __MyDOM__ casi no posee ningún atributo o método privado, esto debido a que son mayoritariamente estáticos, esta clase no está diseñada para instanciarse con regularidad.
- por último existe una clase __MyCentralService__ que no guarda ninguna relación directa con las demás clases, esto debido a que se involucra de forma idirecta mediante decoradores. Estos son asuntos internos de my framework ts y no son relevantes durante el desarrollo.

<p align="center">
  <img src="https://i.postimg.cc/7LcpBT34/Main.jpg" width="70%" height="auto" alt="my framework logo" title="my framework logo">
</p>

<hr>

My framework apuntaba a ser un reproducción de __[React.js](https://legacy.reactjs.org/)__, pero recientemente he interactuado con otras tecnologías como __[Angular](https://angular.io/)__ y exponerme a otras posibilidades y enfoques influyó directamente en el futuro de este proyecto. El primer gran cambio que salta a la vista es la inclusión de __Typescript__ como base, haciendo que esta inventiva cambie su nombre a __My Framework TS__. Pero este es solo el comienzo, debo admitir que la distancia entre este proyecto y mi anterior es abismal. Señalo a continuación algunos aspectos clave que recibieron ciertas modificaciones algunas importantes otras algo leves.

## __Cuadro comparativo: My Framework vs My Framework TS__
Aspecto a comparar |My Framework|My Framework TS|
|-|-|-|
|__Ciclo de vida de componentes__|Se encuentra centralizado en el funcionamiento de un atributo __$__ el cual es capaz de ejecutar lógica reactiva, esta característica sería análoga a useEffect de __React.js__. Respecto a la participación del ciclo de vida en el _store global_, se encuentra acoplado de forma tal, que la propagación de una modificación del store al cual se encuentra subscrito, demanda un re-renderizado obligatorio.|Además de su atributo __$__, posee un métodos adicional ``"destroy()"`` específico para la des-renderización del componente, pudiendo ejecutar lógica durante dicho evento. Los re-renderizados obligatorios por demanda del store global han sido reemplazados por una implementación del patrón observer, en el cual, el componente ahora cuenta con un método notificador subordinado las mutaciones que pueda sufrir el store al que se encuentra subscrito, esto desacopla el ciclo de vida del componente y lo convierte en un consumidor más de la información global, al conocer estos eventos puede decir si ejecuta lógica en consecuencia pudiendo re-renderizarse o no, esto garantiza que los componentes no serán los únicos capaces de consumir el estado global|
|__Renderizado condicional de componentes y nodos__|Todos los componentes tienen la capacidad de renderizarse en cualquier momento que se demande, incluso pueden hacerlo por lotes, todo ello en base a un sistema de attaching, en el cual el componente debe ejecutar un método en el __template__ donde fijará una raíz de referencia; sin embargo, cada componente renderizado demanda una __key__ única, de lo contrario su comportamiento no será el esperado. En cuanto al renderizado condicional de componentes puede realizarse lógica interpolada en el template para realizar el tattach a conveniencia, y esto mismo ha de aplicarse para nodos comunes|Todos los componentes tienen la capacidad de renderizarse en cualquier momento que se demande, incluso pueden hacerlo por lotes, todo ello en base a una conbinación de __selector__ y __llave (key)__, esto consiste en un sistema de parentezco mediado por módulos, donde el componente debe declararse como __nodo__ de un módulo y hasta entonces puede implementarse en el __template__, la ventaja de este sistema frente al anterior es una reducción del riesgo de conflicto entre keys, esto surgió por una serie de problemas que emergían del previo sistema de llaves por componente. En cuanto al renderizado condicional de componentes estos son acoplados al template mediante una invocación de una directiva espeifica para ello, en la cual se puede determinar un condicional para un renderizado asistido, y para los nodos comunes hay a disposición del template dos directivas estructurales diseñadas específicamente para ello, inspirado en la tecnología __Angular__|
|__Estado local de componente__|Todo el estado del componente está centralizado en una propiedad __state__ específica de la clase del componente, esta tiene la capacidad de persistir entre re-renderizados. Existe un método explicito para actualizar el estado del componente, este funciona de forma similar al método __setState()__ de los _StateFulWidget_ de __Flutter__, el cual evalúa si hubo algún cambio en el estado del componente y lo re-renderiza en consecuencia, en caso de no hallar cambios, simplemente ignora su invocación, este sitema evita re renderizados innecesarios debido al alto costo que ello implica|El estado del componente se encuentra descentralizado. En sí, __toda la clase__ del componente persiste entre re renderizados, esto gracias a que el sistema de instanciamiento de componentes es mucho más sofísticado y cualquier propiedad puede ser usada como almacén de datos persistente, al igual que un estado común, estos no persisten ante un des-renderizado del componente, el método de actualizado de estado fue reemplazado por un método __refresh()__, la principal ventaja de este cambio es que ahora sí disponemos de todo el cuerpo de la clase para ejecutar lógica, pudiendo declarar métodos y utilizarlos en el template, algo impensable en my framework, sin embargo, hay que tener en cuenta el __ownership__ de los métodos para su adecuado uso en el template|
|__Enrutamiento__|Cuenta con un sistema de enrutamiento sencillo del lado del cliente capaz de renderizar páginas de forma satisfactoria y añadir estados al historial de navegación empleándolos como params discretos, __NO__ tiene contemplado ``params slug`` ni la obtención de los ``queryparams`` en ruta|Implementa un sistema de enrutamiento con rutas declaradas tal como my framework, pero el enfoque es muy distinto, ahora se enrutan módulos en lugar de componentes y en esta implementación __SÍ__ hay soporte de ``slugsParams`` y también se contempla la obtención de ``queryParams`` en ruta, además de conservar el paso de datos discretos, pero siendo esta una característica específica para ello, esto signidifica que las rutas pueden ser dinámicas algo impensable en my framework|
|__Virtual DOM__|Técnicamente inexistente, el único DOM virtual que implementa my framework refleja la estructura del ``álrbol de componentes``, en otras palabras, my framework solo se preocupa por la dispocisión estructural de los componentes, no del DOM. Debido a que cada componente guarda una referencia de su nodo raíz, no requieren mayor información del DOM que esa|__My framework ts__ posee un sistema de DOM virtual para efectos del __algoritmo de reconciliación__, este refleja la disposición estructural de los nodos del DOM que corresponden al componente, este es generado en el primer renderizado y a partir de allí durante cada re-renderizado se generan virtualdoms parciales con propósitos de reactividad|
|__Reactividad__|El sistema de reactividad de my framework se basa en un redibujado de la interfaz a __nivel de componente__, esto significa que cada véz que se demanda una actualización de la vista, no importa que tan ``insignificante`` sea el cambio, todo el árbol de nodos del componente será redibujado, incluyendo sus componentes hijos, esto garantiza que la actualización de la vista será efectiva y reflejará todos los cambios efectuados en el template|La reactividad en my framework ts se basa en un sensillo __algoritmo de reconciliación__, este realiza un análisis del __DOM virtual__ que refleja los cambios efectuados en el template y lo compara con una instantanea virtual del __DOM__ con la actual realiza una bíusqueda de discrepancias, en caso de hallarlas realiza las modificaciones correspondientes. Este sistema de reactividad implica un redibujado de la interfaz a __nivel de nodo__, es decir, cada vez que se demanda un refresco de la vista, el algoritmo se encarga que solo los nodos que presenten cambios sean afectados, este implementación es mucho menos costosa y mucho más sofísticada que la anterior|

<hr>

## __Tecnologías__
Las tecnologías empleadas son __HTML 5__ y __Typescript 5.0.2__, los estilos no son objeto de interés para el presente ejercicio, solamente la estructura y manipulación de la interfaz; al contar con html para el maquetado, puede aplicarse cualquiera de los estilizados que este admita: __CSS__, __SASS__, etc.

<hr>

## __Entrada de la App__
``My framework ts`` tiene una estructura inicial inspirada en __React.js__ esto significa que toda la composición será anclada a una raíz que se establece desde el inicio del proyecto, la sintaxis es la siguiente:

~~~Typescript
//src/main.ts
import { MyDOM } from "@my_framework/core/myDOM";
import { MyRouter } from "./lib/my_framework/router/myRouter";
import { AppModule } from "./app.module";

const root = MyDOM.createRoot(document.getElementById('root'));
root.render(AppModule);
~~~
La clase __MyDOM__ nos porevee una serie de métodos de interés para la estructura general del árbol de componentes, pero realmente son muy pocos los que nos interesan, el primero es el método estático ``createRoot()``, este método establece cuál será la raíz de la app en el __DOM__, este será el pivote y la referencia para renderizar todos los módulos que convengan. Este retorna un objeto con una función _render()_ la cual recibe como parámetro el módulo que se espera sea renderizado en la raíz

El fichero con esta sintaxis inicial es el que debe ser referenciado en nuestra etiuqtea __script__ en nuestro ``index.html`` el cual tendrá la siguiente apariencia:

~~~HTML
<!--./index.html -->
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="assets/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>

~~~

<hr>

## __Modules__
Los módulos son ``representaciones de grupo``, con ellos podemos construir árboles de componentes, inyectar __servicios comunes__ y establecer un sistema de parentezco más confiable que en el anterior sistema de árboles sin módulo de __my framework__, esto nos agrega una capa más a la composisción permitiendo granularizar aún más el diseño, mejorar la experiencia de desarrollo, la escalabilidad y capacidad de reutilización.

Para la declaración de un nuevo módulo se requiere el uso del decorador __MyModule__, este recive como parámetro __tres (3)__ atributos obliatorios y __tres (3)__ opcionales:

- __key__(obligatorio): Consiste en una cadena de texto que lo distinque de los demás módulos, este atributo es necesario para uso interno de my framework ts.
- __rootNode__(obligatorio): se trata del componente que será el pivote sobre el cual se construye el árbol de componentes, este se concidera el componente raíz del módulo.
- __nodes__(obligatorio): consiste en un arreglo de componentes, siempre que se desee acoplar un componente en el template de otro comonente debe estar seguro que se encuentra declarado como nodo del módulo, para ello debe ser añadido dentro de este arreglo. Si un módulo está compuesto por un solo componente este atributo puede ser un arreglo vacio.
- __name__(opcional): por defecto, todos los módulos pueden renderizarse como una página de la aplicación, en este sentido este atributo es una cadena de texto que será añadida en el ``document.title`` siempre que este sea el módulo enrutado, en caso de no declararse, el texo será por defecto "title"
- __services__(opcional): consiste en un arreglo de clases de servicio, estos son los servicios que serán eventualmente inyectados por el constructor de los componentes nodo del módulo, más detalles sobre servicios en la sección [servicios](#servicios-en-módulos)
- __modules__(opcional): consiste en un arreglo de módulos, este atributo reune todos los módulos que participan de la composición de este módulo en concreto. En el momento en que se declara un módulo dentro de este atributo, el componente raíz del mismo estará disponible para ser acoplado en el template de los componentes nodo asociados al módulo principal, de esta forma podemos no solo componer una página con componentes, sino tambien con módulos como ya veremos acontinuación.

### __Composición modular__
A continuación un ejemplo de un 

  ~~~Typescript
import { MyModule } from "@my_framework_ts/decorators/myModule";
import {Component1, Component2} from './components/components';
import {AppComponent} from './app'

@MyModule({
  key: 'my-module',
  name: 'My App',
  nodes: [Component1, Component2],
  modules: [SomeModule],
  rootNode: AppComponent
})
export class MyAppModule{}
~~~

Esta declaración implica la existencia de dos componentes participantes y un módulo de nombre "SomeModule" destinados a acoplar su raíz en el módulo principal "MyAppModule". 

  <figure align="center">
    <img 
      src="https://i.postimg.cc/vBjdwyY9/comp-mod-tree.png" 
      width="300px" height="auto" alt="my framework logo" 
      title="my framework logo"
    >
  </figure>
 
  En esta ilustración podemos observar la composición general de una página de __my framework ts__, todo parte de un componente raíz perteneciente a un módulo principal y de allí se extiende una ramificación de la cual pueden participal otros módulos, pudiendo acoplarse al cuerpo del árbol del módulo padre con su nodo raíz, el segundo módulo a su véz podrá tener otros módulos componiéndole de ser necesario.

  Ambos árboles de componentes allí ilustrados pueden ser renderizados individualmente si así se desea, ya que cada uno representa una unidad autosuficiente.

  ### __Servicios en módulos__

  ~~~Typescript
    import { MyModule } from "@my_framework_ts/ decoratorsmyModule";
    import {Component1, Component2} from './componentscomponents';
    import {SomeService} from './services/SomeService'
    import {AppComponent} from './app'

    @MyModule({
      key: 'my-module',
      name: 'My App',
      services: [SomeService],
      nodes: [Component1, Component2],
      nodes: [],
      rootNode: AppComponent
    })
    export class MyAppModule{}
  ~~~

  Luego de declarado en el atributo services, el servicio será preveído a través del contructor de cada componente participante, los servicios solo estarán disponibles para el árbol de componentes del módulo donde fueron declarados. 
  
  En la siguiente ilustración identificamos los servicios con los pequeños circulos azules de distinto tono, vemos dos árboles de componentes cada uno teniendo a su disposición el servicio declarado en su respectivo módulo. Los servicios en módulos son exclusivos para sus componentes nodos, esto significa que, si un modulo hace parte de la estructura de otro, tal y como se ilustra acontinuación, este no tendrá acceso al sericio declarado en su padre, si así lo desea necesitará declararlo en su decorador con el atributo __services__, de igual forma este podrá tener los servicios que requiera y estarán desponible en cada componente árticipante de su árbol.

  <figure align="center">
    <img src="https://i.postimg.cc/J0G4jKn3/comp-mod-serv-tree.png" width="300px" height="auto" alt="my framework logo" title="my framework logo">
  </figure>

<hr>

## __Componentes__
Los componentes son fragmentos o maquetas que nos permiten componer las vistas de forma modular, cada uno de ellos se responsabiliza de su diseño y lógica intrínseca, de esta forma podemos modularizar nuestro código haciendo más amena la experiencia de desarrollo, ``en my framework ts`` estos se basan en plantillas literales que siguen ciertas reglas para poder transformarse en código html entendible para el navegador, poseen la siguiente sintaxis:

~~~Typescript
//src/components/counter.ts
import { MyComponent } from "@my_framework/component";

//decorador que designa al componente como un nodo participante
@MyNode({selector: 'my-counter'}) 
//clase madre que hereda toda la lógica necesaria para generar un componente de clase
export class CounterComponent extends MyComponent{
  count: number = 0; //propiedad local del componente

  //método propio del componente
  addCount = ()=>{ 
    //método especializado que invoca un refresco de la vista
    this.refresh(()=>{  
      this.count++;
    });
  }

  //método especualizado encargado de generar el template
  //con la sintaxis html del componente
  build(){
    //método especializado encargado de aplicar directivas y 
    //operaciones especiales durante generación del template
    return this.template((_)=>`
    <main>
      <h2>Mi Contador</h2>
      ${/*Propiedad interpolada para mostrar en vista*/}
      <p>${this.count}</p>
      ${/*directiva "on" para añadir eventos en línea*/}
      <button ${_.on('click', this.addCount)}>add</button>
    </main>
    `);
  }
}
~~~
Inmediatamente se puede apreciar que se trata de un __componente de clase__, efectivamente, my framework ts tiene como base componentes de clase, tal y como lo era mi anterior ejercicio: [__My framework__](https://github.com/LeonardoPatinoMolina/my-framework), pero este posee ciertas novedades.
 
 El componente __CounterComponent__ está heredando de la clase __MyComponent__, de la acual obtiene todos los métodos propios de un componente reactivo, pero advertimos una diferencia respecto a my framework: adicionalmente la clase está siendo decorada con el decorador de fabrica __@MyNode()__ este recibe obligatoriamente un objeto como parámetro con el atributo obligatorio __selector__.

En este caso tenemos un clásico contador, gracias a este ejemplo tan típico tengo espacio para mostrar rápidamente la existencia del método __refresh()__, este es el método utilizado por el componente para invocar sus re-renderizados.

## __Decorador MyNode__
El decorador MyNode es indispensable para la adecuada declaración de un componente en __my framework ts__, a diferencia de [My framework](https://github.com/LeonardoPatinoMolina/my-framework), donde bastaba con heredar de la clase __MyComponent__. 
Este decorador recibe como parámetro __un (1)__ atributo obligatorio y __uno (1)__ opcional:

- __selector__(obligatorio): consiste en una cadena de texto que servirá para referenciar la clase del componente en el template donde se realizará el acople, es decir, cada vez que se requiera añadir un componente a la composición, será referenciado con la cadena de texto que se ingresó en este atributo.
- __styles__(opcional): este atributo es especial, recibe una cadena de texto que contenga codigo __CSS__ puro, tu trabajo es añadir dichos estilos solo cuando el componente se renderice, los estilos que sean declarados en este atributo solo estarán disponibles en la aplicación durante el ciclo de vida del componente, su propósito es hacer aún más reutilizables los componentes prescindiendo de una hoja de estilo explicicta. Un ejemplo rapido es el componente utilizado internamente por __my framewrok para rutas desconocidas en el enrutador:

  ~~~typescript
  import { MyComponent } from "@my_framework/core/myComponent";
  import { MyNode } from "@my_framework/decorators/myNode";
  import { MyRouter } from "@my_framework/router/myRouter";

  @MyNode({selector: 'not-found', styles: (`
    .not-found-template-00{
      background-color: #222;
      width: 100%;
      height: 100vh;
      color: #f1f2f3;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .not-found-template-00__btn:hover{
      background-color: #aaa;
    }
    .not-found-template-00__btn{
      font-family: Century Gothic, system-ui, Avenir, Helvetica, Arial, sans-serif;
      margin-top: 1rem; 
      border-radius: 1rem;
      padding: 1rem;
      font-size: 1rem;
    }
    
    .not-found-template-00__card{
      font-family: Century Gothic, system-ui, Avenir, Helvetica, Arial, sans-serif;
      border-radius: 1rem;
      padding: 1rem;
      outline: 2px solid #f1f2f3;
    }
    .not-found-template-00__card__title{
      font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;;
      text-align: center;
      color: #f1f2f3;
      font-weight: bold;
    }
    .not-found-template-00__card__paragraph{
      background-color: green;
    }
  `)})
  export class _404Component extends MyComponent{
    build(): string {
      return this.template((_)=>`
        <main class="not-found-template-00">
          <div class="not-found-template-00__card">
            <h1 class="not-found-template-00__card__title"> 404</h1>
            <p class="not-found-template-00__card__paragrah">Page not found</p>
          </div>
          <button class="not-found-template-00__btn ${_.on('click',()=>MyRouter.go('/'))}>Come back to home</button>
        </main>
      `);
    }
  }
  ~~~

    >Nota: Este ejemplo posee otros aspectos importantes que serán tratados más adelante

### __MyComponent__
La clase cuenta con __ocho (8)__ atributos públicos y unos __4 cuatro 4__ getters que tendremos a nuestra disposición para diversas operaciones, estos son los siguientes:

### __Atributos__

- __$__: atributo encargado de efectos reactivos al ciclo de vida del componente, este atributo es una instancia de otra clase que detallaré más adelante.
- __body__: almacena la estructura ``HTML`` del template, esta no es necesariamente una referencia al DOM, su finalizad es para detección de cambios entre re-renderizados, y realización de directivas estructurales, todas ellas operaciones internas, en general tiene una utilidad de solo lectura.
- __isInitialized__: atributo ``booleano`` que hace un seguimiento a la inicialización del componente, este estatus se establece en ``true`` cuando es _instanciado_, y vuelve a ``false`` cuando es _des renderizado_, el ciclo de vida de los componentes se detallará más adelante.
- __isFirstMount__: atributo ``booleano`` que hace un seguimiento a la primera renderización del componente, este estatus es ``true`` al renderizarse por primera vez y vuelve a ``false`` en los renderizados siguientes, sin embargo, regresa a ser ``true`` cuando se desrenderiza, más detalles en la explicación del ciclo de vida.
- __isRendered__: atributo ``booleano`` que hace un seguimiento al renderizado en vigor del componente, la diferencia con _isInitialized_, es que este asegura que el componente se encuentra renderizado en cambio aquel no, de nuevo, estará algo más claro cuando detalle el ciclo de vida de un componente.
- __key__: cadena de texto que identifica al componente y lo distinque de los demás.
- __parent__: este atributo hace referencia al componente que funge como padre del presente componente, si por el contrario, el componente no tiene padre alguno, como por ejemplo el componente raíz, el atributo permanece en ``undefined``
- __props__: atributo a través del cual el componente _padre_ puede comunicarse, este puede ser cualquier dato que quiera recibirse desde su invocación.
- __inputModel__: atributo opcional reservado para fines de control de formularios, más detalles en la sección de [formularios controlados](#formularios-controlados).
- __childAttaching__: Este método indexa todos los hijos potenciales del componente, estos son todos los nodos que han sido declarados en el módulo al que pertenece el presente componente. 
Este atributo tiene un propósito de uso interno, no hace falta manipularle, ya que está diseñado para operar en un contexto específico.

### __Métodos__
Ahora pasamos a los métodos, la clase __MyComponent__ sin contar el método constructor, posee __10__ métodos púbicos puestos a nuestra disposición para realizar diversas funciones, de estos 10, __cuatro (4)__ están destinados a ser sobrescritos; __dos (2)__ de los 10 son _obligatorios_ si queremos un mínimo para la adecuada funcionalidad del componente, y como último detalle __dos (2)__ de los 10 no están destinados a uso regular, son propiamente utilizados por la lógica interna del framework, sin embargo, conviene conocerlos. 

clasificados son los siguientes: 
#### __Constructor__
- __constructor(svc?: any)__: el método constructor recibe como parámetros un objeto opcional, este puede contener todos los servicios declarados en el módulo, en caso contrario estará vacio, la idea central es poder recibir por inyección un servicio compartido entre nodos del mismo modulo en el cual sea provisto. al ser este un parámetro opcional, los componentes hijos no están obligados a pasarlo por la función __super()__ durante herencia, simplemente pueden asignarlo y usarlo a conveniencia, ejemplo:
  ~~~typescript
  @MyNode({selector: 'my-app'})
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
  Básicamente es un recuento de todas los manejadores y directivas del template, más sin embargo, ya en el ejemplo del contador se pudo ver una muestra del atributo ``_.on()``.
  - ``Directivas``: La directivas del template son funciones especualizadas para tareas muy específicas, entre estas tenemos:
      - __on:__ esta directiva se encarga de añadir controladores de eventos en línea, ya vimos su uso en ejemplos anteriores, más detalles en la sección [eventos en línea](#eventos-en-línea);
      - __inputController:__ directiva encarga de añadir controladores especializados en el control de campos de texto, es decir, etiquetas ``input`` o ``textarea``, más detalles y ejemplos de uso en la sección [formularios controlados](#formularios-controlados).
      - __myIf:__ directiva estructural especializada en renderizado condicional de nodos puros, un nodo puro es un nodo html que en su sintaxis no envuelve ningún componente, un ejemplo: 

        ~~~Typescript
        template(()=>`
          <main>
            <div>
              ${/*nodo puro*/}
              <h2>lorem ipsum</h2>
            </div>
              ${/*nodo inpuro*/}
            <section>
              ${_.child('my-component')()}
            </section>
          </main>
        `)
        ~~~
        
        En el presente ejemplo podemos diferenciar lo que es un nod puro de uno inpuro, además de anticipar lo que es el __acoplamiento de componentes hijo__ en el template, pero esto lo trataremos más adelante. Una posible aplicación de esta directiva sería la siguiente:
        ~~~typescript
          num: number = 0;
          template(()=>`
          <main>
            <div>
              <h2 ${_.myIf(this.num > 3)}>lorem ipsum</h2>
            </div>
            <section>
              ${_.child('my-component')()}
            </section>
          </main>
        `)
        ~~~
        En este ejemplo vemos que las directivas estructurales deben interpolarse denro de la etiqueta como uno de sus atributos, en este caso particular la etiqueta "h2" no se renderizará a menos que la propiedad __num__ sea mayor a __3__.
      - __myMul:__ directiva estructural encargada de multiplicar el nodo al cual se encuentre afectando, el funcionamiento de esta directiva consiste en recibir como parámetro un numero entero positivo y multiplicar por ese número la cantidad de instancias de el nodo en cuestion en sea ubicación, este cambio sera reflejado en HTML resultante un ejemplo de una posible aplicación:

        ~~~typescript
          //declaración
          num: number = 3;
          template(()=>`
            <main>
              <div>
                <h2 ${_.myMul(this.num)}>lorem ipsum</h2>
              </div>
              <section>
                ${_.child('my-component')()}
              </section>
            </main>
          `)
        //resultado
        ~~~
        ~~~html
        <!-- resultado -->
        <main>
          <div>
            <h2>lorem ipsum</h2>
            <h2>lorem ipsum</h2>
            <h2>lorem ipsum</h2>
          </div>
          <section>
            <!-- my component -->
          </section>
        </main>
        ~~~
      - __child:__ directiva especial dedicada al acoplamiento de componentes hijos individuales, es decir, a través de esta directiva podemos acoplar un componente hijo en el template, con esta directiva podemos inyectar props, atributos de renderizado condicional y keys de diferenciación, pudimos ver su sintaxis en ejemplos anteriores, más detalles en la sección [acoplamiento de componentes hijos](#acoplamiento-de-componentes-hijos).
      - __children:__ directiva especial dedicada al acoplamiento de componentes hijos por lotes, es decir, a través de esta directiva podemos acoplar un componente hijo en el template, con esta directiva podemos inyectar props, atributos de renderizado condicional y keys de diferenciación utilizado un builder, más detalles en la sección [acoplamiento de componentes hijos](#acoplamiento-de-componentes-hijos).

#### __Opcionales__
- __(para sobreescritura) init()__: método destinado a ser sobre escrito, no tiene parámetros, esté metodo se ejecuta automáticamente al inicializar el componente y no vuelve a ejecutarse hasta que el componente sea desrenderizado y en un eventual futuro vuelto a inicializar, lo cual es distinito de un re renderizado, este comportamiento lo hace idóneo para tareas de una sola ejecución como subscripciones a globalStore o peticiones a un servidor remoto.
- __(para sobreescritura) ready()__:  método destinado a ser sobre escrito, no tiene parámetros, este método se ejecuta automáticamente cada vés que el componente se renderiza, incluyendo los re renderizados, es decir, su función es proveer un espacio para ejecutar lógica cuando el componente se encuentra en el _DOM_, esto es útil para la lógica interesada en manipular el DOM, aunque también puede usarse en cojunto al atributo __$__, para un manejo complejo del ``ciclo de vida``.
- __(para sobreescritura) destroy()__:  método destinado a ser sobre escrito, no tiene parámetros, este método se ejecuta automáticamente cada vés que el componente se des-renderiza, es decir, su función es proveer un espacio para ejecutar lógica cuando el componente es removido del árbol principal, esto es útil para la lógica interesada en desubscripciones y semejantes.
- __refresh(callback?)__: método encargado de actualizar la vista, en otras palabras, es el equivalente a un _setState()_, pero no funciona como ``React.js``, en su lugar funciona como ``Flutter``, ejecuta una serie de operaciones en busca de un cambio en la vista en caso de aberlo realiza el ``refrescado``. El método tiene como parámetros una función ``callback`` donde podremos ejecutar lógica previa a la actualización de la vista, este sistema es un simil del ``setState()`` de flutter, su propósito es simplemente una ayuda visual para ejecutar la lógica que modiffique la vista antes del refresh, por ello basta con invocar el método despues de realizar las modificaciónes sin necesidad de pasarle ese callback, hemos visto su aplicación en ejemplos anteriores:
  ~~~typescript
    this.refresh(()=>{  
      this.count++;
    });
    //es quivalente a:
    this.count++;
    this.refresh();
  ~~~
  la idea central es realizar el __refresh__ luego de modificar alguna dependencia de la vista, la anidación de la lógica en el callback es una ayuda visual y nada más.

#### __De lógica interna__
- __render()__: método encargado de renderizar el componente, notificando la montura del mismo.
- __(asíncrono) clear()__: método encargado de "limpiar" el componente del árbol, esto implica removerlo de _MyDOM_, del árbol en sí y reestablecer todos los eventos y funciones asociadas al mismo. Es la forma que tiene my framework ts de liberar de la estructura principal un componente para dar espacio a los demás.


## __Acoplamiento de Componentes hijos__
Para garantizar un adecuado manejo del parentezco entre componentes my framework ts utiliza un sistema de attaching en el cual el acoplamiento de un componente a otro es mediado por un mecanismo especializado, para ello existe la directiva __child()__ en el método __template()__ que ya hemos podido visualizar en ejemplos anteriores, esta directiva recibe como parámetro una cadema de texto que hace referencia al selector del componente en cuenstion, pero para un mejor entendimiento hagamos el paso a paso:

1. Antes de intentar acomplar un componente en el cuerpo de otro, debemos asegurarnos que estos comparten módulos, o que el compoente al que se acopla sea la raiz del módulo donde el objetivo está declarado:

    ~~~typescript
    @MyModule({
      key: 'app_module',
      name: 'app',
      nodes: [ChildComponent1, ChildComponent2],
      rootNode: AppComponent
    })
    export class AppModule{}
    ~~~
  
    En estas condiciones ``ChildComponent1`` y ``ChildComponent2`` pueden acoplarse los unos a los otros o directamente en el nodo raíz del módulo (``AppComponent``), esto dibido que comparten el mismo módulo.

2. Damos uso de la directiva ``child()`` en el template del componente que se desa sea el padre.

  ~~~typescript
  build(): void {
    return this.template((_)=>`
      <main>
        <p>title</p>
        ${_.child('my-child-1')}
      </main>
    `)
  }
  ~~~

    En este paso decidimos en qué parte del template acoplaremos el componente e interpolamos la directiva __child()__ parando como parámetro el selector del componente en cuestión, en ste caso es ``my-child-1``, sin embargo, no hemos finalizado.

3. La directiva __child()__ retorna una función que debe ejecutarse para acomplar satisfactoriamente en el lugar, esta función recibe como parámetro un objeto opcional, pero basta con simplemente invocarla para acoplar un componenete satisfactoriamente.

    ~~~typescript
    build(): void {
      return this.template((_)=>`
        <main>
          <p>title</p>
          ${_.child('my-child-1')()}
        </main>
      `)
    }
    ~~~

Hay ciertas consideraciones importantes para que esta operación sea exitosa. 
- Cuando un componente desea acomplarse más de una vez en el mismo template, debe poder distinguirse de los demás, para ello se emplea una key única, esta debe ser fija y no variar con el tiempo, se provee por el parámetro de la función retornada por la directiva __child()__, caso cotrario tendremos comportamientos inesperados. Sin ebargo puede mantenerse uno de ellos son una key explicita

    ~~~typescript
    build(): void {
      return this.template((_)=>`
        <main>
          <p>title</p>
          ${_.child('my-child-1')()}
          ${_.child('my-child-1')({key: 'my-key-1'})}
          ${_.child('my-child-1')({key: 'my-key-2'})}
        </main>
      `)
    }
    ~~~
- si queremos comunicar información hacia el componente acoplado podemos emplear props, estas deben proeerse por un atributo del mismo nombre en el objeto pasado como parámetro de la función retornada por la directiva __child()__.
  
    ~~~typescript
    data: any = 'data';

    build(): void {
      return this.template((_)=>`
        <main>
          <p>title</p>
          ${_.child('my-child-1')({props: {data: this.data}})}
        </main>
      `)
    }
    ~~~

### __Acoplamiento en lotes__
En ocaciones querremos acoplar una más de un componente al tiempo, la cantidad de componentes a acoplar podría ser arbitrario y variar entre renderizados, a esto nos referimos con ``acomplamiento en lotes``, para ello tenemos la directiva __children()__, su uso es muy parecido a la directiva __child()__, pero en lugar de returnar una función que resibe como parámetro un objeto, esta recibe un arreglo de objetos. Cada objeto debe contener minimo un atriubuto key con la key única que distinguirá a cada componente acoplado.
  ~~~typescript
  data: any = 'data'
  build(): void {
    const builder = [
      {key: 'kei-1'},
      {key: 'kei-2', props: {data: this.data}},
      {key: 'kei-3'},
    ]
    return this.template((_)=>`
      <main>
        <p>title</p>
        ${_.children('my-child-1')(builder)}
      </main>
    `)
  }
  ~~~

  En este ejemplo tenemos un arreglo con tres objetos cada uno con su key correspondiente y uno de ellos estaría recibiendo como props un objeto con el atributo ``data``, en efecto cada objeto corresponde a un componente acoplado, todos ellos pertenecientes al selector ``my-child-1``.

## __Ciclo de vida__
El ciclo de vida de un componente tiene __cuatro__  estadios o estados, estos atienden a su invocación, montura, reactividad y desmonte:

1. __inicialización__: es la etapa en la cual el componente es invocado ya sea como la raíz del árbol o en el template de su padre, en esta etapa conviene realizar las subscripciones e inicializaciones de propiedades de interés. Las formas que podemos usar para asociar la ejecución de lógica a esta etapa son el método ``init()`` o el ``contructor`` mismo del componente. En el siguiente ejemplo vemos estas dos formas para hacer una consulta http:

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
Este fue uno de los retos principales de my framework y en este caso my framework ts buscó mejorar la solución, repasemos __¿cuál es el problema a resolver?__.


### __El problema__
``My framework ts`` es una herramienta para desarrollar aplicaciones front-end de página única con componentes _reactivos_ cuya principal característica es que constantemente se re renderizan con la finalidad de actualizar la vista. 

Imagine un usuario ingresando su información en un formulario de registro, el valor ingresado es un dato que pertenece al campo de texto que se encuentra renderizado en ese momento, pero antes de culminar su diligencia, el usuario decide hacer una pequeña acción en la vista que implica ``re-renderizar`` el árbol de componentes del cual participan los campos del formulario. Aquel dato previamente ingresado en el campo del formulario __NO es persitente por definición__, solo las propiedades del componente y el globalStore son los datos capaces de persisitir entre re-rederizados, __¿debemos hacer que el valor del campo sea uno de estos datos persistentes?__, pero por supuesto, __¿se solucionó el problema?__, lastimosamente no, o no exactamente.

Esta situación acarrea una serie de problemas con arreglo a la experiencia del usuario en los campos de un formulario lo suficientemente elaborados (pérdida del foco, perdida de la ubicación del cursor y pérdida de datos ingresados) como para requerir una solución especializada. Si quería garantizar la correcta funcionalidad de los __formularios__ en my framework ts debía lidiar con estos asuntos.


### __La solución__

>``Nota:`` Me reservo los detalles internos de su implementación, tiene a su disposición el código empleado para ello.

La forma solución empleada en ``my framework ts`` implicó resguardar los datos ingresados y el estado de foco del campo involucrado. Sin embargo, la forma en la que esto se efectuaba estaba pensado para re-renderizar el componente en cada manipulación que se realizara sobre los campos de los formularios. Como imaginará esto era muy costoso a nivel de recursos, pero funcional a fin de cuentas, esto era así debido al sisitema de reactividad empleado entonces por my framework, __my framework ts__ implementa un sistema de reactividad distinto, por ello se pudo permitir un manejo distinto de esta problemática.

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

``callback(value):`` este parámero es opcional, consiste en una función que recibe como parámetro el valor actual del input y obligatoriamente debe retornar una cadena de texto que corresponde al nuevo valor luego de realizarle los cambios de nuestro interés. Es a travéz de este callback que podemos controlar el valor ingresado en la etiqueta con la garantía de la peristencia de la información entre re-renderizados.

#### __Últimas apreciaciones__
Es importante recalcar que esta implementación no consiste en formularios reactivos, sino formularios controlados con persistencia de datos.

<hr>

## __Reactividad__
La reactividad en my framework ts opera bajo un ``algoritmo de reconciliación``, para ello emplea un __virtual DOM__ este consiste en un __árbol n-ario__ que funge como una representación abstracta del árbol de nodos HTML del componente, en cada refresco de la vista el algoritmo realiza una comparación entre el árbol de nodos del componente y el DOM en busca de discrepancias (_mismatches_), en caso de hallarlas, ejecuta operaciones especializadas para reconciliar ámbas esctructuras primando la del árbol virtual sobre el  DOM.

### __Criterios de discrepancias (mismatches criteria)__
Los criterios a los que se rige la reconciliación están clasificados en 2 tipos:

- __Cualitativos__: Son todas aquellas discrepancias donde un nodo presenta una diferencia en sus ``atributos`` o en su ``tagName``, algunos ejemplos de una discrepancia cualitativa: 

~~~html
<!-- diferencia en valores de atributos -->
<div id="firstName" >content</div>
>>>
<div id="secondName" >content</div>

<!-- diferencia en número de atribuytos -->
<div id="firstName" >content</div>
>>>
<div id="firstName" class="content" >content</div>

<!-- diferencia en en tag name -->
<div id="firstName" class="content" >content</div>
>>>
<section id="firstName" class="content" >content</section>
~~~

- __Cuantitativos__: Son las discrepancias donde la cantidad de nodos en el árbol ha cambiado, ya sea por un aumento o disminución de los mismos:

~~~html
<article>
  <h2>title</h2>
  <p>lorem ipsum dolored</p>
</article>
>>>
>>>
<article>
  <h2>title</h2>
  <p>lorem ipsum dolored</p>
  <p>end</p>
</article>
~~~

Segun sea el criterio, el algoritmo de reconcilñiación decidirá qué tipo de operación debe realizarse sobre el DOM para corresponder el cambio en el viritual DOM. La operación menos costosa implica __modificar, remover o añadir un atributo__, la más costosa implica __re renderizar__ el nodo enteramente. Una discrepancia cuantitativa sule ser la más costosa de reconciliar.

### __Algoritmo de reconciliación__
Para razones de reconsiliación, my framework ts emplea ciertos recursos entre ellos:

- __Virtual DOM__: consiste en una represetación estructural del DOM en memoria, esto con motivos de manipulación ágil de los datos referentes al árbol de nodos del documento.
- __Algoritmos de búsqueda en profundidad__: consiste en un alforitmo que mapea los virtual DOM de forma profunda en búsqueda de discrepancias basado en los criterios previamente mencionados.
- __Acciones de reconciliación__: son operaciones especificas que realizar la concicliación entre el DOM ey el virtualDOM una vez identificada la discreancia.

La principal ventaja de este enfoque de reactividad frente al anterior usado por my framework, es el nivel de precición a la hora de manipular el DOM, mientras que anteriormente cualquier actualizacion de la vista implicaba un redibujado de todo el árbol de nodos del componente, ahora solo se redibuja el nodo que presenta el cambio, mejorando la experiencia de usuario y aliviando muchas preocupaciónes en la etapa de desarrollo.

<hr>

## __MyDOM__
A esta entidad me refiero cuando hablo de árbol de componentes, consiste en una instancia única que sigue el patrón __Singleton__ pues solo debe existir uno en todo la app. Su propósito es fungir como pivote, como soporte sobre el cual ensamblar la estructura general de todos los componentes que se encuentren en funciones, además de converger en él lógica general respecto a ciertas operaciones realizabes sobre el __virtual DOM__ de forma generalizada.

### __Atributos__
MyDOM cuenta con __tres 3__ atributos públicos, los cuales no tienen una trascendencia mayor a la lógica interna del framework, pero de igual forma conviene conocerles:

- __tree__: este atributo contiene el virtual DOM general generado durante el renderizado inicial de la aplicación o de la página actual en caso de utiliar el enrutador. Su propósito es netamente para renderizados iniciales.
- __nodes__: este atributo es un objeto __Map__ que almacena las referencias a todos los nodos de los componentes que se encuentren en funciones, indexados por su propia key. Este atributo es el que será utilizado para propagar eventos y demás operaciones internas.
- __root__: este atributo almacena una referencia a la raíz de la aplicación, la cual es el elemento del DOM en el cual se renderiza el árbol, un ejemplo podía ser:

    ~~~Html
    <div id="root"></div>
    ~~~

### __Métodos__
los métodos de la entidad MyDOM son en su mayoría estáticos, cuenta con __once 11__ métodos estáticos de los cuales están destinados para usarse en la lógica interna del framework, sin embargo, algunos pueden ser de utilidad para el uso regular, por ello conviene conocerlos:

- __clearDOM()__: método encargado de vaciar y eliminar todos los datos del árbol, este método tiene el propósito de ser empleado de forma interna en el enrutador, tema que será tratado más adelante.
- __createRoot(root)__: método encargado de asignar el elemento del DOM que será la raíz del árbol de componentes, ya en el ejemplo de la entrada de la app se pudo observar su uso, este recibe como parámetro el elemento destinado a este fin.
- __getMemberNode(key)__: función encargada de retornar el nodo correspondiente a la ``key`` que se suministre la cual pertenece a un componente en particular.
- __deleteNode()__: Método encargado de eliminar un nodo identificado con la key que se suministre en el árbol.
- __deleteChildNode(parentKey, targetChildKey)__: método encargado de remover un componente hijo, es decir, de removerlo dentro de su componente padre, para ello recibe como parametro la key del componente _targetChildKey_ el cual será removido y la del componente padre _parentKey_.
- __setGlobalStore(store)__: método encargado de asignar el store global al árbol de componentes, recibe como parámetro el objeto retornado por el método configStore de la clase ``MyGlobalStore`` que será tratada más adelante. 
- __addMember(args)__: este método añade un nuevo miembro a los nodos del árbol, recibe como parámetro una un nodo correspondiente al componente que será añadido.
- __deleteNode(key)__: método encargado de remover un componente que ya es miembro de los nodos del árbol,recibe la key del nodo a eliminar como parámetro. Este método es empleado por el framework para remover componentes que son des renderizados.
- __isInTree(key)__: Método encargado de verificar si el componente identificado con la key suministrada existe como miembro activo del árbol.
- __notifyInTree(keyNode, notify)__: Método encargado de propagar una notificación en un arbol especificado en la key suministrada _keyNode_ de forma descendente partiendo de un nodo raíz especificado, el parámetro _notify_ consiste en una función callback encargada de realizar la notificación mientras que recibe como parámetro el el nodo actual notificado.
- __notifyInTreeReverse(keyNode, notify)__: Método encargado de propagar una notificación en un arbol especificado en la key suministrada _keyNode_ de forma ascendente partiendo de un nodo raíz especificado, el parámetro _notify_ consiste en una función callback encargada de realizar la notificación mientras que recibe como parámetro el el nodo actual notificado.

<hr>

## __MyGlobalStore__
La administración del estado global en my framework es llevada a cabo por la clase MyGlobalStore, esta se vale de otra clase llamada __MyShelf__ y una función auxiliar llamada __createShelf__. Al igual que la clase MyDOM es una entidad de única instancia, y engloba la estructura y lógica necesaría para proveer una serie de datos en forma de store global, este sistema sigue el ``patrón reductor`` para la asignación de funciones de mutabilidad de datos del store, y el ``patrón observer`` para subscribir componentes reactivos al mismo, pues, efectivamente se trata del __estado global__ de la app.

### __Atributos__
 La clase MyGlobalStore cuenta con __dos__ atributos que normalmente no tendremos que manipular:

 - __store__: este atributo es un objeto __Map__ que almacena todas las store las cuales consisten en instancias de la clase ``MyShelf``, estás son indexadas por su ``reducerpath``, el cual es una cadena de texto que se declara en la clase MyShelf, la cual será detallada más adelante.
 - __observers__: este atributo es un objeto __Map__ que almacena todos los componentes que se encuentran subscritos a un store concreto.

 ### __Métodos__
 Todos los métodos de la clase MyGlobalStore son estáticos, cuenta con __cuatro 4__ métodos destinados a declarar, subscribir, desubscribir y despachar:

 - __configStore(config)__: método encargado de configurar la store principal, este recibe como parámetro un objeto de configuración donde se asignan los reductores de cada Shelf para ser proveidos por la clase. En el ejemplo siguiente, vemos como se utiliza el método para configurar una store que distribuye un shelf de nombre ``userShelf``, con este fin recibe el objeto de configuración el cual posee un atributo ``reducers`` en el cual se asigna, a la propiedad con el nombre correspondiente de userShelf, la instancia de este Shelf, la creación de este último será tratada más adelante.

    ~~~typescript
    import { MyGlobalStore } from "@my_framework/store/myGlobalStore";
    import { userShef } from "./feature/user.ts";

    export const store = MyGlobalStore.configStore({
      reducers: {
        [userShef.name]: userShef.shelf,
      }
    });
    ~~~

    El paso inmediato a este debe ser establecer el store en el árbol de componentes, para ello recordamos un método mencionado anteriormente: ``setGlobalStorage``, este recibe como parámetro el store, de esta forma la entrada de la app se habrá actualizado de la forma siguiente:

    ~~~typescript
    import { MyDOM } from "@my_framework/core/myDOM";
    import { store } from "./context/store";
    import { AppModule } from "./app.module";
    
    MyDOM.setGlobalStore(store);
    const root = MyDOM.createRoot(document.getElementById('root'));

    root.render(AppModule);
    ~~~

  - __subscribe(shelfName, observer)__: método encargado de subscribir un nuevo componente a un shelf concreto del store, para ello recibe como parámetro el nombre del shelf y la instancia del componente (observer).
  - __unSubscribe(shelfName, observer)__: método encargado de des-subscribir un componente a un shelf concreto del store, para ello recibe como parámetro el nombre del shelf y la instancia del componente (observer).
  - __dispatch(shelfName, observer)__: método encargado de propagar el evento de actualización de estado a todos los componentes _observers_ que esten subscritos un ``shelf`` concreto en el store, para ello recibe como parámetro el nombre del shelf en cuestión. A diferencia de los anteriores métodos, este no está destinado a usarse durante el desarrollo, en cambio hace parte de la lógica interna del administrador de estado global del framework, por eso no tendremos que manipularle.

### __MyShelf__
clase encargada de organizar todo lo relacionado a un estado concreto del store, este es muy parecido a los slide de __Redux Toolkit__, a estas alturas queda claro que el presente proyecto (my framework ts) es mi cosecha de distintas tecnologías aprendidas durante mi tiempo de formación como analista y desarrollador de sistemas de información, y redux es una de ellas. 

Para configutar un shelf contamos con una función auxiliar, opté por este diseño porque no quería que este se convirtiera en una preocupación demaciado grande para la experiencia de desarrollo, realmente nunca estamos en contacto directo con la clase MyShelf, solo con su instancia, pero conviene conocerle:

#### __Accessors / Getters__
La clase MyShelf cuenta con __tres__ _accesors_ o _getters_ los cuales tenemos a disposición:

- __name__: consiste en el nombre del shelf, este que lo identifica y lo distinque de los demás, se espera que sea único.
- __actions__: consiste en un objeto que almacena las funciones dispatch encargadas de mutar el estado que almacena el shelf, es decir, los datos del store, estos está destinados a ser usados regularmente.
- __data__: consiste en los datos almacenados en el shelf, pueden ser cualquier cosa, un objeto o un dato primitivo, al final será indexado por el nombre del shelf.

#### __createShelf(config)__
Esta es la función auxiliar a través de la cual podremos crear un shelf, esta retorna un objeto una instancia de la clase MyShelf, el nombre y las actions. La mejor forma de detallarla es viéndola en acción.

Continuando con el ejemplo anterior de la configuración del __store__ con el método de la clase MyGLobalStore, ``configStore()``, donde se empleó un shelf de nombre __userShelf__, en este veremos como se creó:

~~~typescript
import { createShelf } from "@my_framework/store/myShelf";

type UserShelfT = Array<string>

export const userShef = createShelf<UserShelfT>({
  name: 'user',
  initialData: ['user1'],
  reducers: {
    setUser: (data, payload: string)=>{
      data.push(payload);
      return data;
    }
  }
});

export const { setUserDispatch } = userShef.actions;
~~~

En este ejemplo podemos apreciar le creación de un shelf partiendo de la función __createShelft__, esta recibe como parámetro un objeto de configuración, este objeto se corresponde con los accesors que tratamos previamente, el atributo ``name`` refiere al atributo name del _shelf_, el atributo ``initialData`` se coresponde con el valor que inicializa el atributo data del shelf, este es opcional, por último el atributo ``reducers`` consiste en un objeto que contiene cada _función reductora_, en este caso particular tenemos la función reductora: __setUser__, todas ellas reciben como parámetro la ``data`` del shelf y un valor ``payload``, es menester detenernos aquí y detallar un poco más este asunto:

- __data__: se corresponde con los datos almacenados en el shelf, este parámetro se prevee para poder modificarlo a nuestra conveniencia, es esencialmente un valor clonado de los datos almacenados, la idea general es tener un punto de partida para cualquier operación, debido a ello para consolidar la modificación debemos retonrarlo luego de mutarlo a conveniencia, de lo contraio no se reflejará el cambio.
- __payload__: este parámetro corresponde al nuevo valor proveniente de la función dispatch, se espera que sea el recurso necesario para la modifcación deseadada del shelf.
- __setUserDispatch()__:  podemos verla hasta el final del ejemplo, esta proviene del accesor __actions__, y su nombre es el mismo que la función reductora con la palabra ``Dispatch`` al final, cosa que la distingue de la función reductora. la nomenclatura se da dinámicamente, el nombre "setUser" es arbitrario facilmente pude elegir otro nombre y este le sería añadido la palabra Dispatch al final:
~~~typescript
  removeUser => removeUserDispatch
  editUser => editUserDispatch
~~~

Una vez aclarado estos puntos quiero recordar lo dicho previamente, este diseño está inspirado en __Redux Toolkit__, quiero mostrar un ejemplo en esta tecnología con el mismo store:

~~~Javascript
"use strict"
import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: ['user 1'],
  reducers: {
    setUser: (state, action)=>{
      state.user.push(action.payload);
    },
  }
});

export const { setUser } = userSlice.actions;
~~~

Es muy parecida la sintaxis, y de nuevo, elegí este diseño porque quise mantenerlo familiar. Aunque su forma de operar es muy distinta.


### __Subscripción de componente a estado global__
Para que un componente se subscriba al _estado global_, es decir, a un shelf concreto dentro del ``store`` primeramente debe implementar la interfaz __ObserverI__ la cual exije la tenencia de un método ``storeNotify()``:

~~~typescript
export interface ObserverI{
  storeNotify(charge?: StoreNotifyI): void
}
export type StoreNotifyI = {data: any, shelf: string}
~~~

Este método __storeNotify(charge)__ recibe por inyección un ``objeto`` con los datos actualizados del shelf al cual se encuentra subscrito, un mismo componente puede estar subscritpo __a más de un shelf__ y cualquier actualización del estado de los mismos será resibido por este método, por eso el objeto también contiene un atributo shelf, que indica el nombre del shelf que se encuetra notificando.

Al momento de subscribirse al store empleando el método __subscribe()__, se obtendrán los datos con la información contenida en el shelf al momento de la susbcripción.

La información obtenida ya sea por el método _subscribe_ o por _storeNotify_, son valores clonados del shelf, es decir, en ningún momento consituyen una referencia al valor almacenado en el shelf, esto es así para garantizar la consistencia de la información en cada observer.

Las funciónes ``Dispatch`` son o deben ser el único médio legítimo para mutar los datos alamacenados en un shelf, esto es así para garantizar la notificación oportuna de una actualización en los datos a todos los compoentes que se encuentren subscritos.

Una subscripción en un componente luce de la siguiente manera:

~~~typescript
import { MyComponent } from "@my_framework/component";
import { ObserverI, StoreNotifyI} from "@my_framework/store/types/myGlobalStore";
import { MyGlobalStore } from "@my_framework/store/myGlobalStore";
import { addCountDispatch } from "./context/shelfs/count";

@MyNode({selector: 'my-counter'}) 
/*implementamos la interfaz ObserverI*/
export class CounterComponent extends MyComponent implements ObserverI{
  /*
  subscribimos el componente recibiendo el valor del shelf 
  count al momento de la subscripción
  */
  count: number = MyGlobalStore.subscribe('count',this);

  /*
  declaramos el método storeNotify donde recibiremos el nuevo valor al ser notificado por actualización, decir, si se
  ejecuta alguna función dispatch. En consecuencia ejecutamos
  un refresh para reflejar el cambio de la vista
  */
  storeNotify(charge: StoreNotifyI): void{
    this.refresh(()=>{  
      this.count = charge.data;
    });
  }

  build(){
    return this.template((_)=>`
    <main>
      <h2>Mi Contador</h2>
      <p>${this.count}</p>
      ${/*ejecutamos el dispatch al dar click sobre el botón add*/}
      <button ${_.on('click', ()=>addCountDispatch(this.count + 1)))}>add</button>
    </main>
    `);
  }
}
~~~

En este sencillo ejemplo tenemos el mismo componente contador que se ilustró anteeriormente, pero en lugar de emplear un estado local, está empleando un estado global, __¿Cómo sería el comportamiento del componente en esta ocación comparado con el anterior?__, pues en esta nueva implementación el estado persisitiría en des-renderizados es decir, el componente podría ser des renderizado y al vovler a renderizarse el estado count seguiría en su valor sin reiniciarse.

### __Desubscripciones del estado global__

Es importante que desubscribamos componentes una vez que han sido desrenderizados, o cada vez que estos no requieran más el estado global al cual se encuentran subscritos. Cada subscripción realizada en un shelf implica espacio de memoria y recursos empleados en su tenencia, el store debe preocuparse que cada observador susbcrito reciba notificación durante actualización de sus datos, y reduciríamos sus preocupaciones desubscribiendo un observador al momento de no requerir tal relación, para ello podemos aprovechar el ciclo de vida del componente, como se mencionó con anterioridad, el método encargado de ejecutar lógica al des renderizar un componente es __destroy()__, es a través de este que ejecutaremos la dessubscripción:

~~~typescript
import { MyComponent } from "@my_framework/component";
import { ObserverI, StoreNotifyI} from "@my_framework/store/types/myGlobalStore";
import { MyGlobalStore } from "@my_framework/store/myGlobalStore";
import { addCountDispatch } from "./context/shelfs/count";

@MyNode({selector: 'my-counter'}) 
export class CounterComponent extends MyComponent implements ObserverI{
  count: number = MyGlobalStore.subscribe('count',this);

  storeNotify(charge: StoreNotifyI): void{
    this.refresh(()=>{  
      this.count = charge.data;
    });
  }

  build(){
    return this.template((_)=>`
    <main>
      <h2>Mi Contador</h2>
      <p>${this.count}</p>
      <button ${_.on('click', ()=>addCountDispatch(this.count + 1)))}>add</button>
    </main>
    `);
  }//end build

  destroy(): void{
    /*
    desubscribimos el componente del estado global "count"
    al momento de desrenderizar el componente observador
    */
    MyGlobalStore.unSubscribe('count',this);
  }
}
~~~

<hr>

## __MyRouter__
Una vez que hemos conocido la forma de renderizar el componente raíz, a través del método render provisto por el método ``createRoot()`` de la clase __MyDOM__ tenemos como alternativa usar el ``enrutador`` de __my framework ts__, este es una entidad única que tiene la capacidad de definir páginas con sus respectivas rutas y estados propios en el historial del navegador.

### __Atributos__:
La clase MyRouter cuenta con __dos 2__ atributos públicos que, realmente no están destinados a ser usados regularmente, sin embargo conviene conconerlos:

- __currentPage__: refiere al Modulo que se encuentra renderizado, a fin de cuentas es quien cumple el rol de página en la app.
- __routes__: consiste en un arreglo de objetos cada uno correspondiente a las rutas con los Modulos que están dispuestos a participar del enrutamiento.

### __Métodos__
La clase MyRouter además del constructor cuenta con __cuatro__ métodos públicos, todos estáticos y destinados a uso regular.

### __Constructor__
El método constructor debe recibir un objeto de configuración en el cual se definan las _rutas_ y la pestaña _notFound_. Efectivamente este debe inicializarse en la entrada de la app, de esta forma tenemos una nueva actualización al fichero ``main.ts``:
~~~typescript
//src/main.ts
import { MyDOM } from "@my_framework/core/myDOM";
import { MyRouter } from "./lib/my_framework/router/myRouter";
import { ROUTES } from "./pages/routes";

MyDOM.setGlobalStore(store);
const root = MyDOM.createRoot(document.getElementById('root'));

//declaración de router - start
const router = new MyRouter({
  routes: ROUTES, 
  notFound: NotFound
});
//declaración de router - end

///pages/routes.ts
import { Counter } from "./counterModule";
import { NotFoundModule } from "./notFoundModule";
import { ResultModule } from "./resultModule";

export const ROUTES = [
  {path:"/", modulePage: CounterModule},
  {path: "/otra", modulePage: NotFoundModule},
  {path: "/resultado/:result", modulePage: ResultModule},
];
~~~

en este ejemplo vemos la declaración del enrutador, este consiste en inyectar un objeto de configuración con dos atributos:
- __routes__: consiste en un arreglo de objetos cual contiene las rutas en el atributo ``path`` y el módulo correspondiente a la pagina en el atributo ``modulePage``, algo de suma importancia es que la tercera ruta contiene un _param_, este se declara ubicando dos puntos (:) y su respectivo nombre, en este caso particular tenemos el ``param result``, es a través de este que podremos enviar datos desde una página a otra.
- __notFound__: este atributo es simplemente un Modulo que tiene la tarea de mostrar una vista que indique el clásico error __not found 404__, en caso de no indicar niguno my framework ts asignará uno por defecto.

>``Importante:`` Esta inicialización es de suma importancia porque es desde aquí que empezarán los renderizados de nuestras páginas, como se puede apreciar el método render() no aparece por ninguna parte, y eso se debe a que la entidad MyRouter se encarga de ello internamente, de allí que sea importante una correcta declaración de las rutas y Modulos.

### __De uso regular__
Estos son métodos que tienen tareas específicas, pero fundamentales en el enrutamiento:

- __go(path, discreet)__: método encargado de navegar a la ruta que se le administre mediante el parámetro ``path``. Debe asegurarse que la ruta exista caso contrario deberá asociar una pestaña __notFound__, el parametro discreet es opcional y refiere a datos que serán enviados discretamnente entre páginas, estos son almacenados en el estado del historial.
- __redirect(path, discreet)__: este método cumple con las mismas funciones que el método ``go()``, pero en lugar de añadir un nuevo registro al historial, este reemplaza el registro actual con el de la ruta que se especifique en el parámetro ``path``.
- __next()__: método específico para navegar hacia adelante en el historial siempre que haya un registro ``forward``, es decir, que se haya navegado regresivamente desde a otra página con anterioridad.
- __back()__: método específico para navegar hacia atrás en el historial siempre que haya un registro ``back``, es decir, que se haya navegado a una nueva ventana dejando atrás una ruta previa.
- __paramSlug()__: método especial que obtiene los valores params que hayan sido declarados en la ruta y estén contenidos en la _url_, es decir, params para rutas dinámicas.
- __queryParams()__: este método obtiene los query params que estén contenidos en la url, retorna un objeto manteniendo la _key_ y el _value_ según corresponda.
- __discreetData()__: este método obtiene los datos discretos que estén contenidos en estado del historial, estos datos son alojados mediante el segundo parámetro del método ``go`` o en suh defecto ``redirect``.

### __Params__
La comunicación entre una página es una de los grandes cambios que trae __my framework ts__, en comparación con su antecesor my framework, en esta implementación tenemos cubiertas las rutas dinámicas, es decir, params en la url (slugs), query params y conservamos el medio discreto, en otras palabras contamos con tres formas distintas de comunicar información entre páginas. La declaración de las rutas es relevante para estas cuestiones:.

#### __Declaración de rutas__
 previamente mencionamos la sintaxis de declaración. En caso de desear una ruta sin params podemos escribirla directamente, importante que las barras inclinadas estén al principio del nombre de la ruta y del param, caso contrario obtendremos comportamientos inesperados:
~~~typescript
 "/about" 
 "/about/ticked" 
~~~

En otro caso donde precisemos comunicar un dato de una página a otra como puede ser el típico paso de un ``id`` de _producto_ o de _cliente_, declaramos el nombre del param antecedido por una barra inclinada y dos puntos "__/:__"
~~~typescript
 "/product/:id"
 "/client/:id"
~~~
Realizada esta declaración ahora si podemos navegar entre rutas y de ser necesario, enviar y manipular datos a través de params.

#### __Navegación a ruta__
Para navegar hasta una ruta específica utilizamos el método __go(path, discreet)__, este recibe un string correspondiente a la ruta deseada:
~~~typescript
MyRouter.go('/about');
MyRouter.go('/about/ticked');
~~~
importante que la barra inclinada "/" esté presente siempre, caso contrario obtendremos comportamientos inesperados.

#### __Navegación a ruta con params__
En caso de que necesitemos comunicar un dato mediante un param, simplemente lo interpolamos en la ruta, y el lugar donde se declaro el param es reemplazado por el valor que se desea comunicar :

~~~typescript
const clientId = 10002392;

MyRouter.go('/product/1001');
MyRouter.go(`/client/${clientId}`);
~~~
Estos params pueden ser más de uno sin mayor problema, por ejemplo:
~~~Javascript
//routes
const ROUTES = [
  {path: "/product/:code/:price", modulePage: ProductModule}
  ]

// navigation
const productCode = 72304923;
const productPrice = 2000;

MyRouter.go(`/product/${productCode}/${productPrice}`);
MyRouter.go('/ticket',productCode);
~~~
Recordar siempre que deben estar precedidos por una barra inclinada "__/__". Adicional tenemos unanavegación con datos discretos a la ruta "/ticket"

#### __Obtención de datos params del lado de la página destino__
Para la obtención de los params en el cuerpo de la página, el cual no es más que el módulo decalrado en ruta, damos uso del método __paramSlug()__, siguiendo con el ejemplo anterior donde navegamos a una página con nombre de ruta ``"product/:code/:price"``, la forma de obtener los datos es la siguiente:

~~~typescript
//url = http://host/product/12/1200

import { MyComponent } from "@my_framework/core/myComponent";
import { MyNode } from "@my_framework/decorators/myNode";
import { MyRouter } from "@my_framework/router/myRouter";

@MyNode({selector: 'my-product'})
export class ProductComponent extends MyComponent{

  code: string =  MyRouter.paramSLug().code;
  price: string =  MyRouter.paramSLug().price;

  build(): void{
    return this.template((_)=>`
    <main>
      <h2>Producto</h2>
      <p>Producto con el código: ${this.code}</p>
      <p>Precio del producto: ${this.price}</p>
      <button ${_.on('click', ()=>{MyRouter.back()})}>Volver</button>
    </main>
    `);
  }
}
~~~

Contamos con un componente __ProductComponent__ que invoca al método __MyRouter.paramSlug()__ al momento de incializar sus propiedades ``code`` y ``price``, el método retorna un objeto, los nombres que declaramos para los params en las rutas serán los que tendrán los atributos de dicho objeto; de la misma forma podemos obtener los query params y los datos discretos, solo varía el método empleado.

<hr>


## __Instalación y ejecución__
Como mencioné al inicio del presente documento, tenemos com odependencia la herramienta __Vite__ y __Typescript__, para su instalación utilicé del manejador de paquetes de node __pnpm__ por ello los comandos que recomiendo para instalar las dependencias implican su uso, sin embargo, tanto __npm__ como __pnpm__ comparten repositorio de módulos de node, por ello puede usar el manejador de paquetes de su preferencia, pero como dije, mi recomendación es __pnpm__:

- para instalación de dependencias:
~~~bash
pnpm install
~~~
- para ejecución del servidor de desarrollo
~~~bash
pnpm dev
~~~
- para construcción de versión de producción
~~~bash
pnpm build
~~~

__Y como alternativa puede usar NPM:__
- para instalación de dependencias:
~~~bash
npm install
~~~
- para ejecución del servidor de desarrollo
~~~bash
npm run dev
~~~
- para construcción de versión de producción
~~~bash
npm run build
~~~

<hr>

## __Conclusiones__
Partiendo de un __8 de mayo de 2023__ hasta finalizar todos los objetivos propuestos el __#######__ del mismo año, fueron #### de aprendizaje continuo. 

Pude familiarizarme mucho más con este lenguaje (_Typescript_) y sus beneficios potenciales, además de poner en práctica bastante lógica y patrones de diseño:

- Patrón __observer__
- Patrón __singleton__
- Patrón __decorator__
- Inyección de dependencias
- Programación orientada a objetos
  - Herencia
  - Polimorfismo
  - Encapsulamiento
- Estructuras de datos
- Maquetación por componentes
- Modularización

Finalmente, lo que espero con este ejercicio es poder dar cuenta de cómo mi trayectoria con diversas tecnologías me ha aportado __técnicas__ y __enfoques__ útiles para un uso más provechoso de estas herramientas, y de la misma forma recibir nuevos aportes para un mejor desempeño en el desarrollo web __front-end__. Ahora ¡a seguir aprendiendo!

__¿Cuál será el siguiente paso?__ :)