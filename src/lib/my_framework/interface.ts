import { EventController } from "./eventController";
import { InputController } from "./inputController";
import { LifeComponent } from "./lifeComponent";
import { MyTemplateEngine } from "./myTemplateEngine";
import { DirectiveTemplateI } from "./mycomponent";

export interface MyC{
  props: any;
  state: any;
  $: LifeComponent;
  body: any;
  parent?: MyC | undefined;
  childrenAttaching: any;

  _initialized: boolean;
  _rendered: boolean;
  _key: string;
  _previusState: any;
  _globalStore: any;
  _firstMount: boolean;
  _eventController: EventController;
  _inputController: InputController;

  _engineTemplate: MyTemplateEngine;
  get key(): string 
  get isInitialized(): boolean
  get isRendered(): boolean
  get globalStore(): any
  set globalStore(shelf: any)
  get isFirstMount(): boolean 
  setKey(key: string): void
  init():void;
  ready(): void 
  build(): string 
  create(wait?: boolean | undefined): void
  template(template: (_: DirectiveTemplateI) => string): string
  attach(parent: MyC): string 
  update(callback?: (() => void) | undefined, forceChange?: boolean): void
  render(root: Element | HTMLElement | null, principal?: boolean): void
  clear(): Promise<void>

  _didMount(): Promise<void>
  _didUnmount(): Promise<void>
  _didUpdate(): Promise<void>
  _string2html(str: string): Element
}

export interface MyE{
  state?: any,
  globalStore?: any,

  init?():void,
  update?():void
  build():string,
  template?():string
}