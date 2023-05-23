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
    return super.template((_)=>`
    <main>
      <h2>Mi Contador</h2>
      <p>${this.count}</p>
      <button ${_.on('click', this.addCount)}>add</button>
    </main>
    `);
  }
}
~~~
Inmediatamente se puede apreciar que se trata de un __componente de clase__, efectivamente my framework ts tiene como base componentes de clase, tal y como lo era mi anterior ejercicio: [My framework](https://github.com/LeonardoPatinoMolina/my-framework), pero este es posee ciertas novedades.
 
 El componente __CounterComponent__ está heredando de la clase __MyComponent__, de l acual obtiene todos los métodos propios de un componente reactivo, pero advertimos una diferencia respecto a my framework: adicionalmente la clase está siendo decorada con el decorador de fabrica __@MyNode()__ este recibe obligatoriamente un objeto como parámetro con el atributo __selector__.

En este caso tenemos un clásico contador, gracias a este ejemplo tan típico tengo espacio para exponer rápidamente la existencia del método refresh, este es el método utilizado por el componente para sus re-renderizados.

Documentación en proceso...