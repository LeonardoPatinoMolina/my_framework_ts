export interface InputControllerI {
  state: {
    value: string, 
    modelName: string, 
    fieldName: string, 
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