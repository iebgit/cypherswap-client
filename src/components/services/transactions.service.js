const BigNumber = require("bignumber.js");
const { ethers } = require("ethers");
const networks = require("./../assets/networks.json");
const Web3 = require("web3");

const formatAmountIn = (tokenMultiply, amount) => {
  const tokenAmount = new BigNumber((tokenMultiply * amount).toString());
  const amountIn = ethers.utils.parseUnits(tokenAmount.toFixed(), "wei");
  return amountIn;
};

const convertTokens = (tokenArray) => {
  const convertedArray = [];
  for (let x in tokenArray) {
    convertedArray.push({
      address: tokenArray[x][0],
      image: tokenArray[x][1],
      name: tokenArray[x][2],
      symbol: tokenArray[x][3],
    });
  }
  return convertedArray;
};

const usDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const getUserData = async (msg) => {
  let name;
  let network;
  let address;
  let chainList = [];
  let signer;
  let chainId;

  if (msg) {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );

      if (!!provider) {
        signer = provider.getSigner();
        chainId = await signer.getChainId();
      }

      try {
        address = await signer.getAddress();
      } catch (error) {
        console.error(`An error arose while getting address: ${error}`);
      }
      for (let x = 0; x < networks.length; x++) {
        chainList.push(networks[x].id);

        if (chainId === networks[x].id) {
          name = networks[x].networkName;

          network = networks[x];
        }
      }
      if (!address && !!network) {
        return {
          usDollar,
          provider,
          signer,
          network: networks[5],
          networks,
          chainId,
          chainList,
          message: "Error",
        };
      } else {
        const balance = await signer.getBalance(),
          routerContract = new ethers.Contract(
            network?.routerAddress,
            network?.routerJson.abi,
            signer
          ),
          factoryAddress = await routerContract.factory(),
          factoryContract = new ethers.Contract(
            factoryAddress,
            network?.factoryJson,
            provider
          ),
          pathList = [
            {
              address: Web3.utils.toChecksumAddress(network.btc),
              symbol: "WBTC",
            },
            {
              address: Web3.utils.toChecksumAddress(network.usdc),
              symbol: "USDC",
            },
            {
              address: Web3.utils.toChecksumAddress(network.usdt),
              symbol: "USDT",
            },
            {
              address: Web3.utils.toChecksumAddress(network.tokens[0][0]),
              symbol: network?.tokens[0][3],
            },
            {
              address: Web3.utils.toChecksumAddress(network.tokens[1][0]),
              symbol: network?.tokens[1][3],
            },
          ];
      
        return {
          usDollar,
          pathList,
          routerContract,
          factoryContract,
          provider,
          signer,
          address,
          balance,
          chainId: parseInt(chainId),
          network,
          networks,
          chainList,
          message: `${address.slice(0, 5)}...${address.slice(-4)}`,
        };
      }
    } catch (error) {
      console.error("🚫 ERROR IN ETHERS.JS", error);
    }

    return {
      usDollar,
      network: networks[5],
      networks,
      chainId: 1,
      chainList: [1666600000, 1, 250, 43114, 56, 137],
      message: "Error",
    };
  }
};

const getPaths = async (
  factory,
  pathList,
  baseAddress,
  targetAddress,
  baseLabel,
  targetLabel
) => {
  const noPair = "0x0000000000000000000000000000000000000000";
  const paths = [];
  const pair = await factory.getPair(baseAddress, targetAddress);

  if (pair !== noPair) {
    paths.push([
      { address: baseAddress, symbol: baseLabel },
      { address: targetAddress, symbol: targetLabel },
    ]);
  }
  for (let x = 0; x < pathList.length; x++) {
    if (
      pathList[x].address !== baseAddress &&
      pathList[x].address !== targetAddress
    ) {
      let altPair0;
      let altPair1;

      try {
        altPair0 = await factory.getPair(baseAddress, pathList[x].address);

        altPair1 = await factory.getPair(targetAddress, pathList[x].address);
      } catch (e) {
        console.error("Alt Pair Error:", e);
      }

      if (altPair0 !== noPair && altPair1 !== noPair) {
        paths.push([
          { address: baseAddress, symbol: baseLabel },
          pathList[x],
          { address: targetAddress, symbol: targetLabel },
        ]);
      }
    }
  }
  return paths;
};

