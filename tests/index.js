import {stringify, parse} from "../index.js";

//TESTS
// const obj = {a: 1, b: 2};
/* var obj2;
 * const str = stringify(obj);
 * parse(str, {assignTo: "obj2"});
 * console.log(obj2); */

// stringify = require('serialize-javascript');
// const fs = require("fs");
const h = Symbol("h");
let obj = {
  number: 1,
  string: "b",
  bigint: 1n,
  regex: /a/gi,
  shFunc(c) {
    return c;
  },
  arrowFunc: d => d,
  async shAsyncFunc(e) {
    return e;
  },
  arrowAsyncfunc: async f => f,
  array: [
    1,
    2,
    3,
    4,
    {
      a: 1,
      b(b) {
        return b;
      }
    }
  ],
  [h]: "h",
  [Symbol.asyncIterator]() {
    return true;
  }
};

obj = {
  symbol: Symbol("test"),
  [h]: true,
  *[Symbol.iterator]() {
    yield 5;
    yield 6;
  },
  test: class {
    #priv = 5;
    constructor() {
      return true;
    }
  },
  get other() {
    return true;
  },
  /* set other(v) {
   *   this._v = v;
   * }, */
  f1: () => true,
  f2() {
    return true;
  }
};
// prueba referencia circular
// obj.obj = obj;
const m = new Map();
m.set(1, "1");
m.set(true, true);
m.set("function", () => true);
m.set({a: 1}, function (x) {
  return x;
});
m.set(Symbol.asyncIterator, async function* () {
  yield true;
});
const s = new Set([1, 2, 3, 4, 5]);
obj.m = m;
obj.s = s;
console.log(Object.getOwnPropertyDescriptor(obj, "other"));
console.log(Object.getOwnPropertyDescriptor(obj, h));
console.log("OBJ");
console.dir(obj);
console.log("\n\n\n\n");
const string = stringify(obj);
console.log("OBJ STRINGIFY\n", string);
console.log("\n\n\n\n");
const obj2 = parse(string);
console.log("OBJ STRING PARSED");
console.dir(obj2);
console.log("\n\n\n\n");
console.log("ITERATOR", [...obj]);
console.log("ITERATOR2", [...obj2]);
console.log("\n\n\n\n");
console.log("SEVERAL STRINGIFIES");
[
  //Números
  1,
  Infinity,
  Number.MAX_SAFE_INTEGER,
  9999999999999999,
  9999999999999999n,
  1234567890123456789012345678901234567890,
  1.25,
  //texto
  "text",
  //Boolean
  true,
  false,
  //Indefinidos
  null,
  undefined,
  //funciones
  () => true,
  function normal() {
    return 1;
  },
  async function async() {
    return await 1;
  },
  function* generator() {
    yield true;
  },
  // fs.readFileSync,
  //arreglos
  [1, 2, 3, 4, null, undefined, () => true, "test", class test {}],
  //clases
  class test {
    constructor() {
      console.log(1);
    }
    get test() {
      return true;
    }
    set test(v) {
      this._test = v;
    }
    get [Symbol("test")]() {
      return true;
    }
    [Symbol.asyncIterator]() {
      return true;
    }
  },
  class newError extends Error {},
  new Error("cri cri"),
  //regexp
  /asd/g,
  //símbolos
  Symbol.iterator
].forEach(val => {
  const res = stringify(val);
  console.log(typeof res, typeof val, "-", res, "-", parse(res));
});

/* class Iter {
 *   constructor() {}
 *   *[Symbol.iterator]() {
 *     yield 1;
 *     yield 2;
 *   }
 *   get test() {
 *     return 1;
 *   }
 * }
 * const iter = new Iter();
 * for (const key in iter) {
 *   console.log(key, iter[key]);
 * }
 * console.log("stringify class Iter", stringify(Iter));
 * console.log("stringify iter", stringify(iter));
 * console.log("stringify iter proto", stringify(iter.__proto__));
 * console.log("iter.test", iter.test);
 * console.log("iter.constructor", stringify(iter.constructor));
 * console.log("iter.iterator", [...iter]);
 * console.log("getPrototypeOf iter", stringify(Object.getPrototypeOf(iter))); */
