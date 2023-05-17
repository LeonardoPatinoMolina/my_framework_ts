// interface CreateNodeI {
//   type: keyof HTMLElementTagNameMap,
//   attributes: {
//     [key: string]: string
//   },
//   onCLick: (e?: any)=>void
// }

export function createNode(args){
  const newEl = document.createElement(args.type);
  for (const key in args.attributes) {
    if (Object.prototype.hasOwnProperty.call(args.attributes, key)) {
      const attr = args.attributes[key];
      newEl[key] = attr;
    }
  }
  return newEl.outerHTML
}