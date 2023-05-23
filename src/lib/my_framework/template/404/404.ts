import { MyComponent } from "@my_framework/core/myComponent";
import { MyNode } from "../../decorators/myNode";

@MyNode({selector: 'not-found', styles: (`
  .not-found-template-00{
    background-color: red;
  }
  .not-found-template-00__title{
    background-color: blue;
  }
  .not-found-template-00__paragraph{
    background-color: green;
  }
`)})
export class _404Component extends MyComponent{
  build(): string {
    return this.template(()=>`
      <main class="not-found-template-00">
        <h1 class="not-found-template-00__title"> 404</h1>
        <p class="not-found-template-00__paragrah">Page not found</p>
      </main>
    `);
  }
}