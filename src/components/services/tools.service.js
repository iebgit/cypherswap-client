const arrayMax = (arr) => {
  return arr.reduce(function (p, v) {
    return p > v ? p : v;
  });
};

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const getRandom = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

export { arrayMax, timer, getRandom };
