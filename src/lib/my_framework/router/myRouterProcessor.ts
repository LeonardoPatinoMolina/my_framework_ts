import { RouterTaskArgsI, RouterTaskT } from "./types/myRouter.types";

export class MyRouterProcessor{
  private tasks: Array<RouterTaskT> = [];

  addTask(task: RouterTaskT){
    this.tasks?.push(task);
  }

  *processTask(request: RouterTaskArgsI): Generator<RouterTaskArgsI>{
    if(this.tasks.length === 0) return request;
    let currentProcess: RouterTaskArgsI = request;
    for (const task of this.tasks) {
      currentProcess = task(currentProcess)
      yield currentProcess;
    }
  }
}