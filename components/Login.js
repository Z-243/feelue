"use client";
import { Lobster } from "next/font/google";
import React, { useState } from "react";
import Button from "./Button";
import { useAuth } from "@/context/AuthContext";

const lobster = Lobster({
  subsets: ["latin"],
  weight: "400",
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [isRegister, setIsRegister] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [error, setError] = useState(null);

  const { signup, login, isRegister, setIsRegister } = useAuth();

  async function handleSubmit() {
    setIsRegister(false);
    // guard clause
    if (
      !email ||
      !email.trim() || // check for whitespace-only email
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || // stricter email pattern
      !password ||
      password.trim().length < 6 || // remove whitespace padding
      /\s/.test(password) || // disallow spaces in password
      authenticating
    ) {
      setError("Invalid input");
      return;
    }
    setAuthenticating(true);
    setError(null);
    try {
      if (isRegister) {
        console.log("Signing up a new user");
        await signup(email, password);
      } else {
        console.log("Logging in existing user");
        await login(email, password);
      }
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    } finally {
      setAuthenticating(false);
    }
  }

  return (
    <div className=" flex flex-col flex-1 justify-center items-center gap-4 ">
      <h3 className={` text-3xl sm:text-4xl md:text-5xl ${lobster.className} `}>
        {isRegister ? "Register" : "Log In"}
      </h3>
      <p>Just a step away!</p>
      <input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        className="w-full max-w-[500px] mx-auto px-3 duration-200 hover:border-green-600 focus:border-green-600 py-2 sm:py-3 border border-solid border-green-400 rounded-full outline-none"
        placeholder="Email"
      />
      <input
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        className="w-full max-w-[500px] mx-auto px-3 duration-200 hover:border-green-600 focus:border-green-600 py-2 sm:py-3 border border-solid border-green-400 rounded-full outline-none"
        placeholder="Password"
        type="password"
      />
      {/* Show error message */}
      {error && <p style={{ color: "red" }}>⚠️ {error}</p>}
      <div className=" max-w-[500px] w-full mx-auto">
        <Button
          clickHandler={handleSubmit}
          text={authenticating ? "Submitting" : "Submit"}
          full
        />
      </div>
      <p className=" text-center ">
        {isRegister ? "Already have an account? " : "Don't have an account? "}
        <button
          onClick={() => {
            setIsRegister(!isRegister);
            setError(null);
          }}
          className=" text-green-500 cursor-pointer "
        >
          {isRegister ? "Sign In" : "Sign Up"}
        </button>
      </p>
    </div>
  );
}
