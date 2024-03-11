/**
 * @description this function returns the string parsing the pair key, value from an object
 * @param {string} key
 * @param {*} value
 * @returns {string}
 */
function parsePair(key, value) {
  let str = "";
  key = stringify(key);
  const localValue = stringify(value);
  if (typeof value !== "function") {
    str += `${key}:`;
  } else if (
    localValue.startsWith("function") ||
    localValue.startsWith("class") ||
    /[=]>/.test(localValue.split(/[\n\r]/)[0])
  ) {
    str += `${key}:`;
  }
  str += `${localValue}`;
  return str;
}
/**
 * @description this function convert a Symbol from an object, including specials Symbols
 * @param {Symbol} symbol
 * @param {Object} obj
 * @returns {String}
 */
function parseSymbol(symbol, obj) {
  let str = "";
  const key = `[${stringify(symbol)}]`;
  const value = obj[symbol];
  const localValue = stringify(value);
  if (typeof value !== "function") {
    str += `${key}:`;
  } else if (localValue.startsWith("function") || /[=]>/.test(localValue.split(/[\n\r]/)[0])) {
    str += `${key}:`;
  }
  str += `${localValue}`;
  return str;
}
/**
 * @description this function converts a Set into string declaration
 * @param {Set} set
 * @returns {string}
 */
function parseSet(set) {
  return `new Set(${stringify([...set])})`;
}
/**
 * @description this function converts a Map into string declaration
 * @param {Map} map
 * @returns {String}
 */
function parseMap(map) {
  return `new Map(${stringify([...map.entries()])})`;
}
/**
 * @description main function that serialize almost anything into string
 * @param {*} obj
 * @returns {String}
 */
function stringify(obj) {
  switch (typeof obj) {
    case "undefined":
      return "undefined";
    case "number":
    case "boolean":
    case "function":
      return `${obj}`;
    case "bigint":
      return `${obj}n`;
    case "string":
      return JSON.stringify(obj);
    case "symbol":
      // eslint-disable-next-line no-case-declarations
      const desc = obj.description;
      if (desc?.startsWith("Symbol")) return `${desc || ""}`;
      return `Symbol("${desc || ""}")`;
    default:
      //consultamos para verificar
      if (obj === null) return "null";
      if (obj instanceof RegExp) return `${obj}`;
      if (Array.isArray(obj)) {
        return `[${obj.reduce((concat, val) => {
          const result = stringify(val);
          return (concat && `${concat}, `) + result;
        }, "")}]`;
      }
      if (obj instanceof Date) return `new Date(${obj.getTime()})`;
      if (obj instanceof Map) return parseMap(obj);
      if (obj instanceof Set) return parseSet(obj);
      //acá se deben agregar los parsers externos ya que después cae en typeof object
      //luego de los parsers se presume objeto
      return `{${Object.entries(obj).reduce((concat, [key /*, val*/]) => {
        // obtenemos los posibles valores del atributo del objeto
        const {get, set, value} = Object.getOwnPropertyDescriptor(obj, key);
        //recorremos las opciones
        const parse = [get, set, value].reduce((concat, val) => {
          //if (typeof val === "undefined") return concat;
          const result = parsePair(key, val);
          return (concat && `${concat}, `) + result;
        }, "");
        return `${concat ? `${concat}, ${parse}` : `${parse}`}`;
      }, "")}${Object.values(obj).length ? "," : ""}${Object.getOwnPropertySymbols(obj).reduce(
        (concat, key) => `${concat ? `${concat}, ${parseSymbol(key, obj)}` : `${parseSymbol(key, obj)}`}`,
        ""
      )}}`;
  }
}
/**
 * @description Optional function to parse serialized object
 * @param {String} string
 * @returns {*}
 */
const parse = string => {
  const result = `return ${string};`;
  return new Function(result).call(null);
};
export {stringify, parse};
