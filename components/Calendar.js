"use client";
import React, { useState } from "react";
import { gradients, baseRating } from "@/utils";
import { Lobster } from "next/font/google";
import { useRouter } from "next/navigation";

const lobster = Lobster({
  subsets: ["latin"],
  weight: ["400"],
});

const months = {
  January: "Jan",
  February: "Feb",
  March: "Mar",
  April: "Apr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Aug",
  September: "Sept",
  October: "Oct",
  November: "Nov",
  December: "Dec",
};
const monthsArr = Object.keys(months);
const now = new Date();
const dayList = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function Calendar(props) {
  const {
    demo,
    completeData,
    handleSetMood,
    showEditIcon = true,
    clickable = true,
  } = props;

  const router = useRouter();

  const now = new Date();
  const currMonth = now.getMonth();
  // access the key of the current month
  const [selectedMonth, setSelectMonth] = useState(
    Object.keys(months)[currMonth]
  );
  // get the current year
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const numericMonth = monthsArr.indexOf(selectedMonth);
  const data = completeData?.[selectedYear]?.[numericMonth] || {};

  // handles month navigation logic(going forward or backward through months)
  function handleIncrementMonth(val) {
    // val can be +1 or -1
    // if we hit the bounds of the months, then adjust the year that is displayed

    // we're going from Jan to Dec(previous year)
    if (numericMonth + val < 0) {
      setSelectedYear((curr) => curr - 1);
      // monthsArr.length - 1 to access the last month(Dec)
      setSelectMonth(monthsArr[monthsArr.length - 1]);

      // we're going from Dec to Jan(next year)
    } else if (numericMonth + val > 11) {
      setSelectedYear((curr) => curr + 1);
      // access the last month(Jan)
      setSelectMonth(monthsArr[0]);

      // Normal case: just move forward/back within the same year
    } else {
      setSelectMonth(monthsArr[numericMonth + val]);
    }
  }

  // "indexOf(month), 1" – 1st day of current month
  // "indexOf(month), 0" ( Last day of previous month)'
  // "indexOf(month) + 1 , 0"(last day of current month)
  const monthNow = new Date(
    selectedYear,
    Object.keys(months).indexOf(selectedMonth),
    1
  );
  // get the 1st day-name of the month
  const firstDayOfMonth = monthNow.getDay();
  // Thu Jul 31 2025 (gets the last day of current month)
  const lastDayOfMonth = new Date(
    selectedYear,
    Object.keys(selectedMonth).indexOf(selectedMonth) + 1,
    0
  ).getDate();

  const daysToDisplay = firstDayOfMonth + lastDayOfMonth;
  // 7 – days of the week; if we start on Tue see how many rows need to be added
  const numRows = Math.floor(daysToDisplay / 7) + (daysToDisplay % 7 ? 1 : 0);

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-5 gap-4">
        <button
          onClick={() => {
            handleIncrementMonth(-1);
          }}
          className="mr-auto textGradient text-lg sm:text-xl duration-200 hover:opacity-60 cursor-pointer"
        >
          <i className="fa-solid fa-circle-chevron-left"></i>
        </button>
        <p
          className={` ${lobster.className} text-center col-span-3 capitalized whitespace-nowrap text-green-500 `}
        >
          {selectedMonth}, {selectedYear}
        </p>
        <button
          onClick={() => {
            handleIncrementMonth(+1);
          }}
          className="ml-auto textGradient text-lg sm:text-xl duration-200 hover:opacity-60 cursor-pointer"
        >
          <i className="fa-solid fa-circle-chevron-right"></i>
        </button>
      </div>
      <div className=" flex flex-col overflow-hidden gap-1 py-4 sm:py-6 md:py-10 ">
        {/* create an array of numRows & then map it*/}
        {[...Array(numRows).keys()].map((row, rowIndex) => {
          return (
            <div key={rowIndex} className=" grid grid-cols-7 gap-1 ">
              {/* create a square for every day in a row */}
              {dayList.map((dayOfWeek, dayOfWeekIndex) => {
                // calculates "day number" (1–31) that belongs in a specific cell of a month-view calendar.
                let dayIndex =
                  rowIndex * 7 + dayOfWeekIndex - (firstDayOfMonth - 1);

                // whether a cell in a calendar grid should show a day number or stay empty
                // If day exceeds the total days in the month – don't display
                // Prevents rendering early cells before the month starts.
                let dayDisplay =
                  dayIndex > lastDayOfMonth
                    ? false
                    : row === 0 && dayOfWeekIndex < firstDayOfMonth
                    ? false
                    : true;

                // Check if this cell is today (same day, month, year)
                let isToday =
                  dayIndex === now.getDate() &&
                  numericMonth === now.getMonth() &&
                  selectedYear === now.getFullYear();

                if (!dayDisplay) {
                  return <div className=" bg-white " key={dayOfWeekIndex} />;
                }

                // if its a demo use demoData otherwise use actual data; if none give white color
                let color = demo
                  ? gradients.green[baseRating[dayIndex]]
                  : data[dayIndex]?.mood
                  ? gradients.green[data[dayIndex].mood]
                  : "white";

                return (
                  <div
                    style={{
                      background: color,
                      cursor:
                        clickable && (isToday || dayIndex in data)
                          ? "pointer"
                          : "default",
                    }}
                    key={dayOfWeekIndex}
                    className={
                      " text-xs sm:text-sm border border-solid p-1 sm:p-2 flex items-center gap-2 justify-between rounded-lg " +
                      (isToday ? " border-green-400 " : " border-green-200 ") +
                      (color === "white" ? " text-green-400" : " text-white") +
                      (isToday ? " font-bold" : "")
                    }
                    onClick={() => {
                      if (!clickable) return;
                      if (isToday || dayIndex in data) {
                        router.push(
                          `/dashboard/journal?date=${selectedYear}-${String(
                            numericMonth + 1
                          ).padStart(2, "0")}-${String(dayIndex).padStart(
                            2,
                            "0"
                          )}`
                        );
                      }
                    }}
                  >
                    <span>{dayIndex}</span>

                    {showEditIcon && (isToday || dayIndex in data) && (
                      <i
                        className="fa-solid fa-pen-to-square text-white "
                        title="Edit"
                      ></i>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
