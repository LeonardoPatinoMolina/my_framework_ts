export interface ConfigEventI {
  capture?: boolean, 
  passive?: boolean, 
  once?: boolean
}

export interface EventHandlerI {
  keyEvent: string, 
  name: string, 
  callback: (e: any)=>void, 
  config?: ConfigEventI
}