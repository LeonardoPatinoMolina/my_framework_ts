import { MyComponent } from "@my_framework/core/myComponent";
import { MyNode } from "@my_framework/decorators/myNode";
import { MyRouter } from "../../lib/my_framework/router/myRouter";

@MyNode({selector: 'my-counter',styles: (`
  .holis{
    color: green;
    font-weight: bold;
  }
`)})
export class CounterComponent extends MyComponent {
  
  modalIsHidden: boolean = true;
  count: number = 0;
  
  closeModal = ()=>{
    this.refresh(()=>{
      this.modalIsHidden = true;
    }); 
  };
  
  openModal = ()=>{
    this.refresh(()=>{
      this.modalIsHidden = false;
    });
  }

  addCount = ()=>{
    this.refresh(()=>{
      this.count++;
    })
  }
  decrementCount = ()=>{
    this.refresh(()=>{
      this.count--;
    })
  }

  build(): string {
  return super.template((_)=>`
    <main id="con" class="container" >
      ${_.child('my-modal')({props: this.closeModal, hidden: this.modalIsHidden})}
      <button title="Detalles" class="btn_open-modal" ${_.on('click',this.openModal)}>!</button>
      <h1 class="titulo">Mi Contador</h2>
      <p align="center">
      <img 
        class="image" 
        width="auto" 
        height="200px" 
        src="https://i.postimg.cc/RhrgmkP4/logo-myframework-ts-big.png" 
        alt="my framework logo" 
        title="my framework logo"
        draggable="false"
      >
      </p>
      <p class="number">${this.count} <span>+ 10</span></p>
      <div class="btn_area">
        <button
          class="btn_neumorfus" 
          style="margin-bottom: 1rem;" 
          ${_.on('click', this.addCount)}
        >Aumentar</button>
        <button
          class="btn_neumorfus" 
          style="margin-bottom: 1rem;" 
          ${_.on('click', this.decrementCount)}
        >Disminuir</button>
      </div>
      <button 
        class="btn_neumorfus" 
        ${_.on('click', ()=>{MyRouter.go(`/result/${this.count + 10}`)})}
      >Ver resultado</button>
    </main>
    `);
  }
}










