import React, { useState, useEffect } from "react";
import Ticker from "react-ticker";
import "./StoppableMarque.css";
import { TokenStore } from "./../../store/TokenStore";
import { observer } from "mobx-react";
/// (window as any).ethereum also allows typescript to ignore the child types

const StoppableMarquee = observer(
  ({ tokens, toggleData, usDollar, address }) => {
    let [move, setMove] = useState(true);
    let [play, setPlay] = useState("play");
    let [currentIndex, setCurrentIndex] = useState(0);
    // let [subheading, setSubheading] = useState(news[0].article[0].subheading)

    const moveBanner = () => {
      if (move) {
        setMove(false);
        setPlay("pause");
      } else {
        setMove(true);
        setPlay("play");
      }
    };

    const hoverBanner = () => {
      if (play === "play") {
        setMove(true);
      } else {
        setMove(false);
      }
    };
    const indexCheck = (current, index) => {
      if (current === tokens.length - 1) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex(current + 1);
      }
    };
    return (
      <>
        <div className={`grid grid-cols-6 gap-4 h-5 mb-2`}>
          <div
            className="col-span-5"
            onMouseEnter={() => setMove(false)}
            onMouseLeave={() => {
              hoverBanner();
            }}
          >
            <Ticker speed={5} move={move}>
              {({ index }) => (
                <>
                  {indexCheck(currentIndex, index)}
                  <p
                    className={`flex flex-nowrap`}
                    key={`ticker${currentIndex}`}
                  >
                    &nbsp;&nbsp;
                    <small>
                      <strong
                        onClick={async () => {
                          await TokenStore.addToken(tokens[currentIndex]?.id, address);
                          await toggleData(true);
                        }}
                        className={`cursor-pointer ${
                          isNaN(!!tokens && tokens[currentIndex]?.change24h)
                            ? "hover:text-orange-600"
                            : "hover:text-white"
                        }   ${
                          Number(!!tokens && tokens[currentIndex]?.change24h) < 0
                            ? "text-orange-600"
                            : ""
                        }`}
                      >
                        {!!tokens[currentIndex]?.symbol &&
                        !!tokens[currentIndex]?.last
                          ? `${
                              isNaN(tokens[currentIndex]?.change24h)
                                ? ""
                                : Number(tokens[currentIndex]?.change24h) < 0
                                ? "\u25BC"
                                : "\u25B2"
                            } ${tokens[currentIndex]?.symbol.toUpperCase()}:  ${
                              tokens[currentIndex]?.last >= 1
                                ? "" +
                                  usDollar?.format(tokens[currentIndex]?.last)
                                : tokens[currentIndex]?.last >= 0.001
                                ? "$" +
                                  Number(tokens[currentIndex]?.last).toFixed(6)
                                : "$" +
                                  Number(
                                    tokens[currentIndex]?.last
                                  ).toExponential(5)
                            } `
                          : ""}
                      </strong>{" "}
                    </small>
                    &nbsp;&nbsp;
                  </p>
                </>
              )}
            </Ticker>
          </div>
          <div className={`col-span-1 mr-5`} onClick={moveBanner}>
            {" "}
            {!move ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={4}
                stroke="currentColor"
                className="w-4 h-4 cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-4 h-4 cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                />
              </svg>
            )}
          </div>
        </div>
      </>
    );
  }
);

export default StoppableMarquee;
