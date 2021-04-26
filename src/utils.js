export function accessNestedPropertyReverse(obj, keys) {
  let result = obj;
  for (let i = keys.length - 1; i >= 0; --i) {
    result = result[keys[i]];
  }
  return result;
}
