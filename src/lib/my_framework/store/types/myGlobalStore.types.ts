export interface ObserverI{
  storeNotify(charge?: StoreNotifyI): void
}

export type StoreNotifyI<T = any> = {data: T, shelf: string}