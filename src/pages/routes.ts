import { RoutesI } from "../lib/my_framework/router/types/myRouter.types"
import { CounterModule } from "./counter/counter.module"
import { ResultModule } from "./result/result.module"

export const ROUTES: RoutesI[] = [
  {path: "/", modulePage: CounterModule},
  {path: "/result/:result", modulePage: ResultModule},
]