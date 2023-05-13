import { MyComponent } from "./myComponent.ts";
import { ConfigEventI, EventHandlerI } from "./types/eventController.types.ts";

/**
 * @class EventController
 * @classdesc clase encargada de manejar los manejadores de eventos de los eventos de asignaci´no
 * en línea del componente owner
 */
export class EventController{

  private owner: MyComponent;

  private counterKeyEvent = 0;

  private abortControllers: Map<string, AbortController> = new Map();

  private eventHandlers: Map<string, EventHandlerI> = new Map();

  constructor(owner: MyComponent){
    this.owner = owner;
  }

  /**
   * Método encargado de reclarar todos los handlers de 
   * los eventos declarados en línea
   * y retornar los atributps de selección
   */
  onEvent(name: string, callback: any, config?: ConfigEventI){
    const keyEvent = `${this.owner.key}-event-${this.counterKeyEvent}`
    this.eventHandlers.set(keyEvent,{
      keyEvent, name, callback, config
    });
    this.counterKeyEvent += 1;
    
    return ` data-event="${name}" data-keyevent="${keyEvent}" `
  }//end onEvent

  /**
   * Método encargado de añadirlos handlers a los evensListeners
   * previamente decalrados
   */
  addEvents(): void{
    this.eventHandlers.forEach((e)=>{
      const abortC = new AbortController();
      this.abortControllers.set(e.keyEvent, abortC);
      /**
      verificamos si el nodo principal del componente owner, es el objetivo
      esto asegura que ubiquemos el nodo que require el evento de forma adecuada
       */
      let target: Element;
      target = this.owner.body.querySelector(`[data-keyevent="${e.keyEvent}"]`);
      if(target === null && this.owner.body.getAttribute("data-keyevent") === e.keyEvent){
        target = this.owner.body
      }
      target.addEventListener(e.name,(evnt)=>{
        e.callback(evnt);
      },{...e.config, signal: abortC.signal});//end addEvnetListener
    })//end foreach
  }//end addEvents<button data-event="click" data-keyevent="comp-0-key-event-4">Toggle</button>

  /**
   * Método encargado de remover los eventsListeners
   *  previamente añadidos
   */
  removeEvents(): void{
    this.eventHandlers.forEach((e)=>{
      this.abortControllers.get(e.keyEvent)?.abort();
    })//end foreach
    this.counterKeyEvent = 0;
  }//end removeEvents
}