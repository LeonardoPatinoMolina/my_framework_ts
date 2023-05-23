import { MyComponent } from "@my_framework/core/myComponent";
import { MyNode } from "../../lib/my_framework/decorators/myNode";

@MyNode({selector: 'not-found'})
export class _404Component extends MyComponent{
  build(): string {
    return this.template(()=>`
      <main>
        <h1>404</h1>
        <p>Page not found</p>
      </main>
    `);
  }
}