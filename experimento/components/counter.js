import { createNode } from "../lib/component.js";

/*
realizar un algoritmo que basado en un número objetivo
encuentre los dos elementos en un conjunto de números enteros que, sumados dan el número objetivo:
CONDICIÓN:
  la complejidad no debe exceder el O(n), es decir, 
  máximo debe usarse una sola sentencia de bucle: for, map, foreach, while, do  while, filter, find, etc...
 */

let conjunto = [2,4,5,6,7,8,9,1,10,11,12,13,14,15];
const objetivo = 5;

function findTwoCorrecto(arr, target){
  const differences = new Map();
  for (const num of arr) {
    const epa = target - num
    const isDifference = differences.has(epa);
    if(isDifference) return [differences.get(epa), num]
    else {differences.set(num, num)}
  }
}

function findTwoIncorrecto(arr, target){
  for (const num of arr) {
    for (const n of arr) {
      if((num + n) === target) return [num, n]
    }
  }
}

console.time('find incorrecto')
console.log(findTwoIncorrecto(conjunto, objetivo));
console.timeEnd('find incorrecto')

console.time('find correcto')
console.log(findTwoCorrecto(conjunto, objetivo));
console.timeEnd('find correcto')


export function Counter(){
  return createNode({
    type: 'div',
    attributes: {
      'innerHTML': `lorem`
    },
    onCLick: ()=>{
      console.log('jajaji');
    }
  })
}


