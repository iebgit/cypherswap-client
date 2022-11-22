import { range } from "./tools.service";
import moment from "moment";

const projectTime = (start, step, length) => {
  start = Number(start);
  let future = [];
  const secondsDay = 86400;

  for (let x = 0; x < length; x++) {
    future.push(`${start}`);
    start += secondsDay * step;
  }
  return future;
};

const fibonacci = (weekList, decimals) => {
  const smaPriceList = [...weekList];
  const differenceList = [];
  let sma20Ready;
  let currentSMA;
  let smaRange;
  let sma20, difference, currentPrice;

  if (1 < weekList.length && weekList.length < 20) {
    sma20Ready = 1;
    smaRange = weekList.length;
    currentSMA = weekList
      .slice(weekList.length - 1)
      .reduce((acc, val) => acc + val);
  } else {
    sma20Ready = Number(weekList.length / 20).toFixed();
    smaRange = 20;
    currentSMA = Number(
      weekList.slice(weekList.length - 21).reduce((acc, val) => acc + val) / 20
    );
  }
  for (let x in range(0, sma20Ready - 1)) {
    sma20 =
      smaPriceList
        .slice(smaPriceList.length - smaRange + 1)
        .reduce((acc, val) => acc + val) / smaRange;

    currentPrice = smaPriceList.pop();
    if (sma20 != 0) {
      difference = Number((currentPrice - sma20) / sma20);
      differenceList.push(difference);
    }
  }
  const maxDiff = Math.max(...differenceList);
  const minDiff = Math.min(...differenceList);
  const diffFibs = makeFibList(
    differenceList,
    maxDiff,
    minDiff,
    currentSMA,
    decimals
  );
  return {
    diffFibs,
    currentSMA: `${Number((currentSMA * Math.pow(10, decimals)).toFixed())}`,
  };
};

const makeFibList = (
  differenceList,
  maxDiff,
  minDiff,
  currentSMA,
  decimals
) => {
  let d, topDiff, l1, l2, l3, l4, diffFibs0, diffFibs1;

  for (let x in differenceList) {
    if (maxDiff === differenceList[x]) {
      d = Math.abs(differenceList[x]);
      topDiff = d * currentSMA;
      l1 = currentSMA + topDiff * 0.382;
      l2 = currentSMA + topDiff * 0.5;
      l3 = currentSMA + topDiff * 0.618;
      l4 = currentSMA + topDiff * 0.786;
      diffFibs0 = [
        `${Number((currentSMA * Math.pow(10, decimals)).toFixed())}`,
        `${Number((l1 * Math.pow(10, decimals)).toFixed())}`,
        `${Number((l2 * Math.pow(10, decimals)).toFixed())}`,
        `${Number((l3 * Math.pow(10, decimals)).toFixed())}`,
        `${Number((l4 * Math.pow(10, decimals)).toFixed())}`,
        `${999999999999999}`,
      ];
    }
    if (minDiff === differenceList[x]) {
      d = Math.abs(differenceList[x]);
      topDiff = d * currentSMA;
      l1 = currentSMA - topDiff * 0.382;
      l2 = currentSMA - topDiff * 0.5;
      l3 = currentSMA - topDiff * 0.618;
      l4 = currentSMA - topDiff * 0.786;
      diffFibs1 = [
        `${Number((currentSMA * Math.pow(10, decimals)).toFixed())}`,
        `${Number((l1 * Math.pow(10, decimals)).toFixed())}`,
        `${Number((l2 * Math.pow(10, decimals)).toFixed())}`,
        `${Number((l3 * Math.pow(10, decimals)).toFixed())}`,
        `${Number((l4 * Math.pow(10, decimals)).toFixed())}`,
        `${0}`,
      ];
    }
  }
  return [diffFibs0, diffFibs1];
};

export { fibonacci, projectTime };
