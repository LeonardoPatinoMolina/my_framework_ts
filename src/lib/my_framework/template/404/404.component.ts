import { MyComponent } from "@my_framework/core/myComponent";
import { MyNode } from "../../decorators/myNode";

@MyNode({selector: 'not-found'})
export class _404Component extends MyComponent{

  init(){
    const st = document.createElement('style');
    st.innerHTML = `
      .not-found-template-00{
        background-color: red;
      }
      .not-found-template-00__title{
        background-color: blue;
      }
      .not-found-template-00__paragraph{
        background-color: green;
      }
    `;
    st.id = `not-fount-style-template-css-default`
    document.head.appendChild(st)
  }
  
  destroy(): void {
    const target = document.getElementById('not-fount-style-template-css-default');
    if(target) document.removeChild(target)
  }

  build(): string {
    return this.template(()=>`
      <main class="not-found-template-00">
        <h1 class="not-found-template-00__title"> 404</h1>
        <p class="not-found-template-00__paragrah">Page not found</p>
      </main>
    `);
  }
}