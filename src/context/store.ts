import { MyGlobalStore } from "@my_framework/store/myGlobalStore.ts";
import { userShef } from "./feature/user.ts";

export const store = MyGlobalStore.configStore({
  reducers: {
    [userShef.name]: userShef.shelf
  }
});