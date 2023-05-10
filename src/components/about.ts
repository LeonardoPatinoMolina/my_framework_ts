import { MyNode } from "@my_framework/decorators";
import { MyComponent } from "@my_framework/myComponent";
import { PruevaComponent } from "./prueva";

@MyNode({
  selector: 'my-about',
  children: [PruevaComponent]
})
export class AboutComponent extends MyComponent{
  build(): string {
    return super.template((_)=>`
      <div>
        joder claro que si esto es el about
        ${_.child['my-prueva']()}
      <div>    
    `);
  }  
}