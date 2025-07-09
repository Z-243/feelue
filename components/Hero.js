import { Lobster } from "next/font/google";
import React from "react";
import Button from "./Button";
import Calendar from "./Calendar";
import Link from "next/link";
import CallToAction from "./CallToAction";

const lobster = Lobster({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Hero() {
  return (
    <div className="py-4 md:py-10 flex flex-col gap-8 sm:gap-10">
      <h1
        className={
          "text-5xl sm:text-6xl md:text-7xl text-center " + lobster.className
        }
      >
        Feeling something? <span className="textGradient">Feelue </span>
        helps keep log of your
        <span className="textGradient"> daily mood. </span>
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl text-center w-full mx-auto max-w-[600px] ">
        A daily mood recorder to look
        <span className="font-semibold "> back on every day.</span>
      </p>
      <CallToAction />
      <Calendar demo showEditIcon={false} clickable={false} />
    </div>
  );
}
