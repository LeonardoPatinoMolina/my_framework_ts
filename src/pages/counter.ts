import { MyComponent } from "@my_framework/core/myComponent";
import { MyNode } from "@my_framework/decorators/myNode";
import { MyRouter } from "@my_framework/router/myRouter";
import { MyGlobalStore } from "@my_framework/store/myGlobalStore";
import { ObserverI, StoreNotifyI } from "@my_framework/store/types/myGlobalStore.types";
import { PruevaComponent } from "../components/prueva";
import { UserComponent } from "../components/user";
import { setUserDispatch } from "../context/feature/user";
import { HttpService } from "../services/http";


@MyNode({
  selector: 'my-counter',
  children: [UserComponent, PruevaComponent],
  services: [HttpService]
})
export class CounterComponent extends MyComponent implements ObserverI {
  
  numero: number = 0
  users: Array<string> = MyGlobalStore.subscribe('user',this)

  storeNotify(charge?: StoreNotifyI): void {
    this.refresh(()=>{
      this.users = charge?.data;
    })
  }

  increment = () =>{
    this.refresh(()=>{
      this.numero++;
    })
  }
  
  decrement = () =>{
    this.refresh(()=>{
      this.numero--;
    })
  }

  addUser = () => {
    setUserDispatch('otros');
  }

  destroy(): void {
    MyGlobalStore.unSubscribe('user',this);
  }
  
  build(): string {

  return this.template((_)=> `
    <div>
      counter works! hola mindo
      <div id="ol">
        ${this.numero}
        <br>
        ${this.users}
      </div>
      <button ${_.on('click',this.increment)}>add</button>
      <button ${_.on('click',this.decrement)}>Sub</button>
      <br>
      <button ${_.on('click',this.addUser)}>user add</button>
      <br>
      <button ${_.on('click',()=>{MyRouter.go('/about')})}>navigate to about</button>
      <section>
      lorem
      </section>
      </div>`
    );
  }
}