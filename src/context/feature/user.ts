import { createShelf } from "@my_framework/store/myShelf";

type UserShelfT = Array<string>

export const userShef = createShelf<UserShelfT>({
  name: 'user',
  initialData: [],
  reducers: {
    setUser: (data, payload: string)=>{
      data.push(payload);
      return data;
    }
  }
});

export const { setUserDispatch } = userShef.actions;