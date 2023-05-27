import { MyComponent } from "../../lib/my_framework/core/myComponent.js";
import { MyNode } from "../../lib/my_framework/decorators/myNode.js";
import { MyRouter } from "../../lib/my_framework/router/myRouter.js";

interface ParamsResultI{
  result: number,
  base: number
}

@MyNode({selector: 'my-result'})
export class ResultComponent extends MyComponent{

  params = MyRouter.paramSlug();

  build(): string{
    
    return super.template((_)=>`
    <main>
      <h1>Mi Resultado</h1>
      <p class="number">${this.params?.result}</p>
      <p align="center">
        <img 
          draggable="false" 
          class="image_2" 
          src="https://i.postimg.cc/RhrgmkP4/logo-myframework-ts-big.png" 
          width="auto" 
          height="200px" 
          alt="my framework logo" 
          title="my framework logo"
        >
      </p>
      <p class="info">todo lo que debes saber en este <a href="https://github.com/LeonardoPatinoMolina/my-framework" target="_blank">enlace</a></p>
      <button class="btn_neumorfus" ${_.on('click', ()=>{MyRouter.back()})}>Volver</button>
    </main>
    `);
  }
}