import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
  ArwesThemeProvider,
  StylesBaseline,
  Text,
  FrameBox,
  Button,
} from "@arwes/core";
import { getWeb3 } from "./components/services/transactions.service";

import { AnimatorGeneralProvider } from "@arwes/animation";
import { BleepsProvider, useBleeps } from "@arwes/sounds";

const customStyles = {
  dropdownIndicator: (provided, state) => ({
    ...provided,
    transform: state.selectProps.menuIsOpen ? "rotate(180deg)": "rotate(0deg)",
    transition: "0.2s ease-in-out",
    color: state.selectProps.isDisabled ? "#e24a0f" : "#ffa76c",
    "&:hover": {
      color: "#7efcf6",
    },
  }),
  input: (provided, state) => ({
    ...provided,
    width: "100%",
    border: "none",
    color: state.selectProps.isDisabled ? "#e24a0f" : "#ffa76c",
    cursor: "text",
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: state.selectProps.isDisabled ? "#e24a0f" : "#ffa76c",
  }),
  menu: (provided, state) => ({
    ...provided,
    width: "100%",
    border: "1px solid #ffa76c",
    "&:hover": {
      border: "1px solid #7efcf6",
    },
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(4px)",
  }),
  control: (provided, state) => ({
    ...provided,
    // This line disable the blue border
    height: "40px",
    borderRadius: "0px",

    border: "1px solid #ffa76c",
    border: state.selectProps.isDisabled
      ? "1px solid #e24a0f"
      : "1px solid #ffa76c",
    boxShadow: "none",
    "&:hover": {
      border: "1px solid #7efcf6",
    },
    borderColor: state.isFocused ? "#ffa76c" : "#7efcf6",
    cursor: "pointer",
    backgroundColor: "inherit",
  }),
  option: (provided, state) => ({
    ...provided,
    font: "bold",
    color: state.isFocused ? "#ffa76c" : "#7efcf6",
    cursor: state.isFocused ? "pointer" : "default",
    backgroundColor: state.isFocused ? "rgba(0, 0, 0, 0.5)" : "inherit",
  }),
};

function Metabutton({
  web3,
  networks,
  FONT_FAMILY_ROOT,
  playersSettings,
  audioSettings,
  bleepsSettings,
  animatorGeneral,
  isDisabled
}) {
  const [netSwitch, setNetSwitch] = useState(web3?.chainId);
  const [options, setOptions] = useState(
    networks.map((data) => {
      const disabled =
        data.networkName === web3?.network.networkName ? true : false;
      return {
        value: data.id,
        label: data.networkName,
        image: data.networkImg,
        disabled,
      };
    })
  );
  const [selectedNetwork, setSelectedNetwork] = useState(
    web3?.network?.networkName === "Error"
      ? {
          value: networks[0].id,
          label: networks[0].networkName,
          image: networks[0].networkImg,
        }
      : {
          value: web3?.network.id,
          label: web3?.network.networkName,
          image: web3?.network.networkImg,
        }
  );

  useEffect(() => {
    setOptions(
      networks.map((data) => {
        const disabled =
          data.networkName === web3?.network?.networkName ? true : false;
        return {
          value: data.id,
          label: data.networkName,
          image: data.networkImg,
          disabled,
        };
      })
    );
  }, [selectedNetwork]);

  useEffect(() => {
    setSelectedNetwork(
      web3?.network?.networkName === "Error"
        ? {
            value: networks[0].id,
            label: networks[0].networkName,
            image: networks[0].networkImg,
          }
        : {
            value: web3?.network?.id,
            label: web3?.network?.networkName,
            image: web3?.network?.networkImg,
          }
    );
  }, [web3]);

  useEffect(() => {
    if (netSwitch !== web3?.chainId) {
      for (let x = 0; x < networks.length; x++) {
        if (web3?.chainId !== netSwitch && networks[x].id === netSwitch) {
          try {
            if (netSwitch === 1) {
              window.ethereum
                .request({
                  method: "wallet_switchEthereumChain",
                  params: [networks[x].networkParams],
                })
                .catch((error) => {
                  console.log(error);
                  setNetSwitch(web3.chainId);
                });
            } else {
              window.ethereum
                .request({
                  method: "wallet_addEthereumChain",
                  params: [networks[x].networkParams],
                })
                .catch((error) => {
                  console.log(error);
                  setNetSwitch(web3.chainId);
                });
            }
          } catch (error) {
            console.log(error);
            setNetSwitch(web3.chainId);
          }
        }
      }
    }
  }, [netSwitch]);

  // function showNetworks() {
  //   document.getElementById("myDropdown").classList.toggle("show");
  //   setDropdown(!dropdown);
  // }

  // Close the dropdown if the user clicks outside of it
  // window.onclick = function (event) {
  //   if (event.target.innerText !== "SELECT NETWORK") {
  //     const dropdowns = document.getElementsByClassName("dropdown-content");
  //     let i;
  //     for (i = 0; i < dropdowns.length; i++) {
  //       const openDropdown = dropdowns[i];
  //       if (openDropdown.classList.contains("show")) {
  //         setDropdown(!dropdown);
  //         openDropdown.classList.remove("show");
  //       }
  //     }
  //   }
  // };
  const getWeb3 = () => {
    if (typeof window.ethereum !== "undefined") {
      console.log("🦊 METAMASK IS INSTALLED!");
      window.ethereum.request({ method: "eth_requestAccounts" });
    } else {
      console.log("🚫 CANNOT ACCCESS METAMASK");
    }
  };

  return (
    <ArwesThemeProvider>
      <BleepsProvider
        audioSettings={audioSettings}
        playersSettings={playersSettings}
        bleepsSettings={bleepsSettings}
      >
        <StylesBaseline
          styles={{
            body: { fontFamily: FONT_FAMILY_ROOT },
          }}
        />

        <AnimatorGeneralProvider animator={animatorGeneral}>
          {typeof window.ethereum === "undefined" ? (
            <Button
              FrameComponent={FrameBox}
              animator={true}
              onClick={() => window.open("https://metamask.io")}
              className="w-40"
              style={{minHeight: "40px"}}
            >
              {" "}
              <Text as="a">Install MetaMask</Text>
            </Button>
          ) : web3?.message === "Error" &&
            web3.chainList.includes(web3.chainId) ? (
            <Button
              palette="secondary"
              FrameComponent={FrameBox}
              animator={true}
              onClick={() => getWeb3()}
              className="w-40"
              style={{minHeight: "40px"}}
            >
              {" "}
              <Text as="a">Open MetaMask</Text>
            </Button>
          ) : (
            <Select
              isDisabled={isDisabled}
              placeholder="Network..."
              styles={customStyles}
              className="w-40 hover:border-transparent shadow-none"
              value={selectedNetwork}
              onChange={(e) => {
                setNetSwitch(e.value);
              }}
              options={options}
              components={{
                IndicatorSeparator: () => null,
              }}
              menuPlacement="bottom"
              isOptionDisabled={(option) => option.disabled}
              formatOptionLabel={(network) => (
                <div
                  key={network.value}
                  onClick={
                    network.value === netSwitch
                      ? null
                      : () => setNetSwitch(network.value)
                  }
                  className=" flex flex-nowrap justify-start"
                >
                  <img
                    className="w-5 h-5"
                    src={network.image}
                    alt={network.label}
                  />
                  &nbsp;&nbsp;
                  <span>{network.label}</span>
                </div>
              )}
            />
          )}
        </AnimatorGeneralProvider>
      </BleepsProvider>
    </ArwesThemeProvider>
  );
}

export default Metabutton;
