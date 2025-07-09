"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Calendar from "@/components/Calendar";
import { Lobster } from "next/font/google";
import Loading from "@/components/Loading";
import Login from "@/components/Login";

const lobster = Lobster({
  subsets: ["latin"],
  weight: ["400"],
});

export default function JournalPage() {
  const { currentUser, userDataObj, setUserDataObj, loading } = useAuth();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const [journalText, setJournalText] = useState("");
  const [data, setData] = useState({});
  const [currentDate, setCurrentDate] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    if (!currentUser || !userDataObj) return;

    setData(userDataObj);
    if (!dateParam) return;

    const [yearStr, monthStr, dayStr] = dateParam.split("-");
    const year = parseInt(yearStr);
    const month = parseInt(monthStr) - 1;
    const day = parseInt(dayStr);
    const entry = userDataObj?.[year]?.[month]?.[day];

    if (entry && typeof entry === "object" && entry.journal) {
      setJournalText(entry.journal);
    } else {
      setJournalText("");
    }

    setCurrentDate({ year, month, day });
  }, [currentUser, userDataObj, dateParam]);

  if (loading) return <Loading />;
  if (!currentUser) return <Login />;

  async function handleSave() {
    if (!currentDate) return;

    const { year, month, day } = currentDate;
    const moodEntry = data?.[year]?.[month]?.[day];

    const entryData =
      typeof moodEntry === "number"
        ? { mood: moodEntry, journal: journalText }
        : { ...moodEntry, journal: journalText };

    const newData = { ...data };
    if (!newData[year]) newData[year] = {};
    if (!newData[year][month]) newData[year][month] = {};
    newData[year][month][day] = entryData;
    setData(newData);
    setUserDataObj(newData);

    try {
      const docRef = doc(db, "users", currentUser.uid);
      await setDoc(
        docRef,
        {
          [year]: {
            [month]: {
              [day]: entryData,
            },
          },
        },
        { merge: true }
      );
      setSaveStatus("success");

      // Optionally clear status after 3 seconds
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err) {
      console.error("Save failed:", err);
      setSaveStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 max-w-3xl mx-auto">
      <h2
        className={`${lobster.className} text-4xl sm:text-5xl md:text-6xl text-center textGradient p-2`}
      >
        Journal Entry
      </h2>

      <Calendar completeData={data} />

      {currentDate ? (
        <div className="flex flex-col gap-4">
          <p className="text-lg font-semibold text-green-600">
            Entry for:{" "}
            {new Date(
              currentDate.year,
              currentDate.month,
              currentDate.day
            ).toLocaleDateString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <textarea
            className="border border-green-300 focus:border-green-600 focus:ring-0 focus:outline-none rounded-lg p-4 min-h-[150px] w-full"
            value={journalText}
            placeholder="Write your thoughts here..."
            onChange={(e) => setJournalText(e.target.value)}
          />
          <button
            className="bg-[#2fbb10] text-white px-6 py-2 rounded-full hover:opacity-60 cursor-pointer"
            onClick={handleSave}
          >
            Save Entry
          </button>
          {saveStatus === "success" && (
            <p className="text-green-600 mt-2">Entry saved successfully!</p>
          )}
          {saveStatus === "error" && (
            <p className="text-red-600 mt-2">Error saving entry.</p>
          )}
        </div>
      ) : (
        <p className="text-center text-green-500">
          Select a date from the calendar.
        </p>
      )}
    </div>
  );
}
