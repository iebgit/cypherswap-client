import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Swap.css";
import useStyles from "./styles";
import { ethers } from "ethers";
import erc20 from "../assets/ERC20.json";
import Select from "react-select";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import geckoImg from "./../common/[latest] coingecko_logo_without_text.png";
import {
  approve,
  swapTokens,
  getBalance,
} from "../services/transactions.service";
import { arrayMax } from "../services/tools.service";
import {
  getPaths,
  formatAmountIn,
  convertTokens,
} from "../services/transactions.service";
import { ping, tickers } from "../services/gecko.service";
import Web3 from "web3";
import Chart from "./Chart";
import {
  customStyles,
} from "../../constants/theme.constants";
import {
  Text,
  Button,
  FramePentagon,
  FrameCorners,
  FrameBox,
  LoadingBars,
} from "@arwes/core";
import StoppableMarquee from "../common/StoppableMarquee";
import Paths from "../common/Paths";
import { TokenStore } from "../../store/TokenStore";

const Swap = ({ web3 }) => {
  const [baseAmount, setBaseAmount] = useState(""),
    [tokenData, setTokenData] = useState(null),
    [show, setShow] = useState(false),
    [targetAmount, setTargetAmount] = useState(""),
    [path, setPath] = useState([]),
    [useWeth, setUseWeth] = useState(false),
    [isDisabled, setIsDisabled] = useState(true),
    [baseContract, setBaseContract] = useState(null),
    [baseDec, setBaseDec] = useState(null),
    [targetContract, setTargetContract] = useState(null),
    [targetBalance, setTargetBalance] = useState(null),
    [targetDec, setTargetDec] = useState(null),
    [baseMultiply, setBaseMultiply] = useState(null),
    [approved, setApproved] = useState(false),
    [swapped, setSwapped] = useState(false),
    [loading, setLoading] = useState("Estimate?"),
    [isRotated, setIsRotated] = useState(false),
    [btnLabel, setBtnLabel] = useState("Estimate"),
    [tokens, setTokens] = useState(() => convertTokens(web3?.network?.tokens)),
    [baseBalance, setBaseBalance] = useState(0),
    [tokenTag, setTokenTag] = useState(false),
    [activate, setActivate] = useState(true),
    [tokenCheck, setTokenCheck] = useState(false),
    [tokenIndex, setTokenIndex] = useState(0),
    [tokenName, setTokenName] = useState(null),
    [isShowable, setIsShowable] = useState(false),
    [base, setBase] = useState({
      value: [
        web3?.network?.primaryTokens[0].address,
        web3?.network?.primaryTokens[0].name,
      ],
      label: web3?.network?.primaryTokens[0].symbol.toUpperCase(),
      image: web3?.network?.primaryTokens[0].image,
      name: web3?.network?.primaryTokens[0].name,
      id: web3?.network?.primaryTokens[0].id,
      disabled: true,
    }),
    [target, setTarget] = useState({
      value: [
        web3?.network?.primaryTokens[1].address,
        web3?.network?.primaryTokens[1].name,
      ],
      label: web3?.network?.primaryTokens[1].symbol.toUpperCase(),
      image: web3?.network?.primaryTokens[1].image,
      name: web3?.network?.primaryTokens[1].name,
      id: web3?.network?.primaryTokens[1].id,
      disabled: true,
    }),
    [options, setOptions] = useState(
      web3?.message === "Error" || !tokens
        ? web3?.network?.tokens.map((data) => {
            const disabled =
              base.value[0] === data[0] || target.value[0] === data[0]
                ? true
                : false;
            return {
              value: [data[0], data[2]],
              label: data[3].toUpperCase(),
              image: data[1],
              name: data[2],
              disabled,
            };
          })
        : tokens.map((data, i) => {
            const disabled =
              base.value[0] === data.address || target.value[0] === data.address
                ? true
                : false;
            return {
              value: [data.address, data.name],
              label: data.symbol.toUpperCase(),
              image: data.image,
              name: data.name,
              id: data.id,
              disabled,
            };
          })
    );

  const switchTokens = () => {
    setBase(target);
    setTarget(base);
  };

  useEffect(() => {
    setBtnLabel(!!path.length ? (approved ? "Swap" : "Approve") : "Estimate");
  }, [approved, path]);

  useEffect(() => {
    const getGecko = async () => {
      const geckoSays = await ping();
      // // test w/o api
      // const geckoSays = false;
      if (
        !!geckoSays &&
        !!web3?.network?.exchangeId &&
        !!web3?.network?.primaryTokens
      ) {
        setIsShowable(true);
        let ammTickers;
        try {
          ammTickers = await tickers(
            web3.network.exchangeId,
            web3.network.primaryTokens
          );
        } catch (e) {
          console.error(e);
        }
        setTokens(ammTickers);
        await TokenStore.addToken("bitcoin", web3.address);
        const store = await TokenStore.tokenData;
        let tokensCheck =
          store[store.length - 1]?.market_data.current_price.usd > 0;
        setTokenData(store);
        setTokenCheck(tokensCheck);
        setTokenIndex(store.length - 1);
        setTokenName(store[store.length - 1]?.name);
        setBase({
          value: [
            web3?.network?.primaryTokens[0].address,
            web3?.network?.primaryTokens[0].name,
          ],
          label: web3?.network?.primaryTokens[0].symbol.toUpperCase(),
          image: web3?.network?.primaryTokens[0].image,
          name: web3?.network?.primaryTokens[0].name,
          id: web3?.network?.primaryTokens[0].id,
          disabled: true,
        })
        setTarget({
          value: [
            web3?.network?.primaryTokens[1].address,
            web3?.network?.primaryTokens[1].name,
          ],
          label: web3?.network?.primaryTokens[1].symbol.toUpperCase(),
          image: web3?.network?.primaryTokens[1].image,
          name: web3?.network?.primaryTokens[1].name,
          id: web3?.network?.primaryTokens[1].id,
          disabled: true,
        })
      
       
      } else if (!!web3?.network){
        setIsShowable(false);
        const convertedArray = convertTokens(web3?.network?.tokens);
        const usdcContract = new ethers.Contract(
          Web3.utils.toChecksumAddress(web3.network.usdc),
          erc20.abi,
          web3.signer
        );
        const usdcDecimal = await usdcContract.decimals();
        const usdcMultiply = Math.pow(10, usdcDecimal);
        for (let x in convertedArray) {
          const contract = new ethers.Contract(
            Web3.utils.toChecksumAddress(convertedArray[x].address),
            erc20.abi,
            web3.signer
          );
          const decimal = await contract.decimals();
          const multiply = Math.pow(10, decimal);
          const amountIn = formatAmountIn(multiply, 1);
          const paths = await getPaths(
            web3.factoryContract,
            web3.pathList,
            Web3.utils.toChecksumAddress(convertedArray[x].address),
            Web3.utils.toChecksumAddress(web3.network.usdc),
            convertedArray[x].symbol,
            "USDC"
          );
          let prices = [];
          let price;
          for (let path = 0; path < paths.length; path++) {
            try {
              price = await web3.routerContract.getAmountsOut(
                amountIn,
                paths[path].map((data) => data.address)
              );
              const otherPrice = Number(price[price.length - 1] / usdcMultiply);
              prices.push(otherPrice);
            } catch (error) {
              console.error("getAmountsOut: ", error);
              continue;
            }
          }
          price = arrayMax(prices);
          convertedArray[x].last = price.toFixed(4);
        }

        setTokens(convertedArray);
      }else{  setIsShowable(false);}
    };
    
    getGecko();
  }, [web3]);

  const getApproval = async () => {
    if (approved) {
      setSwapped(
        await swapTokens(
          baseAmount,
          baseMultiply,
          path[0]?.symbol,
          useWeth ? null : web3.network.tokens[0][3].toUpperCase(),
          path.length === 3 ? path[2]?.symbol : path[1]?.symbol,
          targetDec,
          targetAmount,
          web3?.routerContract,
          web3?.address,
          path,
          web3?.network
        )
      );
    } else if (
      Number(baseAmount) > 0 &&
      Number(targetAmount) > 0 &&
      Number(baseBalance) >= Number(baseAmount)
    ) {
      setApproved(
        await approve(
          baseAmount,
          baseContract,
          web3?.network?.routerAddress,
          baseMultiply
        )
      );
    } else {
      setIsDisabled(
        true,
        setTimeout(() => setIsDisabled(false), 300)
      );
      notify("Insufficient Funds!", "insufficient");
    }
  };

  // useEffect(() => {
  //   getApproval()
  // }, [approved])
  const fetchContract = async (addr, tag) => {
    let contract;
    let decimal;
    try {
      if (tag === "base") {
        contract = new ethers.Contract(addr, erc20.abi, web3.signer);
        decimal = await contract.decimals();
        setBaseDec(decimal);
        setBaseContract(contract);
      } else if (tag === "target") {
        contract = new ethers.Contract(addr, erc20.abi, web3.signer);
        decimal = await contract.decimals();
        setTargetDec(decimal);
        setTargetContract(contract);
      } else {
        contract = new ethers.Contract(addr, erc20.abi, web3.signer);
        decimal = await contract.decimals();
      }
    } catch (e) {
      console.error(e);
      setLoading("Error!");
    }
    return { contract, decimal };
  };

  const fetchBalance = async (tag) => {
    let balance;
    try {
      if (tag === "base") {
        const tokenData = await fetchContract(base.value[0], tag);
        const { decimal, contract } = tokenData;
        Web3.utils.toChecksumAddress(base.value[0]) ===
          Web3.utils.toChecksumAddress(web3.network.tokens[0][0]) && !useWeth
          ? (balance = Number(
              ethers.utils.formatUnits(web3.balance, decimal)
            ).toFixed(6))
          : (balance = await getBalance(contract, web3.address, decimal));
        setBaseBalance(balance);
      } else {
        const tokenData = await fetchContract(target.value[0], tag);
        const { decimal, contract } = tokenData;
        Web3.utils.toChecksumAddress(target.value[0]) ===
          Web3.utils.toChecksumAddress(web3.network.tokens[0][0]) && !useWeth
          ? (balance = Number(
              ethers.utils.formatUnits(web3.balance, decimal)
            ).toFixed(6))
          : (balance = await getBalance(contract, web3.address, decimal));
        setTargetBalance(balance);
      }
    } catch (e) {
      console.error("Error fetching balance: ", e);
    }
    return balance;
  };

  const fetchPaths = async () => {
    if (
      web3.provider &&
      !!tokenTag &&
      !!(
        (tokenTag === "base" && baseAmount > 0) ||
        (tokenTag === "target" && targetAmount > 0)
      )
    ) {
      tokenTag === "base" ? setTargetAmount("") : setBaseAmount("");
      let paths;
      try {
        setLoading("Estimating...");
        paths = await getPaths(
          web3.factoryContract,
          web3.pathList,
          tokenTag === "base"
            ? Web3.utils.toChecksumAddress(base.value[0])
            : Web3.utils.toChecksumAddress(target.value[0]),
          tokenTag === "base"
            ? Web3.utils.toChecksumAddress(target.value[0])
            : Web3.utils.toChecksumAddress(base.value[0]),
          tokenTag === "base" ? base.label : target.label,
          tokenTag === "base" ? target.label : base.label
        );
      } catch (e) {
        console.error(e);
        setLoading("Error!");
      }
      let baseCon;
      let targetCon;
      let targetDecimal;
      let baseDecimal;
      try {
        const baseData = await fetchContract(base.value[0], "base");
        baseCon = baseData.contract;
        baseDecimal = baseData.decimal;

        const targetData = await fetchContract(target.value[0], "target");
        targetCon = targetData.contract;
        targetDecimal = targetData.decimal;
      } catch (e) {
        console.error(e);
        setLoading("Error!");
      }

      let targetMultiply;
      let baseMultiply;
      let multiply;
      let amountIn;
      try {
        targetMultiply = Math.pow(10, targetDecimal);
        baseMultiply = Math.pow(10, baseDecimal);
        multiply = tokenTag === "base" ? targetMultiply : baseMultiply;
        amountIn = formatAmountIn(
          tokenTag === "base" ? baseMultiply : targetMultiply,
          tokenTag === "base" ? baseAmount : targetAmount
        );
      } catch (e) {
        console.error(e);
      }
      setBaseMultiply(baseMultiply);
      setBaseContract(baseCon);
      setTargetContract(targetCon);
      setTargetDec(targetDecimal);
      setBaseDec(baseDecimal);
      tokenTag === "base"
        ? await fetchBalance(tokenTag)
        : await fetchBalance(tokenTag);

      let prices = [];
      let price;

      for (let path = 0; path < paths.length; path++) {
        try {
          price = await web3.routerContract.getAmountsOut(
            amountIn,
            paths[path].map((data) => data.address)
          );
          const otherPrice = Number(price[price.length - 1] / multiply);
          prices.push(otherPrice);
        } catch (error) {
          console.error("getAmountsOut: ", error);
          continue;
        }
      }
      price = arrayMax(prices);
      const bestPath = paths[prices.indexOf(price)];
      setPath(bestPath);
      tokenTag === "base" ? setTargetAmount(price) : setBaseAmount(price);
    } else {
      setBaseAmount("");
      setTargetAmount("");
    }
  };

  useEffect(() => {
    console.log(options)
    typeof window.ethereum === "undefined" || web3?.message === "Error"
      ? setIsDisabled(true)
      : setIsDisabled(false);
    
    setOptions(
      web3?.message === "Error" || !tokens
        ? web3?.network?.tokens.map((data) => {
            const disabled =
              base.value[0] === data[0] || target.value[0] === data[0]
                ? true
                : false;
            return {
              value: [data[0], data[2]],
              label: data[3],
              image: data[1],
              name: data[2],
              disabled,
            };
          })
        : tokens.map((data, i) => {
            const disabled =
              base.value[0] === data.address || target.value[0] === data.address
                ? true
                : false;
                
            return {
              value: [data.address, data.name],
              label: data.symbol.toUpperCase(),
              image: data.image,
              name: data.name,
              id: data.id,
              disabled,
            };
          })
    );
  }, [base, target, tokens]);

  const notify = (msg, id) => {
    const success = () =>
      toast.success(msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        toastId: id,
      });

    const error = () =>
      toast.error(msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        toastId: id,
      });
    if (id === "approved") {
      success();
      setApproved(true);
    } else if (id === "swap") {
      success();
      setTimeout(() => {
        setBaseAmount("");
        setTargetAmount("");
        setApproved(false);
        setSwapped(false);
        setPath([]);
      }, 5000);
    } else if (id === "insufficient" || id === "error" || id === "revert") {
      error();
      setApproved(false);
      setSwapped(false);
    }
  };

  // useEffect(() => {
  //   setActivate(!activate);
  // }, [show]);

  useEffect(() => {
    if (
      (approved === true && swapped === false) ||
      typeof approved === "string"
    ) {
      approved === true
        ? notify("Approval Successfully Initiated!", "approved")
        : approved.toLowerCase().includes("insufficient funds")
        ? notify("Insufficient Funds", "insufficient")
        : approved.toLowerCase().includes("denied transaction")
        ? notify("User Reverted Transaction!", "revert")
        : notify("Unknown Error: See Console!", "error");
    } else if (swapped === true || typeof swapped === "string") {
      swapped === true
        ? notify("Swap Successfully Initiated!", "swap")
        : swapped.toLowerCase().includes("insufficient funds")
        ? notify("Insufficient Funds", "insufficient")
        : swapped.toLowerCase().includes("denied transaction")
        ? notify("User Reverted Transaction!", "revert")
        : notify("Unknown Error: See Console!", "error");
    }
  }, [approved, swapped]);

  useEffect(() => {
    setPath([]);
    setLoading("Estimate?");
  }, [tokenTag]);

  const delay = (dur) => {
    setIsDisabled(true);
    setTimeout(() => setIsDisabled(false), dur);
  };
  const refreshFrame = async (dur) => {
    setActivate(false);
    await setTimeout(async () => await setActivate(true), dur);
  };

  const toggleTokenData = async (changePage) => {
    if (changePage) {
      const store = await TokenStore.tokenData;
      setTokenData(store);
      setTokenCheck(store[store.length - 1]?.market_data.current_price.usd > 0);
      setShow(!show);
      setTokenIndex(store.length - 1);
      await refreshFrame(500);
    } else {
      setTokenData(TokenStore.tokenData);
      await refreshFrame(500);
    }
  };

  const changeTokenName = async (i) => {
    setTokenName(`${tokenData[i].name.split(" ").slice(0, 2).join(" ")}`);
    setTokenIndex(i);
    return null;
  };
  return (
    <>
    <div style={{marginLeft: "50px"}}>
      <Text animator={{ animate: false }} as="h1">Swap</Text>
      </div>
    <div className="grid grid-cols-1 justify-center">
      <div className="col-span-1">
      <FrameCorners
       palette={
         typeof window.ethereum === "undefined" ||
         web3.network.networkName === "Error" ||
         isDisabled
           ? "error"
           : !!(tokenCheck && show)
           ? "secondary"
           : "primary"
       }
       animator={{ activate }}
       cornerLength={22}
       hover
     >
       <div className="grid grid-cols-8">
         {!(typeof window.ethereum === "undefined") ||
         !(web3?.network?.networkName === "Error") ? (
           <div className="col-span-1 flex">
             {!show ? (
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 fill="none"
                 viewBox="0 0 24 24"
                 strokeWidth={2}
                 stroke="#ffa76c"
                 className={`w-6 h-6 m-2 ${
                   isDisabled || !isShowable ? "hidden" : `cursor-pointer`
                 }`}
                 onClick={async () => {
                   if (!isDisabled && !!tokens[2]?.last) {
                     setShow(!show);
                     toggleTokenData();
                   }
                 }}
               >
                 <path
                   strokeLinecap="round"
                   strokeLinejoin="round"
                   d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                 />
               </svg>
             ) : (
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 className={`w-6 h-6 m-2 ${
                   isDisabled ? "" : "cursor-pointer"
                 }`}
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke="currentColor"
                 strokeWidth={2}
                 onClick={async () => {
                   if (!isDisabled) {
                     setShow(!show);
                     toggleTokenData();
                   }
                 }}
               >
                 <path
                   strokeLinecap="round"
                   strokeLinejoin="round"
                   d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                 />
               </svg>
             )}
           </div>
         ) : (
           <></>
         )}

         <div
           onClick={() =>
             typeof window.ethereum === "undefined" ||
             web3.message === "Error"
               ? window.location.reload()
               : show
               ? window.open(
                   `${tokenData[tokenIndex].links.homepage[0]}`,
                   "_blank"
                 )
               : window.open(`${web3?.network?.link}`, "_blank")
           }
           className="col-span-6 flex flex-nowrap justify-center p-2"
         >
           <img
             src={
               show
                 ? tokenData[tokenIndex]?.image?.large
                 : web3?.network?.img
             }
             className={
               web3?.message === "Error" ||
               typeof window.ethereum === "undefined"
                 ? "hidden"
                 : "h-6 w-6"
             }
             alt=""
           ></img>
           <svg
             xmlns="http://www.w3.org/2000/svg"
             className={
               web3?.message === "Error" ||
               typeof window.ethereum === "undefined"
                 ? "h-7 w-7"
                 : "hidden"
             }
             fill="none"
             viewBox="0 0 24 24"
             stroke="#e24a0f"
             strokeWidth={2}
           >
             <path
               strokeLinecap="round"
               strokeLinejoin="round"
               d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
             />
           </svg>

           <a
             href={
               web3?.message === "Error" ||
               typeof window.ethereum === "undefined"
                 ? ""
                 : web3?.network?.link
             }
             rel="noreferrer"
             target="_blank"
           >
             &nbsp;
             <Text
               className={
                 isDisabled
                   ? "text-xl font-bold text-orange-600"
                   : "text-xl font-bold cursor-pointer"
               }
               onClick={() =>
                 web3?.message === "Error" ||
                 typeof window.ethereum === "undefined"
                   ? window.location.reload()
                   : null
               }
             >
               {" "}
               &nbsp;
               {typeof window.ethereum === "undefined"
                 ? `MetaMask Not Detected`
                 : web3?.message === "Error" &&
                   web3?.chainList.includes(web3.chainId)
                 ? `Wallet Not Connected`
                 : !web3?.chainList.includes(web3.chainId)
                 ? `Unsupported Network`
                 : show
                 ? `${tokenData[tokenIndex].name
                     .split(" ")
                     .slice(0, 2)
                     .join(" ")}`
                 : `${web3?.network?.name}`}
             </Text>
           </a>
         </div>
         <div className="col-span-1 flex">
           <img
             className={`${
               !isShowable ? "hidden" : ""
             } w-6 h-6 mt-2 opacity-70  cursor-pointer`}
             onClick={() =>
               window.open("https://www.coingecko.com/en/api", "_blank")
             }
             src={geckoImg}
             alt="coingecko api"
           ></img>
         </div>
       </div>

       {/* ----- ternary for market/swap ----- */}
       {!show ? (
         <>
           {!(typeof window.ethereum === "undefined") &&
           web3?.message !== "Error" &&
           tokens[2].hasOwnProperty("last") ? (
             <StoppableMarquee
               toggleData={toggleTokenData}
               tokens={tokens}
               show={show}
               delay={delay}
               usDollar={web3.usDollar}
               address={web3.address}
             />
           ) : !(typeof window.ethereum === "undefined") &&
             web3?.message !== "Error" ? (
             <div className={`grid-cols-6 gap-4 h-5 mb-2 pb-1`}>
               <LoadingBars animator={true} size={0.5} speed={5} />
             </div>
           ) : (
             <></>
           )}
           <div className={`flex flex-nowrap justify-center`}>
             <Select
               isDisabled={isDisabled}
               placeholder="Base..."
               styles={customStyles}
               className="w-40 hover:border-transparent shadow-none"
               value={base}
               components={{
                 IndicatorSeparator: () => null,
               }}
               onChange={(e) => {
                 setBaseAmount("");
                 setTargetAmount("");
                 setApproved(false);
                 setSwapped(false);
                 e.value[0] === target.value[0]
                   ? setBase(target)
                   : setBase(e);
                 setPath([]);
               }}
               options={options}
               formatOptionLabel={(token) =>
                 typeof window.ethereum === "undefined" ? (
                   <div
                     className="flex flex-nowrap justify-start"
                     title={"Network Error!"}
                   >
                     <svg
                       xmlns="http://www.w3.org/2000/svg"
                       className={
                         typeof window.ethereum === "undefined"
                           ? "h-5 w-5"
                           : "hidden"
                       }
                       fill="none"
                       viewBox="0 0 24 24"
                       stroke="#e24a0f"
                       strokeWidth={1}
                     >
                       <path
                         strokeLinecap="round"
                         strokeLinejoin="round"
                         d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                       />
                     </svg>
                     &nbsp;&nbsp;
                     <Text>{"Base"}</Text>
                   </div>
                 ) : (
                   <div
                     key={token.value}
                     onClick={
                       token.value[0] === target.value[0] ||
                       token.value[0] === base.value[0]
                         ? () => setBase(base)
                         : () => setBase(token)
                     }
                     className=" flex flex-nowrap justify-start"
                     title={token.name}
                   >
                     <img
                       className="w-5 h-5"
                       src={token?.image}
                       alt={token.label}
                     />
                     &nbsp;&nbsp;
                     <span>{token?.label?.slice(0, 6)}</span>
                   </div>
                 )
               }
               isOptionDisabled={(option) => option.disabled}
             />
             <input
               placeholder={!!targetAmount ? loading : "Base"}
               disabled={isDisabled}
               id="base"
               onChange={(e) => {
                 setTokenTag(e.target.value > 0 ? "base" : false);
                 setBaseAmount(!!e.target.value ? e.target.value : "");
                 setTargetAmount("");
                 setPath([]);
                 setLoading("Estimate?");
               }}
               value={baseAmount}
               className="border disabled:border-orange-600 disabled:placeholder:text-orange-600 w-28 max-w-full h-10 hover:border-teal-200"
               type="number"
               min="0"
               step={1}
             ></input>
             <Button
               disabled={isDisabled}
               onClick={async () => {
                 setBaseAmount(await fetchBalance("base"));
                 setTargetAmount("");
                 setLoading("Estimate?");
                 setTokenTag("base");
                 setApproved(false);
                 setSwapped(false);
                 setPath([]);
               }}
               FrameComponent={FramePentagon}
               palette="secondary"
               animator={true}
               className="h-10"
             >
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 fill="none"
                 viewBox="0 0 24 24"
                 strokeWidth={1.5}
                 stroke="currentColor"
                 className="w-5 h-5"
               >
                 <path
                   strokeLinecap="round"
                   strokeLinejoin="round"
                   d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
                 />
               </svg>
             </Button>
           </div>

           <div className="flex flex-nowrap justify-between">
             <div
               className="flex flex-nowrap"
               onClick={() => setUseWeth(!useWeth)}
             >
               {!isDisabled &&
               [
                 base.label.toUpperCase(),
                 target.label.toUpperCase(),
               ].includes(web3.network.tokens[0][3].toUpperCase()) ? (
                 !useWeth ? (
                   <div className="flex flex-nowrap ml-2  mt-1">
                     <svg
                       xmlns="http://www.w3.org/2000/svg"
                       fill="none"
                       viewBox="0 0 24 24"
                       strokeWidth={1.5}
                       stroke="currentColor"
                       className="cursor-pointer w-4 h-4 m-1"
                     >
                       <path
                         strokeLinecap="round"
                         strokeLinejoin="round"
                         d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                       />
                     </svg>
                     <div className="cursor-pointer text-xs m-1">
                       {web3.network.tokens[0][3].toUpperCase().slice(1)}
                     </div>
                   </div>
                 ) : (
                   <div className="flex flex-nowrap ml-2 mt-1">
                     <svg
                       xmlns="http://www.w3.org/2000/svg"
                       fill="none"
                       viewBox="0 0 24 24"
                       strokeWidth={1.5}
                       stroke="currentColor"
                       className="cursor-pointer w-4 h-4 m-1"
                     >
                       <path
                         strokeLinecap="round"
                         strokeLinejoin="round"
                         d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                       />
                     </svg>
                     <div className="cursor-pointer text-xs m-1">
                       {web3.network.tokens[0][3].toUpperCase()}
                     </div>
                   </div>
                 )
               ) : (
                 <></>
               )}
             </div>

             <div className="flex flex-nowrap mr-36">
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 className={`h-5 w-5 ${
                   isDisabled ? "cursor-default" : "cursor-pointer"
                 } m-2 transition-transform duration-200 ${
                   isRotated ? "rotate-180" : "rotate-0"
                 }`}
                 onClick={() => {
                   if (!isDisabled) {
                     setIsRotated(!isRotated);
                     setBaseAmount("");
                     setTargetAmount("");
                     switchTokens();
                     setApproved(false);
                     setPath([]);
                   }
                 }}
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke={isDisabled ? "#e24a0f" : "currentColor"}
                 strokeWidth={2}
               >
                 <path
                   strokeLinecap="round"
                   strokeLinejoin="round"
                   d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                 />
               </svg>
             </div>
           </div>

           <div className={`flex flex-nowrap justify-center`}>
             <Select
               isDisabled={isDisabled}
               placeholder="Target..."
               styles={customStyles}
               className="w-40 hover:border-transparent shadow-none"
               value={target}
               components={{
                 IndicatorSeparator: () => null,
               }}
               onChange={(e) => {
                 setBaseAmount("");
                 setTargetAmount("");
                 setApproved(false);
                 setSwapped(false);
                 e.value[0] === base.value[0]
                   ? setTarget(base)
                   : setTarget(e);
                 setPath([]);
               }}
               options={options}
               formatOptionLabel={(token) =>
                 typeof window.ethereum === "undefined" ? (
                   <div
                     className=" flex flex-nowrap justify-start"
                     title={"Network Error!"}
                   >
                     <svg
                       xmlns="http://www.w3.org/2000/svg"
                       className={
                         typeof window.ethereum === "undefined"
                           ? "h-5 w-5 hover:underline hover:text-white"
                           : "hidden"
                       }
                       fill="none"
                       viewBox="0 0 24 24"
                       stroke="#e24a0f"
                       strokeWidth={2}
                     >
                       <path
                         strokeLinecap="round"
                         strokeLinejoin="round"
                         d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                       />
                     </svg>
                     &nbsp;&nbsp;
                     <Text>{"Target"}</Text>
                   </div>
                 ) : (
                   <div
                     onClick={
                       token?.value[0] === target?.value[0] ||
                       token?.value[0] === base?.value[0]
                         ? () => setTarget(target)
                         : () => setTarget(token)
                     }
                     className=" flex flex-nowrap justify-start"
                     title={token?.name}
                   >
                     <img
                       className="w-5 h-5"
                       src={token?.image}
                       alt={token?.label}
                     />
                     &nbsp;&nbsp;
                     <span>{token?.label?.slice(0, 6)}</span>
                   </div>
                 )
               }
               isOptionDisabled={(option) => option.disabled}
             />
             <input
               disabled={isDisabled}
               placeholder={!!baseAmount ? loading : "Target"}
               id="target"
               onChange={(e) => {
                 setTokenTag(e.target.value > 0 ? "target" : false);
                 setTargetAmount(e.target.value);
                 setBaseAmount("");
                 setPath([]);
                 setLoading("Estimate?");
               }}
               className="border disabled:border-orange-600 disabled:placeholder:text-orange-600 w-28 max-w-full h-10 hover:border-teal-200"
               value={targetAmount}
               type="number"
               min="0"
             ></input>
             <Button
               disabled={isDisabled}
               onClick={async () => {
                 setTargetAmount(await fetchBalance(targetDec, "target"));
                 setBaseAmount("");
                 setLoading("Estimate?");
                 setTokenTag("target");
                 setApproved(false);
                 setSwapped(false);
                 setPath([]);
               }}
               FrameComponent={FramePentagon}
               palette="secondary"
               animator={false}
               className="h-10"
             >
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 fill="none"
                 viewBox="0 0 24 24"
                 strokeWidth={1.5}
                 stroke="currentColor"
                 className="w-5 h-5"
               >
                 <path
                   strokeLinecap="round"
                   strokeLinejoin="round"
                   d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
                 />
               </svg>
             </Button>
           </div>
           <Paths
             path={path}
             target={target}
             base={base}
             isDisabled={isDisabled}
             toggleData={toggleTokenData}
             address={web3?.address}
           />
           <div className="flex flex-nowrap justify-center h-10">
                         <Button
               disabled={isDisabled}
               onClick={() => {
                 setBaseAmount("");
                 setTargetAmount("");
                 setApproved(false);
                 setSwapped(false);
                 setPath([]);
                 delay(300);
               }}
               FrameComponent={FrameBox}
               title="Reset fields and approval."
               palette="secondary"
               animator={false}
               className="h-10"
             >
               <div>
                 <svg
                   xmlns="http://www.w3.org/2000/svg"
                   className="h-5 w-5"
                   fill="none"
                   viewBox="0 0 24 24"
                   stroke="currentColor"
                   strokeWidth={2}
                 >
                   <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                   />
                 </svg>
                 <p />
               </div>
             </Button>
             <Button
               onClick={async () => {
                 setIsDisabled(true);

                 !!path.length ? await getApproval() : await fetchPaths();
                 delay(300);
               }}
               disabled={isDisabled}
               FrameComponent={FramePentagon}
               palette="secondary"
               animator={false}
               className="h-10 w-28"
             >
               {" "}
               <Text>{btnLabel}</Text>
             </Button>

           </div>
         </>
       ) : (
         <Chart
           data={tokenData}
           show={show}
           tokenI={changeTokenName}
           usDollar={web3.usDollar}
         />
       )}

       <center>
         <div
           onClick={() =>
             typeof window.ethereum === "undefined" ||
             web3.message === "Error"
               ? window.location.reload()
               : null
           }
           className="flex flex-nowrap align-center justify-center p-2"
         >
           <a
             href={
               typeof window.ethereum === "undefined" ||
               web3.message === "Error"
                 ? ""
                 : `${web3.network.explorer}address/${web3.address}`
             }
             rel="noreferrer"
             target="_blank"
           >
             <svg
               xmlns="http://www.w3.org/2000/svg"
               className={
                 typeof window.ethereum === "undefined" ||
                 web3.message === "Error"
                   ? "hidden"
                   : isDisabled
                   ? "h-5 w-5 text-orange-600"
                   : "h-5 w-5 cursor-pointer"
               }
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor"
               strokeWidth={2}
             >
               <path
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
               />
             </svg>
             <svg
               xmlns="http://www.w3.org/2000/svg"
               className={
                 typeof window.ethereum === "undefined" ||
                 web3.message === "Error"
                   ? "h-5 w-5"
                   : "hidden"
               }
               fill="none"
               viewBox="0 0 24 24"
               stroke="#e24a0f"
               strokeWidth={2}
             >
               <path
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
               />
             </svg>
           </a>
           <a
             href={
               typeof window.ethereum === "undefined" ||
               web3.message === "Error"
                 ? ""
                 : `${web3.network.explorer}address/${web3.address}`
             }
             rel="noreferrer"
             target="_blank"
           >
             <Text
               className={
                 typeof window.ethereum === "undefined" ||
                 web3.message === "Error"
                   ? " cursor-pointer font-bold text-sm text-orange-600 hover:text-orange-500 hover:underline"
                   : isDisabled
                   ? "font-bold text-sm text-orange-600"
                   : "cursor-pointer text-sm font-bold "
               }
             >
               &nbsp;
               {typeof window.ethereum === "undefined" ||
               web3.message === "Error"
                 ? "Address Not Found"
                 : web3.message}
             </Text>
           </a>
         </div>
       </center>
     </FrameCorners>
      </div>
         
          <br />

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            className="font-bold"
          />
   </div> </>
  );
};

export default Swap;
