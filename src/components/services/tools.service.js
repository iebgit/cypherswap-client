const arrayMax = (arr) => {
  if (arr.length > 0) {
    return arr.reduce(function (p, v) {
      return p > v ? p : v;
    });
  }
};

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const getRandom = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};
const range = (x, y) => {
  if (x > y) return range(y, x).reverse();
  else return x === y ? [y] : [x, ...range(x + 1, y)];
};

export { arrayMax, timer, getRandom, range };
