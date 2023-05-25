import { MyComponent } from "./myComponent.ts";
import { InputControllerI } from "./types/inputController.types.ts";



export class InputController {
  /** componente propieatario del presente controlador
   */
  private owner: MyComponent;
  
  /** Variable auxiliar para evitar sobrecarga de controladores
   * y llevar el conteo de las keys
   */
  counterKeyController: number = 0;
  
  private abortControllers: Map<string, AbortController> = new Map();


  private inputcontrollers: Map<string, InputControllerI> = new Map();

  constructor(owner: MyComponent){
    this.owner = owner;
  }

  /** Se eccarga de administrar los selectores necesarios para
   * añadir los escucha de eventos en linea
   */
  onInputController(modelName: string, fieldName: string, callback?: (value: string)=>string): string {
    const keycontroller = `${this.owner.key}-controller-${this.counterKeyController}`;

    if(!this.owner.isInitialized){
      let value: string = '';
      if(this.owner?.inputModel){
        if(this.owner.inputModel[modelName]){
          value = this.owner?.inputModel[modelName][fieldName]
        }
      }

      this.inputcontrollers.set(keycontroller, {
        callback,
        state: {
          fieldName,
          modelName,
          value,
          isFocus: false
        },
        targetKey: keycontroller
      });
    }
    this.counterKeyController += 1;

    return ` data-controller="input" data-keycontroller="${keycontroller}" `
  }//end onInputController

    /**
  */  
  addInputController(){
    this.inputcontrollers.forEach((controller)=>{
      const abortC = new AbortController();
      this.abortControllers.set(controller.targetKey, abortC);
      
      let target: HTMLInputElement;
      target = document.querySelector(`[data-keycontroller="${controller.targetKey}"]`)!;

      if(controller.state.isFocus) target.focus();
      else target.blur();
      
      target.value = controller.state.value;
      
      target.addEventListener('input',()=>{
      //en caso de existir un callback de constrol, lo ejecutamos
        const newValue = controller.callback ? controller.callback(target.value) : undefined;
        const curValue = newValue ?? target.value;

        controller.state = {
          ...controller.state,
          value: curValue,
          isFocus: true
        };
        
        target.value = curValue;
        if(!this.owner?.inputModel) throw new Error('No ha declarado aún un input model para el controlador con el modelo '+controller.state.modelName)
        this.owner.inputModel = {
          ...this.owner.inputModel,
          [controller.state.modelName]: {
            ...this.owner!.inputModel[controller.state.modelName],
            [controller.state.fieldName]: curValue
          }
        };
      },{signal: abortC.signal});// end keyup eventlistener

      target.addEventListener('focus',()=>{
        controller.state = {
          ...controller.state,
          value: target.value,
          isFocus: true
        };
      },{signal: abortC.signal});// end click eventlistener
      
      target.addEventListener('blur',()=>{
        controller.state = {
          ...controller.state,
          value: target.value,
          isFocus: false
        };
      },{signal: abortC.signal});// end click eventlistener
    })
  }//end addController

  removeInputController(){
    this.inputcontrollers.forEach((controller)=>{
      this.abortControllers.get(controller.targetKey)?.abort();
    });
    this.counterKeyController = 0;
  }//end removeController
}