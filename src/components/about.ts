import { MyNode } from "@my_framework/decorators";
import { MyComponent } from "@my_framework/myComponent";

@MyNode({
  selector: 'about',
})
export class About extends MyComponent{
  build(): string {
    return super.template(()=>`
      <div>
        joder claro que si esto es el about
      <div>    
    `);
  }  
}