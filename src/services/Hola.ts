import { MyInjectable } from "@my_framework/decorators/myInjectable";

@MyInjectable({serviceName: 'saludo'})
export class HolaService {
  private hola = 'saludo'

  cambiarSaludo(nuevoSaludo: string){
    this.hola = nuevoSaludo;
  }
  saludar(){
    console.log(this.hola);
  }
}