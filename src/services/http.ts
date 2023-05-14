import { MyInjectable } from "@my_framework/decorators/myInjectable";

@MyInjectable({serviceName: 'http'})
export class HttpService {
  url = "https://jsonplaceholder.typicode.com/users";

  async get(): Promise<any>{
    const res = await fetch(this.url)
    const jsonRes = res.json()
    return jsonRes;
  }

}