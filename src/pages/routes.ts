import { RoutesI } from "../lib/my_framework/router/types/myRouter.types"
import { AboutModule } from "./about/about.module"
import { CounterModule } from "./counter/counter.module"

export const ROUTES: RoutesI[] = [
  {paths: "/", modulePage: CounterModule},
  {paths: "/about", modulePage: AboutModule, params: ['id']}
]