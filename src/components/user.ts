import { MyComponent } from "@my_framework/core/myComponent";
import { MyNode } from "@my_framework/decorators/myNode";

@MyNode({selector: 'my-user'})
export class UserComponent extends MyComponent{
  build(): string {
    return this.template(()=>`
      <article>
        <h2>${this.props?.name}</h2>
      <article>
    `);
  }
}