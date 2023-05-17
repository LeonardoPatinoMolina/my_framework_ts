/**
 * Función encargada de realizar una copia profunda de datos complejos
 * esto con el objetivo de general datos por valor en algunos contextos 
 * de my_framwework_ts
 * @param value valor a clonar
 * @returns valor clonado
 */
export function cloneDeep(value: any): any {
  if (value instanceof Map) {
    const clonedMap = new Map();
    value.forEach((innerValue: any, key: any) => {
      clonedMap.set(key, cloneDeep(innerValue));
    });
    return clonedMap;
  } else if (value instanceof Set) {
    const clonedSet = new Set();
    value.forEach((innerValue: any) => {
      clonedSet.add(cloneDeep(innerValue));
    });
    return clonedSet;
  } else if (Array.isArray(value)) {
    return value.map(cloneDeep);
  } else if (typeof value === 'object' && value !== null) {
    return structuredClone(value);
  } else {
    return value;
  }
}