import { MyComponent } from "@my_framework/core/myComponent";
import { MyNode } from "../../decorators/myNode";
import { MyRouter } from "../../router/myRouter";

@MyNode({selector: 'not-found', styles: (`
  .not-found-template-00{
    background-color: #222;
    width: 100%;
    height: 100vh;
    color: #f1f2f3;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .not-found-template-00__btn:hover{
    background-color: #aaa;
  }
  .not-found-template-00__btn{
    font-family: Century Gothic, system-ui, Avenir, Helvetica, Arial, sans-serif;
    margin-top: 1rem; 
    border-radius: 1rem;
    padding: 1rem;
    font-size: 1rem;
  }
  
  .not-found-template-00__card{
    font-family: Century Gothic, system-ui, Avenir, Helvetica, Arial, sans-serif;
    border-radius: 1rem;
    padding: 1rem;
    outline: 2px solid #f1f2f3;
  }
  .not-found-template-00__card__title{
    font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;;
    text-align: center;
    color: #f1f2f3;
    font-weight: bold;
  }
  .not-found-template-00__card__paragraph{
    background-color: green;
  }
`)})
export class _404Component extends MyComponent{
  build(): string {
    return this.template((_)=>`
      <main class="not-found-template-00">
        <div class="not-found-template-00__card">
          <h1 class="not-found-template-00__card__title"> 404</h1>
          <p class="not-found-template-00__card__paragrah">Page not found</p>
        </div>
        <button class="not-found-template-00__btn ${_.on('click',()=>MyRouter.go('/'))}>Come back to home</button>
      </main>
    `);
  }
}