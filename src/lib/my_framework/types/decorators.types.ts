import { MyComponent } from "@my_framework/myComponent";

export interface DataBuilderI {
  key: string,
  agrs?: {
    props?: any
  }
}
export interface ChildI {
  component: typeof MyComponent,
  attachMany?: boolean,
  dataBuilder?: DataBuilderI[]
}
export interface FamilyArgsI{
  selector: string;
  children?: Array<typeof MyComponent>,
}

export interface ChildrenAttachingI{
  child: {[x: string]:(args?: ArgsAttachI)=>string}
  children: {[x: string]: (dataBuilder: DataBuilderT)=>string}
}
export interface ArgsAttachI{
  key?: string,
  props?: {[x:string]: any}
}
export type DataBuilderT = Array<{key: string, props?: any}>

