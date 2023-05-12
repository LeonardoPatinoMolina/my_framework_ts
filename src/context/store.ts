import { MyGlobalStore } from "@my_framework/myGlobalStore.ts";
import { userShef } from "./feature/user.ts";

export const store = MyGlobalStore.configStore({
  reducers: {
    [userShef.name]: userShef.shelf
  }
});