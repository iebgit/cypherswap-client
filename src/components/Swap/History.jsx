import React, { useEffect, useState } from "react";
import "../../App.css";
import {
  ArwesThemeProvider,
  StylesBaseline,
  Text,
  Table,
  FrameCorners,
  Button,
  FrameBox,
  FramePentagon,
} from "@arwes/core";
import { AnimatorGeneralProvider } from "@arwes/animation";
import { BleepsProvider, useBleeps } from "@arwes/sounds";
import {
  columnWidths,
  headers,
  lorem,
} from "../../constants/history.constants";
import { timer } from "../services/tools.service";
import {
  FONT_FAMILY_ROOT,
  audioSettings,
  playersSettings,
  bleepsSettings,
  animatorGeneral,
} from "../../constants/theme.constants";
import { getRandom } from "../services/tools.service";

export default function History({ isHistory, network }) {
  const [activate, setActivate] = useState(false);
  const [userValue, setUserValue] = useState("");
  let [page, setPage] = useState(1);
  const [data, setData] = useState(
    Array(5)
      .fill(0)
      .map((_, index) => ({
        id: index,
        columns: [
          {
            id: "p",
            data: `${getRandom(0, 12)}/${getRandom(0, 30)}/${getRandom(9, 22)}`,
          },
          { id: "q", data: `${getRandom(0, 100000)} CYR` },
          {
            id: "r",
            data: `0x...${getRandom(1000, 9999)}`,
          },
          { id: "s", data: lorem.generateWords(4) },
        ],
      }))
  );

  useEffect(() => {
    if (isHistory !== "history") {
      setUserValue("");
      setPage(1);
      setActivate(false);
    } else {
      setActivate(true);
    }
  }, [isHistory]);

  const changePage = async (pageValue) => {
    console.log("Audio settings:", audioSettings);
    if (pageValue > 0) {
      setActivate(false);
      await timer(500);
      setPage(pageValue);
      setData(
        Array(5)
          .fill(0)
          .map((_, index) => ({
            id: index,
            columns: [
              {
                id: "p",
                data: `${getRandom(0, 12)}/${getRandom(0, 30)}/${getRandom(
                  9,
                  22
                )}`,
              },
              { id: "q", data: `${getRandom(0, 100000)} CYR` },
              {
                id: "r",
                data: `0x...${getRandom(1000, 9999)}`,
              },
              { id: "s", data: lorem.generateWords(4) },
            ],
          }))
      );
      setActivate(true);
    }
  };

  return (
    <ArwesThemeProvider>
      <br />
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
          <br />

          <FrameCorners
            animator={{ activate }}
            cornerWidth={1}
            cornerLength={22}
            palette={network.networkName === "Error" ? "error" : "primary"}
            hover
          >
            <div className="px-2 py-1 md:px-10 md:py-5">
              <div
                className={`flex flex-none justify-between text-right p-2 ${
                  activate ? "" : "hidden"
                }`}
              >
                <div className="flex flex-nowrap justify-left text-left">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 uppercase sm:h-6 sm:w-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>{" "}
                  <Text
                    as="h3"
                    className="text-sm font-bold sm:text-lg md:text-xl lg:text-2xl"
                  >
                    &nbsp; History
                  </Text>
                </div>
                <div className="flex flex-nowrap justify-right text-right">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 cursor-pointer hover:text-teal-100 ${
                      page === 1 ? "invisible" : "visible"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    onClick={() => changePage(page - 1)}
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                    />
                  </svg>
                  <Text animator={{ activate }} as="a">
                    &nbsp;{page}&nbsp;
                  </Text>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 cursor-pointer hover:text-teal-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    onClick={() => changePage(page + 1)}
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              <div
                className={`flex flex-nowrap ${
                  activate ? "visible" : "invisible"
                }`}
              >
                <input
                  placeholder="Search History"
                  className={`border hover:border-teal-200`}
                  type="text"
                  value={userValue}
                  onChange={(event) => setUserValue(event.target.value)}
                ></input>

                <Button
                  palette="secondary"
                  FrameComponent={FramePentagon}
                  animator={{ activate }}
                >
                  <Text>submit</Text>
                </Button>
              </div>
              <br />

              <div className="text-sm md:text-base">
                <Table
                  animator={{ activate }}
                  headers={headers}
                  dataset={data}
                  columnWidths={columnWidths}
                />
              </div>

              <div className="flex flex-nowrap justify-between">
                <Text as="a">Page {page}</Text>

                <div>
                  <Button
                    FrameComponent={FrameBox}
                    palette={page === 1 ? "error" : "secondary"}
                    animator={{ activate }}
                    onClick={() => changePage(page - 1)}
                  >
                    {" "}
                    <Text className="p-1">Previous</Text>
                  </Button>

                  <Button
                    FrameComponent={FramePentagon}
                    palette="secondary"
                    animator={{ activate }}
                    onClick={() => changePage(page + 1)}
                  >
                    {" "}
                    <Text className="p-1">Next</Text>
                  </Button>
                </div>
              </div>
            </div>
            <br />
          </FrameCorners>

          <br />
        </AnimatorGeneralProvider>
      </BleepsProvider>
    </ArwesThemeProvider>
  );
}
