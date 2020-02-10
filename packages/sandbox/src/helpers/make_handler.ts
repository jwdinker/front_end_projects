// const makeHandlers: <Function | Function[]>(handler) {
//   const handlers = Array.isArray(handler) ? handler : [handler];
//   return (...args) => {
//     handlers.forEach((fn) => {
//       fn(...args);
//     });
//   };
// }

function makeHandlers(handler: Function | Function[]): Function {
  const handlers: Function[] = Array.isArray(handler) ? handler : [handler];
  return (...args: any[]) => {
    handlers.forEach((fn: Function) => {
      fn(...args);
    });
  };
}

export default makeHandlers;
