import React, { useState, useEffect } from "react";
import { Container } from "@material-ui/core";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import PostDetails from "./components/PostDetails/PostDetails";
import NavBar from "./components/NavBar/NavBar";
import Home from "./components/Home/Home";
import Auth from "./components/Auth/Auth";
import Swap from "./components/Swap/Swap";
import Create from "./components/Create/Create";
import Footer from "./components/common/Footer";
import "./styles/output.css";
import CreatorOrTag from "./components/CreatorOrTag/CreatorOrTag";
import "./App.css";
import {
  getUserData,
  convertTokens,
} from "./components/services/transactions.service";
import {
  ArwesThemeProvider,
  StylesBaseline,
  LoadingBars,
  Text,
} from "@arwes/core";
import { AnimatorGeneralProvider } from "@arwes/animation";
import { BleepsProvider } from "@arwes/sounds";
import {
  FONT_FAMILY_ROOT,
  audioSettings,
  playersSettings,
  bleepsSettings,
  animatorGeneral,
} from "./constants/theme.constants";
import networks from "./components/assets/networks.json";
const App = () => {
  const user = JSON.parse(localStorage.getItem("profile"));
  const [web3, setWeb3] = useState(null),
    [showLink, setShowLink] = useState(false);

  useEffect(() => {
    const getWindowEthereum = async () => {
      if (window.ethereum) {
        const addListeners = () => {
          window.addEventListener("load", async (event) => {
            setWeb3(await getUserData(true));
            window.ethereum.on("message", (msg) => console.message(msg));
            window.ethereum.on("chainChanged", async (msg) => {
              setWeb3(await getUserData(true));
            });
            window.ethereum.on("connect", async (msg) => {
              setWeb3(await getUserData(true));
            });
            window.ethereum.on("disconnect", (msg) => {});
            window.ethereum.on("accountsChanged", async (msg) => {
              setWeb3(await getUserData(true));
            });
            window.ethereum.on("transactionHash", (hash) => {});
            window.ethereum.on("receipt", function (receipt) {
              console.message(receipt);
            });
          });
        };

        addListeners();
      } else {
        setWeb3(await getUserData(false));
        console.error("Error: MetaMask Ethereum Service Not Found!");
        setTimeout(() => setShowLink(true), 3000);
      }
    };
    getWindowEthereum();
    // return () => {
    //   window.removeEventListener("load", async (event) => {
    //     setWeb3(await getUserData(true));
    //     window.ethereum.on("message", (msg) => console.message(msg));
    //     window.ethereum.on("chainChanged", async (msg) => {
    //       let message = await msg;
    //       message = message.slice(2)
    //       setWeb3({...web3, chainId: message});
    //       console.log(message)
    //     });
    //     window.ethereum.on("connect", async (msg) => {
    //       setWeb3(await getUserData(true));
    //     });
    //     window.ethereum.on("disconnect", (msg) => {});
    //     window.ethereum.on("accountsChanged", (msg) => {
    //       window.location.reload();
    //     });
    //     window.ethereum.on("transactionHash", (hash) => {});
    //     window.ethereum.on("receipt", function (receipt) {
    //       console.message(receipt);
    //     });
    //   });
    // }
  }, []);
  useEffect(() => {
    console.log(web3);
  }, [web3]);

  return (
    <BrowserRouter>
      <ArwesThemeProvider>
          <StylesBaseline
            styles={{
              body: { fontFamily: FONT_FAMILY_ROOT },
            }}
          />

          <AnimatorGeneralProvider animator={animatorGeneral}>
            <Container>
              {!web3 ? (
                <>
                  <br />
                  <LoadingBars animator={true} size={1} speed={6} />
                </>
              ) : (
                <>
                  <NavBar web3={web3} />
                  <Routes>
                    <Route path="/" exact element={<Home web3={web3} />} />
                    <Route path="/home" exact element={<Home web3={web3} />} />
                    <Route path="/swap" exact element={<Swap web3={web3} />} />
                    <Route path="/posts" exact element={<Home web3={web3} />} />
                    <Route
                      path="/create"
                      exact
                      element={<Create web3={web3} />}
                    />
                    <Route
                      path="/posts/search"
                      exact
                      element={<Home web3={web3} />}
                    />
                    <Route
                      path="/posts/:id"
                      exact
                      element={<PostDetails web3={web3} />}
                    />
                    <Route
                      path="/creators/:name"
                      element={<CreatorOrTag web3={web3} />}
                    />
                    <Route path="/tags/:name" element={<CreatorOrTag />} />
                    <Route
                      path="/auth"
                      exact
                      element={<Auth address={web3?.address} />}
                    />
                  </Routes>
                </>
              )}
            </Container>
          </AnimatorGeneralProvider>
      </ArwesThemeProvider>
    </BrowserRouter>
  );
};

export default App;
