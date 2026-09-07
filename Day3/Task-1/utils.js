function chunk(array, size) {
  if (!Array.isArray(array)) {
    throw new Error("First argument must be an array");
  }

  if (size <= 0) {
    throw new Error("Size must be greater than 0");
  }

  const result = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
}


function zip(array1, array2) {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    throw new Error("Both inputs must be arrays");
  }

  const result = [];
  const length = Math.min(array1.length, array2.length);

  for (let i = 0; i < length; i++) {
    result.push([array1[i], array2[i]]);
  }

  return result;
}


function groupBy(array, key) {
  if (!Array.isArray(array)) {
    throw new Error("First argument must be an array");
  }

  const result = {};

  for (const item of array) {
    const value = item[key];

    if (!result[value]) {
      result[value] = [];
    }

    result[value].push(item);
  }

  return result;
}


function pipe(...functions) {
  return function (value) {
    return functions.reduce((result, fn) => fn(result), value);
  };
}


function compose(...functions) {
  return function (value) {
    return functions.reduceRight((result, fn) => fn(result), value);
  };
}


function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }

    return function (...nextArgs) {
      return curried(...args, ...nextArgs);
    };
  };
}


function partial(fn, ...fixedArgs) {
  return function (...remainingArgs) {
    return fn(...fixedArgs, ...remainingArgs);
  };
}


module.exports = {
  chunk,
  zip,
  groupBy,
  pipe,
  compose,
  curry,
  partial
};