export interface ObserverI{
  storeNotify(charge?: StoreNotifyI): void
}

export type StoreNotifyI = {data: any, shelf: string}