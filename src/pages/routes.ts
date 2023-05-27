import { RoutesI } from "../lib/my_framework/router/types/myRouter.types"
import { _404Module } from "./404/404.module"
import { CounterModule } from "./counter/counter.module"
import { IResultIn, IResultOut } from "./result/interceptor"
import { ResultModule } from "./result/result.module"

export const ROUTES: RoutesI[] = [
  {path: "/", modulePage: CounterModule},
  {path: "/result/:result", modulePage: ResultModule, in: IResultIn, out: IResultOut},
  {path: '/vega', modulePage: _404Module}
]