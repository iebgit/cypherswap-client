import React from "react";
import LinkIcons from "./LinkIcons";
import geckoImg from "./[latest] coingecko_logo_without_text.png";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-10 bg-black bg-opacity-10 backdrop-filter backdrop-blur-lg flex flex-wrap items-center px-2 py-3">
      <div className="grid-cols-2 container mx-auto flex flex-wrap items-center justify-between ">
        <div className="flex flex-nowrap col-span-9">
          <div className="flex flex-nowrap cursor-pointer font-bold p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#ffa76c"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            &nbsp;
            <a>CypherSwap</a>
          </div>
        </div>

        <LinkIcons />
      </div>
    </nav>
  );
}
