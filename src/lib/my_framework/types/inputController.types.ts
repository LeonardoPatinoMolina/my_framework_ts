export interface InputControllerI {
  state: {
    value: string, 
    name: string, 
    stateName: string, 
    isFocus: boolean
  };
  targetKey: string;
  callback?: (value: string)=>string;
}

export interface InputModelI{
  [key: string]: {
    [key: string]: string
  }
}