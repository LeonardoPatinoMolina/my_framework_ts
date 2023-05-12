export interface ObserverI{
  storeNotify(charge?: {shelf: string, data: any}): void
}