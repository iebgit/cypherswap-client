import { action, makeObservable, observable } from "mobx";
import { getToken } from "./../components/services/gecko.service";
import { usDollar } from "./../components/services/transactions.service";
import moment from "moment";

class TokenStoreImpl {
  tokenData = [];
  tokenIds = [{ id: null, user: null, ts: 0, }];
  constuctor() {
    makeObservable(this, { tokenData: observable, addToken: action });
  }

  addToken = async (id, user) => {
    const tsDiff =
      Number(new Date().getTime()) -
      Number(this.tokenIds[this.tokenIds.length - 1]?.ts);
    const isReady = tsDiff > 2000;
    if (isReady) {
      this.tokenIds.push({ id, ts: new Date().getTime(), user });
      const tokenObj = {};
      for (let i in this.tokenData) {
        if (this.tokenData[i].id !== id) {
          tokenObj[this.tokenData[i].id] = this.tokenData[i];
        }
      }
      try {
        const response = await getToken(id);
        const price = response.data.market_data.sparkline_7d.price;
        const ts = moment().subtract(price.length - 1, "h");
        const fData = [];
        for (let p in price) {
          fData.push({
            USD: Number(price[p]),
            time: ts.format("L LT"),
          });
          ts.add(1, "h");
        }
        response.data.market_data.sparkline_7d.price = fData;
        const tokenData = Object.values(tokenObj);
        tokenData.push(response.data);
        this.tokenData = tokenData;
      } catch (error) {
        console.error(error);
      }
      if (this.tokenData.length > 10) {
        this.tokenData.shift();
      }
    }
    console.log(this.tokenIds)
  };
}

export const TokenStore = new TokenStoreImpl();
