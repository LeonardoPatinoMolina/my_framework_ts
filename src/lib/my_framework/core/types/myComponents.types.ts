import { ArgsAttachI, DataBuilderT } from "../../decorators/types/myNode.types"
import { ConfigEventI } from "./eventController.types"

export interface DirectiveTemplateI {
  on: (name: keyof HTMLElementEventMap, callback: (e: any)=>void, options?: ConfigEventI)=>string, 
  inputController: (modelName: string, name: string, callback?: (string: string)=>string)=>string,
  myIf: (predicate: boolean)=>string,
  child: (key: string)=>(args?: ArgsAttachI)=>string
  children: (key: string)=> (dataBuilder: DataBuilderT)=>string,
  myMul: (amount: number)=> string
}
//
export interface BuildArgsI{
  children?: Array<()=>string>,
  props?: any
}


export interface MyTreeI{
  name: string,
  node: Element | Text
  attr: NamedNodeMap,
  children: Array<MyTreeI>,
  forward?: Element | Text,
  backyard?: Element | Text,
  token?: string
}

