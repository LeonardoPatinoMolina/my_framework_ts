import { ArgsAttachI, DataBuilderT } from "./decorators.types"
import { ConfigEventI } from "./eventController.types"

export interface DirectiveTemplateI {
  on: (name: keyof HTMLElementEventMap, callback: (e: any)=>void, options?: ConfigEventI)=>string, 
  inputController: (modelName: string, name: string, callback?: (string: string)=>string)=>string,
  myIf: (predicate: boolean)=>string,
  child: {[x: string]: (args?: ArgsAttachI)=>string}
  children: {[x: string]: (dataBuilder: DataBuilderT)=>string}
}

export interface BuildArgsI{
  children?: Array<()=>string>,
  props?: any
}