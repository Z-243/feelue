import { Lobster } from "next/font/google";
import React from "react";

const lobster = Lobster({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Button(props) {
  const { text, dark, full, clickHandler, onClick } = props;
  return (
    <button
      onClick={clickHandler || onClick}
      className={
        " rounded-full overflow-hidden duration-200 hover:opacity-60 border-2 border-solid border-[#2fbb10] cursor-pointer " +
        (dark ? " text-white bg-[#2fbb10] " : " text-[#2fbb10] ") +
        (full ? " grid place-items-center w-full " : " ")
      }
    >
      <p
        className={`${lobster.className} px-6 sm:px-10 whitespace-nowrap py-2 sm:py-3 `}
      >
        {text}
      </p>
    </button>
  );
}
