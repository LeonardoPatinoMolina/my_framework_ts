import { MyComponent } from "@my_framework/myComponent"

export interface MyNodeI{
  key: string,
  instance: MyComponent
  children: Set<string>,
  parentKey: string
}