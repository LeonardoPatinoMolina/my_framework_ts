import { createShelf } from "@my_framework/store/myShelf";

export const numeroShelf = createShelf<number>({
  name: 'numero',
   initialData: 0,
   reducers: {
    setNumero: (data: number, payload: any)=>{
      data = payload;
      return data;
    }
   }
});

export const { setNumeroDispatch } = numeroShelf.actions;