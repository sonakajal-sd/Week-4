function memoize(fn) {
  const cache = new Map();

  return function (value) {
    if (cache.has(value)) {
      return cache.get(value);
    }

    const result = fn(value);

    cache.set(value, result);

    return result;
  };
}

module.exports = memoize;