const approve = async (
  baseAmount,
  baseInstance,
  routerAddress,
  baseMultiply
) => {
  let result = false;
  if (!!baseAmount) {
    const address = routerAddress;
    const hexAmountIn = await formatAmountIn(baseMultiply, baseAmount);
    const weth = baseInstance;
    try {
      await weth.approve(address, hexAmountIn);
      result = true;
    } catch (e) {
      console.error("An error occurred during approval: ", e);
      result = (await e.data?.message) || (await e.message);
    }
  }
  return result;
};

const swapTokens = async (
  baseAmount,
  baseMultiply,
  baseSymbol,
  wethSymbol,
  targetSymbol,
  targetDecimal,
  currentPrice,
  contract,
  account,
  path,
  ammData
) => {
  let result = false;
  if (baseAmount > 0) {
    path = path.map((token) => token.address);

    const amountIn = formatAmountIn(baseMultiply, baseAmount);
    const amountOut = new BigNumber(
      (currentPrice * Math.pow(10, targetDecimal)).toFixed()
    );
    const amountOutMin0 = amountOut.minus(amountOut.dividedToIntegerBy("10"));
    const amountOutMin = ethers.utils.parseUnits(
      amountOutMin0.toString(),
      "wei"
    );
    const deadline = Date.now() + 1000 * 60 * 10; //10 minutes
    if (baseSymbol !== wethSymbol && targetSymbol !== wethSymbol) {
      try {
        await contract
          .swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            account,
            deadline
          )
          .then(() => {
            result = true;
          });
      } catch (e) {
        console.error("swapExactTokensForTokens", e);
        result = (await e.data?.message) || (await e.message);
      }
    } else if (baseSymbol === wethSymbol && targetSymbol !== wethSymbol) {
      if (ammData.name === "Pangolin") {
        try {
          await contract
            .swapExactAVAXForTokens(amountOutMin, path, account, deadline, {
              value: amountIn,
            })
            .then((receipt) => {
              result = true;
            });
        } catch (e) {
          console.error("swapExactAVAXForTokens", e);
          result = (await e.data?.message) || (await e.message);
        }
      } else {
        try {
          await contract
            .swapExactETHForTokens(amountOutMin, path, account, deadline, {
              value: amountIn,
            })
            .then((receipt) => {
              result = true;
            });
        } catch (e) {
          console.error("swapExactETHForTokens", e);
          result = (await e.data?.message) || (await e.message);
        }
      }
    } else {
      if (ammData.name === "Pangolin") {
        try {
          await contract
            .swapExactTokensForAVAX(
              amountIn,
              amountOutMin,
              path,
              account,
              deadline
            )
            .then((receipt) => {
              result = true;
            });
        } catch (e) {
          console.error("swapExactTokensForAVAX", e);
          result = (await e.data?.message) || (await e.message);
        }
      } else {
        try {
          await contract
            .swapExactTokensForETH(
              amountIn,
              amountOutMin,
              path,
              account,
              deadline
            )
            .then(() => {
              result = true;
            });
        } catch (e) {
          console.error("swapExactTokensForETH", e);
          result = (await e.data?.message) || (await e.message);
        }
      }
    }
  }
  return result;
};

const getBalance = async (contract, address, decimal) => {
  const value = await contract.balanceOf(address);
  return Number(ethers.utils.formatUnits(value, decimal)).toFixed(6);
};

export {
  formatAmountIn,
  getPaths,
  approve,
  swapTokens,
  getUserData,
  convertTokens,
  getBalance,
  usDollar,
};
