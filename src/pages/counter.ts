import { MyComponent } from "@my_framework/core/myComponent";
import { MyNode } from "@my_framework/decorators/myNode";
import { MyRouter } from "@my_framework/router/myRouter";
import { UserComponent } from "../components/user";
import { HttpService } from "../services/http";


@MyNode({
  selector: 'my-counter',
  children: [UserComponent],
  services: [HttpService]
})
export class CounterComponent extends MyComponent {
  
  numero = 0;
  numero2 = 0;

  http: HttpService;

  results: any[] = [];

  constructor(svc: any){
    super()
    this.http = svc.http;
  }

  ready(): void {
    console.log(1);
    this.$.effect(()=>{
      console.log(0);
      
      this.http.get().then((res)=>{
        this.refresh(()=>{
          this.results = res;
        })
      })
    },[])
  }
  

  increment = () =>{
    this.refresh(()=>{
      this.numero += 1
      this.numero2 += 1
    })
  }

  decrement = () =>{
    this.refresh(()=>{
      this.numero -= 1
    })
  }

  build(): string {
  const buildRes = this.results.map((res)=>({
    key: `jsonr_${res.id}`,
    props: {
      name: res.name
    }
  }))
  return this.template((_)=> `
    <div>
      counter works! hola mindo
      <div id="ol">
        ${this.numero}
        <br>
      </div>
      <button ${_.on('click',this.increment)}>add</button>
      <button ${_.on('click',this.decrement)}>Sub</button>
      <br>
      <button ${_.on('click',()=>{MyRouter.go('/about')})}>navigate to about</button>
      <section>
        ${_.children['my-user'](buildRes)}
      </section>
      </div>`
    );
  }
}