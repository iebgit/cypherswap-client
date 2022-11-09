import React from "react";
import { TokenStore } from "../../store/TokenStore";
import { observer } from "mobx-react";
import { Text } from "@arwes/core";
import "./Paths.css";

const Paths = observer(({ path, address, base, target, isDisabled, toggleData }) => {
  return (
    <>
      {path.length === 3 ? (
        <div className="flex flex-nowrap justify-center p-2 text-sm">
          <div
            onClick={async () => {
              await TokenStore.addToken(base.id, address);
              await toggleData(true);
            }}
          >
            <Text
              className={
                isDisabled
                  ? "text-orange-600 font-bold"
                  : "font-bold hover:text-white cursor-pointer"
              }
            >
              {base.label}&nbsp;
            </Text>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke={isDisabled ? "#e24a0f" : "currentColor"}
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
          <div>
            <Text
              className={isDisabled ? "text-orange-600 font-bold" : "font-bold"}
            >
              &nbsp;{path[1].symbol}&nbsp;
            </Text>{" "}
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke={isDisabled ? "#e24a0f" : "currentColor"}
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
          <div
            className={
              isDisabled
                ? "text-orange-600 font-bold"
                : "font-bold hover:text-white cursor-pointer"
            }
            onClick={async () => {
              await TokenStore.addToken(target.id, address);
              await toggleData(true);
            }}
          >
            &nbsp;{target.label}
          </div>
        </div>
      ) : (
        <div className="flex flex-nowrap justify-center p-2 text-sm">
          <div
            onClick={async () => {
              await TokenStore.addToken(base.id, address);
              await toggleData(true);
            }}
          >
            <Text
              className={
                isDisabled
                  ? "text-orange-600 font-bold"
                  : "font-bold hover:text-white cursor-pointer"
              }
            >
              {!!base ? (base?.label ? base.label : "Base") : ""}&nbsp;
            </Text>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke={isDisabled ? "#e24a0f" : "currentColor"}
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
          <div
            onClick={async () => {
              await TokenStore.addToken(target.id, address);
              await toggleData(true);
            }}
          >
            <Text
              className={
                isDisabled
                  ? "text-orange-600 font-bold"
                  : "font-bold hover:text-white cursor-pointer"
              }
            >
              {!!target ? (target?.label ? target.label : "Target") : ""}
              &nbsp;
            </Text>{" "}
          </div>
        </div>
      )}
    </>
  );
});

export default Paths;
