import axios from "axios";
import Web3 from "web3";

const ping = async () => {
  let status;
  try {
    status = await axios("https://api.coingecko.com/api/v3/ping");
  } catch (e) {
    console.error(e);
  }
  return status;
};

const getOhlc = async (id, step) => {
  let ohlc;
  try {
    ohlc = await axios(
      `https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=max`
    );
  } catch (e) {
    console.error(e);
  }
  const filterOhlc = ohlc
    ? ohlc?.data.filter((v, i) => (i % step ? false : true))
    : null;
  const priceList = filterOhlc?.map((v) => v[4]);
  const last = Math.floor(filterOhlc[filterOhlc.length - 1][0] / 1000);
  return { priceList, last };
};

const tokens = async (ids) => {
  let tokensData;
  try {
    tokensData = await axios(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=250&page=1&sparkline=true`
    );
  } catch (error) {
    console.error(error);
  }
  return tokensData;
};

const getToken = async (id) => {
  let tokenData;
  try {
    tokenData = await axios(
      `https://api.coingecko.com/api/v3/coins/${id}?tickers=false&community_data=true&developer_data=true&sparkline=true`
    );
  } catch (error) {
    console.error(error);
  }
  return tokenData;
};
const tickers = async (exchangeId, primaryTokens) => {
  let res;
  try {
    res = await axios(
      `https://api.coingecko.com/api/v3/exchanges/${exchangeId}/tickers`
    );
  } catch (error) {
    console.error(error);
  }
  const uniqueData = {};
  let ids = [];
  let checksums = [];
  const tickerData = res?.data?.tickers;
  if (!!tickerData) {
    for (let x in tickerData) {
      if (!ids.includes(tickerData[x].coin_id)) {
        ids.push(tickerData[x].coin_id);
        if (Web3.utils.isAddress(tickerData[x].base)) {
          const baseChecksum = Web3.utils.toChecksumAddress(tickerData[x].base);
          uniqueData[tickerData[x].coin_id] = {
            address: baseChecksum,
            id: tickerData[x].coin_id,
          };
        } else {
          uniqueData[tickerData[x].coin_id] = {
            address: tickerData[x].base,
            id: tickerData[x].coin_id,
          };
        }
      }
      if (!ids.includes(tickerData[x].target_coin_id)) {
        ids.push(tickerData[x].target_coin_id);
        if (Web3.utils.isAddress(tickerData[x].target)) {
          const targetChecksum = Web3.utils.toChecksumAddress(
            tickerData[x].target
          );
          uniqueData[tickerData[x].target_coin_id] = {
            address: targetChecksum,
            id: tickerData[x].target_coin_id,
          };
        } else {
          uniqueData[tickerData[x].target_coin_id] = {
            address: tickerData[x].target,
            id: tickerData[x].target_coin_id,
          };
        }
      }
    }
  }

  const idString = ids.join(",");
  let tokenData;
  let uniqueArray;
  try {
    tokenData = await tokens(idString);
  } catch (e) {
    console.error(e);
  }
  if (!!tokenData) {
    for (let x in tokenData.data) {
      uniqueData[tokenData.data[x].id].image = tokenData.data[x].image;
      uniqueData[tokenData.data[x].id].name = tokenData.data[x].name;
      uniqueData[tokenData.data[x].id].symbol = tokenData.data[x].symbol;
      uniqueData[tokenData.data[x].id].last = tokenData.data[x].current_price;
      uniqueData[tokenData.data[x].id].change24h =
        tokenData.data[x].price_change_24h;
      uniqueData[tokenData.data[x].id].id = tokenData.data[x].id;
    }

    for (let x in ids) {
      if (!!uniqueData[ids[x]]?.image) {
        checksums.push(uniqueData[ids[x]].address);
      }
    }
    uniqueArray = primaryTokens.filter(
      (v) =>
        !checksums.includes(
          Web3.utils.toChecksumAddress(
            Web3.utils.isAddress(v.address) && v.address
          )
        )
    );
    for (let x in ids) {
      if (!!uniqueData[ids[x]]?.image) {
        uniqueArray.push(uniqueData[ids[x]]);
      }
    }
  }
  return uniqueArray;
};

export { ping, tickers, getToken, getOhlc };
