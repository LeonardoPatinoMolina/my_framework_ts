export type DisposeEventT = ()=>void;
export type DependecyT = any[] | undefined;

export interface EffectI {
  dispose: DisposeEventT | undefined, 
  update: DisposeEventT |(()=>DisposeEventT), 
  dependency: DependecyT, 
  oldDependency: string
} 