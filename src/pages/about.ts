import { MyComponent } from "@my_framework/core/myComponent";
import { MyNode } from "@my_framework/decorators/myNode";
import { PruevaComponent } from "../components/prueva";

@MyNode({
  selector: 'my-about',
  children: [PruevaComponent]
})
export class AboutComponent extends MyComponent{
  build(): string {
    return this.template((_)=>`
      <div>
        joder claro que si esto es el about
        ${_.child['my-prueva']({props: {sabor: 'jodeeeeeer'}})}
      <div>    
    `);
  }  
}