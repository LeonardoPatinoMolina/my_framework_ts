import { MyComponent } from "./myComponent.ts";
import { DependecyT, DisposeEventT, EffectI } from "./types/lifeComponent.types.ts";



export class LifeComponent {

  /** Componente poseedor de la instancia Life
   * al cual se realiza el seguimiento de su 
   * ciclo de vida
   */
  private owner: MyComponent;

  private isInitialized = false;

  private effects: Array<EffectI> = [];

  constructor(owner: MyComponent){
    this.owner = owner;
  }

  effect(callback: ()=>DisposeEventT|void, dependency: DependecyT){
    if(this.owner.isFirstMount){

      const newValue: EffectI = {
        update: callback,
        dispose: undefined,
        dependency: dependency ? dependency : undefined,
        oldDependency: dependency ? JSON.stringify(dependency) : '[]'
      }
      const compare = this.effects.some((eff)=>{
        return JSON.stringify(eff.dependency) === JSON.stringify(dependency)
      });

      if(compare){
        throw new Error(`$.effect redundante: Está utilizando un effect() en el componente ${this.owner.key} con una configuración de dependencias que ya existe en otra implementación, utilice el effect que ya posee esta implementación en su lugar`)
      };
        this.effects.push(newValue);
    }//end if


    if(this.isInitialized) this.updateEffect(dependency);
    return this;
  }//end $

  private updateEffect(dependency: DependecyT){
    this.effects.forEach((eff)=>{
      if (!this.checkChange(eff?.dependency, dependency)) return;
      eff?.dispose && eff?.dispose();
      eff.update();
      eff.dependency = dependency;
    })//end foreach
  }//end update
  /**
   */
  update(){
    this.effects.forEach((eff)=>{
      eff.update();
    })//end foreach
  }//end update
  /**
   * encargada de disparar eventos de desmontura
   */
  dispose(){
    this.effects.forEach(eff=>{
      if(eff?.dispose){
        eff.dispose();
      }
    })
  }//end dispose

  /** Encargada de evaluar si las dependencias del
   * presente evento de actualización han mutado
   */
  private checkChange(oldDependency: DependecyT, dependency: DependecyT): boolean{
    if (dependency === undefined) return true;
    if (dependency.length === 0) return false;

    return JSON.stringify(dependency) !== JSON.stringify(oldDependency)
  }

  /**
   * Encargado de disparar los eventos de actualización al menos una vez
   */
  initialize(){
    this.effects.forEach((eff)=>{
      const d = eff.update();
      if(!!d){
        eff.dispose = d;
      }
    })//end foreach
    this.isInitialized = true;
  }
}//end class