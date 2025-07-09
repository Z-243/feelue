"use client";
import { Lobster } from "next/font/google";
import React, { useEffect, useState } from "react";
import Calendar from "./Calendar";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Loading from "./Loading";
import Login from "./Login";

const lobster = Lobster({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Dashboard() {
  const { currentUser, userDataObj, setUserDataObj, loading } = useAuth();
  const [data, setData] = useState({});
  const now = new Date();

  // calculate average mood and numbeer of days
  function countValues() {
    let total_number_of_days = 0;
    let sum_moods = 0;
    for (let year in data) {
      for (let month in data[year]) {
        for (let day in data[year][month]) {
          let days_mood = data[year][month][day];
          total_number_of_days++;
          sum_moods += days_mood;
        }
      }
    }
    return {
      total_entries: total_number_of_days,
      average_mood:
        total_number_of_days === 0
          ? 0
          : Number((sum_moods / total_number_of_days).toFixed(2)),
    };
  }

  const statuses = {
    // spread values from countValues() function
    ...countValues(),
    time_remaining: `${23 - now.getHours()}H ${60 - now.getMinutes()}M`,
  };

  const moods = {
    Angry: "😠",
    Sad: "😔",
    Neutral: "🙂",
    Good: "😊",
    Great: "🥳",
  };

  async function handleSetMood(mood) {
    // so changes or additions are made to the current day only
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();

    try {
      const newData = { ...userDataObj };
      // if we don't have current year/month in newData; it is created so data can be stored
      if (!newData?.[year]) {
        newData[year] = {};
      }
      if (!newData?.[year]?.[month]) {
        newData[year][month] = {};
      }

      newData[year][month][day] = { mood };
      // update the current state
      setData(newData);
      // update the global state
      setUserDataObj(newData);
      // update firebase
      const docRef = doc(db, "users", currentUser.uid);
      const res = await setDoc(
        docRef,
        {
          [year]: {
            [month]: {
              [day]: { mood },
            },
          },
        },
        { merge: true }
      );
    } catch (err) {
      console.log("Failed to set data: ", err.message);
    }
  }

  useEffect(() => {
    if (!currentUser || !userDataObj) {
      return;
    }
    // read the data from firebase
    setData(userDataObj);

    // code runs when the below value changes
  }, [currentUser, userDataObj]);

  if (loading) {
    return <Loading />;
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className=" flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16 ">
      <div className=" grid grid-cols-3 bg-green-50 text-green-500 p-4 gap-4 rounded-lg ">
        {Object.keys(statuses).map((status, statusIndex) => {
          return (
            <div key={statusIndex} className="  flex flex-col gap-1 sm:gap-2 ">
              <p
                className={
                  "font-medium capitalize text-xs sm:text-sm truncate "
                }
              >
                {status.replaceAll("_", " ")}
              </p>
              <p
                className={` ${lobster.className} text-base sm:text-lg truncate `}
              >
                {statuses[status]}
                {status === "total_entries" ? " 🏃🏼" : ""}
              </p>
            </div>
          );
        })}
      </div>
      <h4
        className={` ${lobster.className} text-4xl sm:text-5xl md:text-6xl text-center `}
      >
        How are you <span className="textGradient ">Feeling </span>today?
      </h4>
      <div className=" flex items-stretch flex-wrap gap-4 ">
        {Object.keys(moods).map((mood, moodIndex) => {
          return (
            <button
              key={moodIndex}
              onClick={() => {
                const curretMoodValue = moodIndex + 1;
                handleSetMood(curretMoodValue);
              }}
              className={
                " p-4 px-5 rounded-2xl greenShadow duration-200 bg-green-50 hover:bg-green-00 text-center flex flex-col items-center gap-2 flex-1 cursor-pointer "
              }
            >
              <p className={" text-4xl sm:text-5xl md:text-6xl "}>
                {moods[mood]}
              </p>
              <p
                className={` ${lobster.className} text-green-500 text-xs sm:text-sm md:text-base `}
              >
                {mood}
              </p>
            </button>
          );
        })}
      </div>
      <Calendar completeData={data} handleSetMood={handleSetMood} />
    </div>
  );
}
