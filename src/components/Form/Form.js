import React, { useState, useEffect } from "react";
import {
  TextField,
  Typography,
  Paper,
  Slider,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@material-ui/core";
import Select from "react-select";
import { customStyles } from "../../constants/theme.constants";
import { useDispatch, useSelector } from "react-redux";
import FileBase from "react-file-base64";
import { useNavigate } from "react-router-dom";
import ChipInput from "material-ui-chip-input";
import "./Form.css";
import {
  Text,
  Button,
  FramePentagon,
  FrameCorners,
  FrameBox,
} from "@arwes/core";
import StrategyFactoryAbi from "../assets/StrategyFactoryAbi.json";
import ClientStrategyAbi from "../assets/ClientStrategyAbi.json";
import { createPost, updatePost } from "../../actions/posts";
import { getOhlc } from "../services/gecko.service";
import { fibonacci, projectTime } from "../services/tactics";
import {
  toChecksumAddress,
  getBothPaths,
} from "../services/transactions.service";
import useStyles from "./styles";
import { ethers } from "ethers";
import ERC20 from "./../assets/ERC20.json";
import {
  ContactlessOutlined,
  LocalConvenienceStoreOutlined,
} from "@material-ui/icons";
import { set } from "animejs";
import Web3 from "web3";

const Form = ({ currentId, setCurrentId, web3 }) => {
  const fibDivs = [
     ["100", "50", "20", "10", "5"],
    ["50", "20", "10", "5", "2"]
  ];
  let defaultSelection = {
    value: [web3?.network?.tokens[0][0], web3?.network?.tokens[0][2]],
    label: web3?.network?.tokens[0][3].toUpperCase(),
    image: web3?.network?.tokens[0][1],
    name: web3?.network?.tokens[0][2],
    id: web3?.network?.tokens[0][4],
  };
  const [fibdivIndex, setFibdivIndex] = useState(null);
  const [strategy, setStrategy] = useState({
    base: toChecksumAddress("0x2791bca1f2de4661ed88a30c99a7a9449aa84174"),
    fibDivs: null,
  });
  const [disable, setDisable] = useState(false);
  const [timeFrame, setTimeFrame] = useState(null);
  const [postData, setPostData] = useState({
      title: web3?.network?.tokens[0][2],
      token: defaultSelection,
      message: "",
      strategy: {},
      selectedFile: web3?.network?.tokens[0][1],
    }),
    [options, setOptions] = useState(
      web3?.network?.tokens.slice(0, 6).map((data) => {
        const disabled = postData.title === data[0] ? true : false;
        return {
          value: [data[0], data[2]],
          label: data[3].toUpperCase(),
          image: data[1],
          name: data[2],
          id: data[4],
          disabled,
        };
      })
    );
  const post = useSelector((state) =>
    currentId
      ? state.posts.posts.find((message) => message._id === currentId)
      : null
  );
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem("profile"));
  const navigate = useNavigate();

  const clear = () => {
    setCurrentId(0);
    setPostData({
      title: web3?.network?.tokens[0][2],
      token: defaultSelection,
      message: "",
      strategy: {},
      selectedFile: web3?.network?.tokens[0][1],
    });
    setFibdivIndex(null);
    setTimeFrame(null);
  };

  const createStrategy = async (e) => {
    setPostData({ ...postData, token: postData.token });
    setDisable(true);
    let strategyContract, indicators, timestamps, isClient0;
    const factoryAddress0 = toChecksumAddress(
      "0xc058aB1743436d76e60f52F424bBfFa1956A0910"
    );
    try {
      const prices = await getOhlc(postData.token.id, timeFrame);
      indicators = fibonacci(prices?.priceList, 6);
      timestamps = projectTime(prices?.last, timeFrame, 20);
    } catch (err) {
      console.error(err);
    }
    let strategyAddress;

    try {
      const paths = await getBothPaths(web3, postData?.token);
      let strategyResponse;
      if (currentId) {
        try {
          strategyContract = new ethers.Contract(
            postData.strategy.strategyAddress,
            ClientStrategyAbi,
            web3.signer
          );

          strategyResponse = await strategyContract.updateStrategy(
            indicators.diffFibs,
            strategy.fibDivs,
            timestamps,
            indicators.currentSMA,
            paths.bestBuyPath.map((token) => token.address),
            paths.bestSellPath.map((token) => token.address)
          );
        } catch (err) {}

        if (strategyResponse) {
          const updatedStrategy = {
            ...strategy,
            target: postData?.token?.value[0],
            fibs: indicators.diffFibs,
            timestamps,
            sma: indicators.currentSMA,
            strategyAddress: postData.strategy.strategyAddress,
            index: postData.strategy.index,
            owner: web3.address,
            timeFrame,
            buyPath: paths.bestBuyPath.map((token) => token.address),
            sellPath: paths.bestSellPath.map((token) => token.address),
          };

          await handleSubmit(e, updatedStrategy, postData.token);
          setDisable(false);
        }
      } else {
        try {
          strategyContract = new ethers.Contract(
            factoryAddress0,
            StrategyFactoryAbi,
            web3.signer
          );
          let length = await strategyContract.getStrategyLength();
          length = await strategyContract.getStrategyLength();
          strategyResponse = await strategyContract.createClientStrategy(
            indicators.diffFibs,
            strategy.fibDivs,
            timestamps,
            indicators.currentSMA,
            paths.bestBuyPath.map((token) => token.address),
            paths.bestSellPath.map((token) => token.address)
          );
          if (strategyResponse) {
            let index = null;
            for (
              let x = length > 0 ? length - 1 : length;
              x < length + 20;
              x++
            ) {
              const address = await strategyContract.clients(x);
              if (address === web3.address) {
                strategyAddress = await strategyContract.strategies(x);
                index = x;
                break;
              }
            }

            const updatedStrategy = {
              ...strategy,
              target: postData?.token?.value[0],
              fibs: indicators.diffFibs,
              timestamps,
              sma: indicators.currentSMA,
              strategyAddress,
              index,
              owner: web3.address,
              timeFrame,
              buyPath: paths.bestBuyPath.map((token) => token.address),
              sellPath: paths.bestSellPath.map((token) => token.address),
            };
            await handleSubmit(e, updatedStrategy, postData.token);
            setDisable(false);
          }
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      console.log(err);
      setDisable(false);
    }
    setDisable(false);
  };

  useEffect(() => {
    if (!post?.title) clear();
    if (post) setPostData(post);
  }, [post]);

  useEffect(() => {
    defaultSelection = {
      value: [web3?.network?.tokens[0][0], web3?.network?.tokens[0][2]],
      label: web3?.network?.tokens[0][3].toUpperCase(),
      image: web3?.network?.tokens[0][1],
      name: web3?.network?.tokens[0][2],
      id: web3?.network?.tokens[0][4],
    };
    setOptions(
      web3?.network?.tokens.slice(0, 6).map((data) => {
        const disabled = postData.title === data[0] ? true : false;
        return {
          value: [data[0], data[2]],
          label: data[3].toUpperCase(),
          image: data[1],
          name: data[2],
          id: data[4],
          disabled,
        };
      })
    );
    setPostData({
      title: web3?.network?.tokens[0][2],
      token: defaultSelection,
      message: "",
      strategy: {},
      selectedFile: web3?.network?.tokens[0][1],
    });
  }, [web3]);

  const handleSubmit = async (e, strategy, token) => {
    e.preventDefault();

    if (currentId === 0) {
      dispatch(
        createPost(
          { ...postData, token, strategy, name: user?.result?.name },
          navigate
        )
      );
      clear();
    } else {
      dispatch(
        updatePost(currentId, {
          ...postData,
          token,
          strategy,
          name: user?.result?.name,
        })
      );
      clear();
    }
  };

  if (!user?.result?.name) {
    return (
      <FrameBox palette="error" animator={true}>
        <Text as="a">Please sign in to create and like posts.</Text>
      </FrameBox>
    );
  }

  return (
    <FrameCorners
      palette={!!web3?.address && web3?.chainId === 137 ? "primary" : "error"}
      animator={true}
      cornerLength={22}
      style={{ width: "300px" }}
    >
      <h5>
        <strong>
          <Text as={"a"}>
            {web3?.chainId === 137
              ? currentId
                ? `Editing "${post?.title}"`
                : "Create Strategy"
              : "Switch To Polygon"}
          </Text>
        </strong>
      </h5>

      <Select
        isDisabled={
          !!web3?.address && !disable && web3?.chainId === 137 ? false : true
        }
        placeholder="Target..."
        styles={customStyles}
        className="w-40 hover:border-transparent shadow-none"
        value={postData.token}
        components={{
          IndicatorSeparator: () => null,
        }}
        onChange={(e) =>
          setPostData({
            ...postData,
            title: e.name,
            token: e,
            selectedFile: e.image,
          })
        }
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
                  typeof window.ethereum === "undefined" ? "h-5 w-5" : "hidden"
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
              key={token}
              onClick={
                token === postData.token
                  ? () => setPostData({ ...postData })
                  : () =>
                      setPostData({
                        ...postData,
                        token,
                        title: token.name,
                        selectedFile: token.image,
                      })
              }
              className=" flex flex-nowrap justify-start"
              title={token.name}
            >
              <img className="w-5 h-5" src={token?.image} alt={token.label} />
              &nbsp;&nbsp;
              <span>{token?.label?.slice(0, 6)}</span>
            </div>
          )
        }
        isOptionDisabled={(option) => option.disabled}
      />
      <p />

      <FormControl>
        <strong>
          <Text as="a">SMA</Text>
        </strong>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)}
        >
          <FormControlLabel
            value="1"
            control={
              <Radio
                disabled={
                  !!web3?.address && !disable && web3?.chainId === 137
                    ? false
                    : true
                }
                color="default"
              />
            }
            label="20 Day"
          />
          <FormControlLabel
            value="7"
            control={
              <Radio
                disabled={
                  !!web3?.address && !disable && web3?.chainId === 137
                    ? false
                    : true
                }
                color="default"
              />
            }
            label="20 Week"
          />
        </RadioGroup>
      </FormControl>
      <FormControl>
        <strong>
          <Text as="a">RISK</Text>
        </strong>

        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={fibdivIndex}
          onChange={(e) => {
            setFibdivIndex(e.target.value);
            setStrategy({
              ...strategy,
              fibDivs: fibDivs[Number(e.target.value)],
            });
          }}
        >
          <FormControlLabel
            value="0"
            control={
              <Radio
                disabled={
                  !!web3?.address && !disable && web3?.chainId === 137
                    ? false
                    : true
                }
                color="default"
              />
            }
            label="Conservative"
          />
          <FormControlLabel
            value="1"
            control={
              <Radio
                disabled={
                  !!web3?.address && !disable && web3?.chainId === 137
                    ? false
                    : true
                }
                color="default"
              />
            }
            label="Aggressive"
          />
        </RadioGroup>
      </FormControl>
      {/* <p />
      <textarea
        disabled={
          !!web3?.address && !disable && web3?.chainId === 137 ? false : true
        }
        style={{ margin: "10px 0" }}
        name="message"
        rows="3"
        variant="outlined"
        placeholder="Message"
        fullWidth
        multiline
        minRows={4}
        value={postData.message}
        onChange={(e) => setPostData({ ...postData, message: e.target.value })}
      /> */}

      <p />
      <Button
        disabled={
          !!web3?.address && !disable && web3?.chainId === 137 ? false : true
        }
        FrameComponent={FrameBox}
        palette="secondary"
        onClick={() => clear()}
      >
        Clear
      </Button>
      <Button
        disabled={
          !!timeFrame &&
          !!fibdivIndex &&
          !disable &&
          web3?.address &&
          web3?.chainId === 137
            ? false
            : true
        }
        FrameComponent={FramePentagon}
        palette="secondary"
        onClick={async (e) => {
          if (timeFrame) {
            await createStrategy(e);
          }
        }}
      >
        {"Create"}
      </Button>
      <p />
    </FrameCorners>
  );
};

export default Form;
