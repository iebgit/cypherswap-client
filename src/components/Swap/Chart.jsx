import React, { useState, useEffect } from "react";
import './Swap.css'
import moment, { duration } from "moment";
import {
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const Chart = ({ data, show, tokenI, usDollar }) => {
  const [formattedData, setFormattedData] = useState(null);
  const [showIndex, setShowIndex] = useState(data?.length - 1);
  const [duration, setDuration] = useState("24hr");

  useEffect(() => {
    changeDuration(data?.length - 1, "24hr");
    setShowIndex(data?.length - 1);
  }, [data, show]);

  const changeDuration = (idx, dur) => {
    let hr;
    let st;
    switch (dur) {
      case "24hr":
        hr = 12;
        st = 2;
        break;
      case "7d":
        hr = 168;
        st = 12;
        break;
      default:
        hr = 12;
        st = 2;
    }
    const price = data[idx].market_data.sparkline_7d.price;
    const newArray = [];
    for (let x = 0; x < price.length; x += st) {
      price[x].USD =
        !!Number(price[x]?.USD) && price[x].USD >= 1
          ? Number(price[x].USD).toFixed(2)
          : price[x].USD >= 0.0001
          ? Number(price[x].USD.toFixed(7))
          : Number(price[x].USD).toExponential(6);
      newArray.push(price[x]);
    }
    setDuration(dur);
    setFormattedData(newArray.slice(newArray.length - hr));
  };

  return (
    <>
      <div className="flex flex-nowrap justify-center">
        {data.map((t, i) => (
          <img
            onClick={() => {
              changeDuration(i, duration);
              setShowIndex(i);
              tokenI(i);
            }}
            className={`m-1 h-6 w-6  ${
              i === showIndex ? "" : "opacity-60 hover:opacity-100"
            } cursor-pointer`}
            src={t.image.large}
            alt={t.symbol}
            key={t.id}
          ></img>
        ))}
      </div>
      <div className="flex flex-nowrap">
        <div className="mt-2 pt-5">
          <LineChart
            width={168}
            height={168}
            data={formattedData}
            margin={{ top: 5, right: 5, left: 5, bottom: 0 }}
          >
            <XAxis dataKey="time" axisLine={false} tick={false}></XAxis>
            <YAxis
              axisLine={false}
              tick={false}
              hide
              domain={
                Math.min(data[showIndex]?.market_data.sparkline_7d.price) > 1
                  ? [
                      Number(
                        Math.min(
                          data[showIndex]?.market_data.sparkline_7d.price
                        )
                      ),
                      Number(
                        Math.max(
                          data[showIndex]?.market_data.sparkline_7d.price
                        )
                      ),
                    ]
                  : [
                      Number(
                        Math.min(
                          data[showIndex]?.market_data.sparkline_7d.price
                        )
                      ),
                      Number(
                        Math.max(
                          data[showIndex]?.market_data.sparkline_7d.price
                        )
                      ),
                    ]
              }
            />
            <Tooltip
              itemStyle={{ backgroundColor: "black" }}
              labelStyle={{ backgroundColor: "black", color: "white" }}
              wrapperStyle={{ backgroundColor: "black" }}
              contentStyle={{ backgroundColor: "black" }}
            />

            <Line
              type="monotone"
              dataKey="USD"
              stroke={
                duration === "24hr"
                  ? data[showIndex]?.market_data?.price_change_24h > 0
                    ? "currentColor"
                    : "#e24a0f"
                  : data[showIndex]?.market_data?.price_change_percentage_7d > 0
                  ? "currentColor"
                  : "#e24a0f"
              }
              strokeWidth={3}
            />
          </LineChart>
        </div>
        <div className="justify-start ml-5 mt-5 pr-2 w-36">
          <div className="text-left flex flex-nowrap ml-1">
            <strong
              className={`${
                duration === "24hr"
                  ? data[showIndex]?.market_data?.price_change_24h > 0
                    ? "currentColor"
                    : "text-orange-600"
                  : data[showIndex]?.market_data?.price_change_percentage_7d > 0
                  ? "currentColor"
                  : "text-orange-600"
              } text-xl`}
            >
              {!!data[showIndex]?.market_data?.price_change_24h
                ? data[showIndex]?.market_data?.current_price.usd >= 1
                  ? "" +
                    usDollar.format(
                      data[showIndex]?.market_data?.current_price.usd
                    )
                  : data[showIndex]?.market_data?.current_price.usd >= 0.001
                  ? "$" +
                    Number(
                      data[showIndex]?.market_data?.current_price.usd
                    ).toFixed(6)
                  : "$" +
                    Number(
                      data[showIndex]?.market_data?.current_price.usd
                    ).toExponential(5)
                : "unknown"}
            </strong>
          </div>

          <div className="text-left">
            <small
              onClick={() => changeDuration(showIndex, "24hr")}
              className={`${
                data[showIndex]?.market_data.price_change_percentage_24h > 0
                  ? "currentColor pl-1 font-bold "
                  : "text-orange-600 pl-1 font-bold "
              }  hover:text-white ${
                duration === "24hr" ? "text-white" : ""
              } cursor-pointer`}
            >
              {!!data[showIndex]?.market_data?.price_change_percentage_24h
                ? data[showIndex]?.market_data?.price_change_percentage_24h > 0
                  ? "\u25B2 24hr : " +
                    Number(
                      data[showIndex]?.market_data?.price_change_percentage_24h
                    ).toFixed(2) +
                    " %"
                  : "\u25BC 24hr : " +
                    Number(
                      data[showIndex]?.market_data?.price_change_percentage_24h
                    ).toFixed(2) +
                    " %"
                : "unknown"}
            </small>
          </div>
          <div className="text-left">
            <small
              onClick={() => changeDuration(showIndex, "7d")}
              className={`${
                Number(
                  data[showIndex]?.market_data?.price_change_percentage_7d
                ) > 0
                  ? "currentColor pl-1 font-bold"
                  : "text-orange-600 pl-1 font-bold"
              }  hover:text-white ${
                duration === "7d" ? "text-white" : ""
              } cursor-pointer`}
            >
              {!!data[showIndex]?.market_data?.price_change_percentage_7d
                ? data[showIndex]?.market_data?.price_change_percentage_7d > 0
                  ? "\u25B2 7d : " +
                    Number(
                      data[showIndex]?.market_data?.price_change_percentage_7d
                    ).toFixed(2) +
                    " %"
                  : "\u25BC 7d : " +
                    Number(
                      data[showIndex]?.market_data?.price_change_percentage_7d
                    ).toFixed(2) +
                    " %"
                : "unknown"}
            </small>
          </div>
          {/* <div className="text-left">
            <small
              className={`${
                data[showIndex]?.market_data?.price_change_percentage_14d > 0
                  ? "currentColor pl-1 font-bold"
                  : "text-orange-600 pl-1 font-bold"
              }  `}
            >
              {!!data[showIndex]?.market_data?.price_change_percentage_14d
                ? data[showIndex]?.market_data?.price_change_percentage_14d > 0
                  ? "\u25B2 14d: " +
                    Number(
                      data[showIndex]?.market_data?.price_change_percentage_14d
                    ).toFixed(2) +
                    " %"
                  : "\u25BC 14d: " +
                    Number(
                      data[showIndex]?.market_data?.price_change_percentage_14d
                    ).toFixed(2) +
                    " %"
                : "unknown"}
            </small>
          </div>
          <div className="text-left">
            <small
              className={`${
                Number(
                  data[showIndex]?.market_data?.price_change_percentage_30d
                ) > 0
                  ? "currentColor pl-1 font-bold"
                  : "text-orange-600 pl-1 font-bold"
              } `}
            >
              {!!data[showIndex]?.market_data?.price_change_percentage_30d
                ? data[showIndex]?.market_data?.price_change_percentage_30d > 0
                  ? "\u25B2 30d: " +
                    Number(
                      data[showIndex]?.market_data?.price_change_percentage_30d
                    ).toFixed(2) +
                    " %"
                  : "\u25BC 30d: " +
                    Number(
                      data[showIndex]?.market_data?.price_change_percentage_30d
                    ).toFixed(2) +
                    " %"
                : "unknown"}
            </small>
          </div>
          <div className="text-left">
            <small
              className={`${
                data[showIndex]?.market_data?.price_change_percentage_60d > 0
                  ? "currentColor pl-1 font-bold"
                  : "text-orange-600 pl-1 font-bold"
              } `}
            >
              {!!data[showIndex]?.market_data?.price_change_percentage_60d
                ? data[showIndex]?.market_data?.price_change_percentage_60d > 0
                  ? "\u25B2 60d: " +
                    Number(
                      data[showIndex]?.market_data?.price_change_percentage_60d
                    ).toFixed(2) +
                    " %"
                  : "\u25BC 60d: " +
                    Number(
                      data[showIndex]?.market_data?.price_change_percentage_60d
                    ).toFixed(2) +
                    " %"
                : "unknown"}
            </small>
          </div>
          <div className="text-left">
            <small
              className={`${
                Number(
                  data[showIndex]?.market_data?.price_change_percentage_200d
                ) > 0
                  ? "currentColor pl-1 font-bold"
                  : "text-orange-600 pl-1 font-bold"
              } `}
            >
              {!!data[showIndex]?.market_data?.price_change_percentage_200d
                ? data[showIndex]?.market_data?.price_change_percentage_200d > 0
                  ? "\u25B2 200d: " +
                    Number(
                      data[showIndex]?.market_data?.price_change_percentage_200d
                    ).toFixed(2) +
                    " %"
                  : "\u25BC 200d: " +
                    Number(
                      data[showIndex]?.market_data?.price_change_percentage_200d
                    ).toFixed(2) +
                    " %"
                : "unknown"}
            </small>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Chart;
