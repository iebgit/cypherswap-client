import React, { useEffect, useState } from 'react';
import { Paper, Typography, CircularProgress, Divider } from '@material-ui/core/';
import { useDispatch, useSelector } from 'react-redux';
import ClientStrategyAbi from '../assets/ClientStrategyAbi.json'
import { ethers } from 'ethers';
import moment from 'moment';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Figure,
  LoadingBars,
  Text,
  Card,
  Button,
  FramePentagon,
  FrameCorners,
  FrameBox, Table, FrameHexagon
} from '@arwes/core'
import { getPost, getPostsBySearch, getCommentsById } from '../../actions/posts';
import { getCurrentPrice, sendEthTransaction, sendTransaction, withdrawEthTransaction, withdrawTransaction } from "./../services/transactions.service"
import CommentSection from './CommentSection';
import useStyles from './styles';

const Post = ({ web3 }) => {
  const { post, posts, isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const [comments, setComments] = useState(post?.comments);
  const navigate = useNavigate();
  const classes = useStyles();
  const { id } = useParams();
  const [currentPrice, setCurrentPrice] = useState(0)
  const [until, setUntil] = useState(0)
  const [tokenBalances, setTokenBalances] = useState([])
  const [baseAmount, setBaseAmount] = useState({ send: null, withdraw: null })
  const [targetAmount, setTargetAmount] = useState({ send: null, withdraw: null })
  const [trade, setTrade] = useState(0)



  const headers = [
    { id: 'a', data: 'SMA' },
    { id: 'b', data: '0.382' },
    { id: 'c', data: '0.5' },
    { id: 'd', data: '0.618' },
    { id: 'e', data: '0.786' }
  ];

  const [fib, setFib] = useState(post?.strategy.fibs[0] ? post?.strategy.fibs[0].map((price) => (Number(price) / 1000000).toFixed(2)) : [])
  const columnWidths = ['20%', '20%', '20%', '20%', "20%"];


  useEffect(() => {
    dispatch(getPost(id))
  }, [id]);

  useEffect(() => {
    if (post && web3?.chainId == 137) {
      const getPrice = async () => {
        setComments(await dispatch(getCommentsById([post._id])))
        const price = await getCurrentPrice(web3, post.token)
        if (price) {
          formatSeconds()
          setCurrentPrice(price)
          const fib = Number(post.strategy.sma) / 1000000 > price ? post.strategy.fibs[1].map((price) => (Number(price) / 1000000).toFixed(2)) : post.strategy.fibs[0].map((price) => (Number(price) / 1000000).toFixed(2));
          setFib(fib);
          setTokenBalances(await getTokenBalances());
          await ping();
        }


      }
      getPrice()
    }
  }, [post])

  useEffect(() => {
    let interId;
    if (post && web3?.chainId === 137) {
      interId = setInterval(async () => {
        if (web3?.chainId !== 137) {

          navigate("/home")

        } else {
          setComments(await dispatch(getCommentsById([post._id])))
          const price = await getCurrentPrice(web3, post.token)
          if (price) {
            formatSeconds()
            setCurrentPrice(price)
            const fib = Number(post.strategy.sma) / 1000000 > price ? post.strategy.fibs[1].map((price) => (Number(price) / 1000000).toFixed(2)) : post.strategy.fibs[0].map((price) => (Number(price) / 1000000).toFixed(2));
            setFib(fib);
            setTokenBalances(await getTokenBalances());
            await ping()
          }

        }

      }, 2000);
      return () => { clearInterval(interId); setCurrentPrice(0) }
    }
  }, [post]);

  useEffect(() => {
    if (web3?.chainId !== 137) {
      navigate("/home")

    }

  }, [web3])


  // useEffect(() => {
  //   if (post) {
  //     dispatch(getPostsBySearch({ search: 'none', tags: post?.tags.join(',') }));
  //   }
  // }, [post]);





  const openPost = (_id) => navigate(`/posts/${_id}`);

  // if (isLoading) {
  //   return (
  //     <>
  //     <LoadingBars animator={true} size={1} speed={6}/>
  //     </>
  //   );
  // }



  const recommendedPosts = posts?.filter(({ _id }) => _id !== post?._id);

  const getTokenBalances = async () => {
    let baseBalance;
    let targetBalance;
    try {
      const strategyContract = new ethers.Contract(
        post.strategy.strategyAddress,
        ClientStrategyAbi,
        web3.signer
      );
      baseBalance = await strategyContract.balance(post.strategy.base)

      targetBalance = post.strategy.target === web3.network.primaryTokens[0].address ? await strategyContract.ethBalance() : await strategyContract.balance(post.strategy.target)

    } catch (err) { console.log(err) }
    return [Number(baseBalance), Number(targetBalance)]
  }

  const getNextTimestamp = async (timestamps, currentTime) => {
    console.log(currentTime)
    console.log(await getStrategy())
    for (let x = 0; x < timestamps?.length - 1; x++) {
      if (Number(timestamps[x]) < currentTime && Number(timestamps[x + 1]) > currentTime) {
        if (Number(timestamps[x]) + 3600 > currentTime) {
          return "Trade! (+ 0.1 GEM)"
        } else {
          console.log(Number(timestamps[x]) - currentTime)
          return timestamps[x + 1]
        }
      }
    }
    return currentTime < Number(timestamps[0]) ? Number(timestamps[0]) : null;
  }

  const formatSeconds = async () => {
    const currentTime = await getCurrentTimestamp()
    const nextTs = await getNextTimestamp(post?.strategy.timestamps, Number(currentTime))
    if (nextTs === "Trade! (+ 0.1 GEM)") {
      setUntil(nextTs);
    } else {
      console.log(nextTs)
      const timeUntil = nextTs - currentTime
      console.log(timeUntil)
      const days = Number(moment.utc(timeUntil * 1000).format('DD')) - 1
      console.log(days)
      setUntil(timeUntil ? days.toString() + ":" + moment.utc(timeUntil * 1000).format('HH:mm:ss') : "Outdated Timestamps");
    }

  }

  const initiate = async () => {
    try {
      const strategyContract = new ethers.Contract(
        post.strategy.strategyAddress,
        ClientStrategyAbi,
        web3.signer
      );
      await strategyContract.initiate()
    } catch (err) { console.log(err) }
  }

  const ping = async () => {
    try {
      const strategyContract = new ethers.Contract(
        post.strategy.strategyAddress,
        ClientStrategyAbi,
        web3.signer
      );
      setTrade(await strategyContract.ping())

    } catch (err) { console.log(err) }
    return 0;
  }

  const getStrategy = async () => {
    try {
      const strategyContract = new ethers.Contract(
        post.strategy.strategyAddress,
        ClientStrategyAbi,
        web3.signer
      );
      let timestamp = await strategyContract.timestamp()
      timestamp = timestamp.toString()

      let ping = await strategyContract.ping()
      ping = ping.toString()
      const strategy = await strategyContract.getStrategy()
      const timestamps = strategy.timeStamps
      console.log(strategy)
      for (let x in timestamps) {
        console.log(timestamps[x].toString())
      }
      console.log({ timestamp, ping })
      console.log(post.strategy.timestamps)

    } catch (err) { console.log(err) }
    return 0;
  }

  const getCurrentTimestamp = async () => {
    try {
      const strategyContract = new ethers.Contract(
        post.strategy.strategyAddress,
        ClientStrategyAbi,
        web3.signer
      );
      let timestamp = await strategyContract.timestamp()
      return timestamp.toString()
    } catch (err) { console.log(err) }
    return 0;
  }

  const sendToken = async (value, erc20Address) => {
    await sendTransaction(post.strategy.strategyAddress, value, erc20Address, web3.signer)
  }

  const sendEth = async (value) => {
    await sendEthTransaction(post.strategy.strategyAddress, value, web3.signer)
  }

  const getWethAddress = async () => {
    const routerContract = new ethers.Contract(web3.routerAddress, web3.routerJson.abi, web3.signer)
    const wethAddress = await routerContract.WETH()
    return wethAddress
  }

  if (post) {

    return (
      <>
        <center>
          <Text as="h1">{post?.token.label}: ${currentPrice?.toFixed(6)}</Text>
        </center>
        <Card


          style={{ padding: '20px', borderRadius: '15px', FontFamily: "serif", backgroundColor: "transparent" }} elevation={6}>
          <div>
            <Text as="h5">Strategy</Text>
          </div>


          <FrameCorners
            palette="primary"
            animator={true}
            cornerLength={22}
            hover
            style={{ minWidth: "100%" }}
          >
            <div style={{ minWidth: "100%", padding: "20px", display: "flex", justifyContent: "space-between" }}>
              <div style={{ minWidth: "50%", maxWidth: "60%" }} className={classes.section}>

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <div>
                    <div style={{ fontSize: "20px" }}>
                      <Text as="a">

                        <Link to={`/creators/${post.name}`}>
                          <strong>
                            {` ${post.name}`}
                          </strong>
                        </Link>
                      </Text>&nbsp;

                    </div>
                    <small style={{ color: "white" }}>
                      <Text>{moment(post.createdAt).fromNow()}</Text>

                    </small>
                  </div>
                  <Button onClick={async () => until === "Trade! (+ 0.1 GEM)" ? await initiate() : ping()} disabled={until === "Trade! (+ 0.1 GEM)" ? false : true} size="small" palette={until === "Trade! (+ 0.1 GEM)" ? "primary" : "secondary"} FrameComponent={FrameHexagon} ><strong style={{ fontSize: '20px' }}>{until ? until : "Loading..."}</strong></Button>
                </div>
                <p />
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Text as="p">Interval: {post.strategy.timeFrame === "1" ? " Daily" : " Weekly"}</Text>
                    <Text as="p">Risk: {post.strategy.fibDivs[0] === "100" ? " Conservative" : " Aggressive"}</Text>
                  </div>
                  <Table
                    animator={{ animate: false }}
                    headers={headers}
                    dataset={[{
                      id: 0,
                      columns: [
                        { id: 'o', data: !!fib?.length ? '$' + fib[0] : 0.00 },
                        { id: 'p', data: !!fib?.length ? '$' + fib[1] : 0.00 },
                        { id: 'q', data: !!fib?.length ? '$' + fib[2] : 0.00 },
                        { id: 'r', data: !!fib?.length ? '$' + fib[3] : 0.00 },
                        { id: 's', data: !!fib?.length ? '$' + fib[4] : 0.00 }
                      ]
                    }, {
                      id: 1,
                      columns: [
                        { id: 'o', data: !!fib?.length ? currentPrice > post.strategy.sma ? '$' + ((tokenBalances[1] / post.strategy.fibDivs[0]) / 1000000).toString() : '$' + ((tokenBalances[0] / post.strategy.fibDivs[0]) / 1000000).toString() : 0.00 },
                        { id: 'p', data: !!fib?.length ? currentPrice > post.strategy.sma ? '$' + ((tokenBalances[1] / post.strategy.fibDivs[1]) / 1000000).toString() : '$' + ((tokenBalances[0] / post.strategy.fibDivs[1]) / 1000000).toString() : 0.00 },
                        { id: 'q', data: !!fib?.length ? currentPrice > post.strategy.sma ? '$' + ((tokenBalances[1] / post.strategy.fibDivs[2]) / 1000000).toString() : '$' + ((tokenBalances[0] / post.strategy.fibDivs[2]) / 1000000).toString() : 0.00 },
                        { id: 'r', data: !!fib?.length ? currentPrice > post.strategy.sma ? '$' + ((tokenBalances[1] / post.strategy.fibDivs[3]) / 1000000).toString() : '$' + ((tokenBalances[0] / post.strategy.fibDivs[3]) / 1000000).toString() : 0.00 },
                        { id: 's', data: !!fib?.length ? currentPrice > post.strategy.sma ? '$' + ((tokenBalances[1] / post.strategy.fibDivs[4]) / 1000000).toString() : '$' + ((tokenBalances[0] / post.strategy.fibDivs[4]) / 1000000).toString() : 0.00 }
                      ]
                    }
                    ]}
                    columnWidths={columnWidths}
                  />
                </div>
                <p />

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <Text as="a">USDC: ${tokenBalances?.length ? tokenBalances[0] / 1000000 : ""}</Text>&nbsp;
                    <input
                      style={{ margin: "10px 0" }}
                      name="deposit weth"
                      variant="outlined"
                      placeholder="Deposit"
                      value={baseAmount.send}
                      onChange={(e) => setBaseAmount({ ...baseAmount, send: e.target.value })}
                    />
                    <input
                      style={{ margin: "10px 0" }}
                      name="withdraw weth"
                      variant="outlined"
                      placeholder="Withdraw"
                      value={baseAmount.withdraw}
                      onChange={(e) => setBaseAmount({ ...baseAmount, withdraw: e.target.value })}
                    />
                    <Button FrameComponent={FrameBox} palette="secondary" onClick={async () => await withdrawTransaction(post.strategy.strategyAddress, ClientStrategyAbi, post.strategy.base, baseAmount.withdraw, web3.signer)}>Withdraw</Button>
                    <Button FrameComponent={FramePentagon} palette="primary" onClick={async () => await sendToken(baseAmount.send, post.strategy.base)}>Deposit</Button>
                  </div>
                  &nbsp;
                  <div>
                    <Text as="a">{post.token.label}: {tokenBalances?.length ? tokenBalances[1] : ""}</Text>
                    <input
                      style={{ margin: "10px 0" }}
                      name="deposit weth"
                      variant="outlined"
                      placeholder="Deposit"
                      value={targetAmount.send}
                      onChange={(e) => setTargetAmount({ ...targetAmount, send: e.target.value })}
                    />
                    <input
                      style={{ margin: "10px 0" }}
                      name="withdraw weth"
                      variant="outlined"
                      placeholder="Withdraw"
                      value={targetAmount.withdraw}
                      onChange={(e) => setTargetAmount({ ...targetAmount, withdraw: e.target.value })}
                    />
                    <Button FrameComponent={FrameBox} palette="secondary" onClick={async () => web3.network.primaryTokens[0].address === post.strategy.target ? await withdrawEthTransaction(post.strategy.strategyAddress, ClientStrategyAbi, targetAmount.withdraw, web3.signer) : await withdrawTransaction(post.strategy.strategyAddress, ClientStrategyAbi, post.strategy.strategyAddress, targetAmount.withdraw, web3.signer)}>Withdraw</Button>
                    <Button FrameComponent={FramePentagon} palette="primary" onClick={async () => web3.network.primaryTokens[0].address === post.strategy.target ? await sendEth(targetAmount.send) : await sendToken(targetAmount.send, post.strategy.target)}>Deposit</Button>
                  </div>

                </div>
                <p />



              </div>

              <div style={{ maxWidth: "30%" }}>
                <Figure src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post.title} />
              </div>

            </div>



          </FrameCorners>

          <p />
          <Text as="h5">Live Chat</Text>

          <CommentSection newComments={comments} post={post} />
          {/* {!!recommendedPosts?.length && (
            <><p />
              <Text as="h4">You might also like:</Text>
              <hr />

              <div className={classes.recommendedPosts}>
                {recommendedPosts.map(({ title, name, message, likes, selectedFile, _id }) => (
                  <div style={{ margin: '20px', alignContent: 'right' }} key={`posts-${_id}`}>

                    <Card >
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ maxWidth: "50%" }} className={classes.section}>
                          <div>
                            <Text as="h5">
                              <div style={{ cursor: 'pointer' }} onClick={() => openPost(_id)} gutterBottom variant="h6" >{title}</div>
                            </Text>
                          </div>

                          <Text><Link to={`/creators/${name}`}>
                            {` ${name}`}
                          </Link></Text>
                          <div style={{ cursor: 'pointer' }} onClick={() => openPost(_id)}>
                            <Typography gutterBottom><Text>{message}</Text></Typography>
                            <Text style={{ color: "white" }} gutterBottom variant="subtitle1">Likes: {likes?.length}</Text>

                          </div>      </div>
                        <div onClick={() => openPost(_id)} style={{ maxWidth: "40%", cursor: "pointer" }} className={classes.imageSection}>
                          <Figure className={classes.media} src={selectedFile} alt="" />
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </>



          )} */}
        </Card>
      </>
    );

  } else { return <div>WTF!!!!!!!</div> }

};

export default Post;