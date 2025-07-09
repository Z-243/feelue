"use client";
// import Link from "next/link";
import React from "react";
import Button from "./Button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function CallToAction() {
  const { currentUser, setIsRegister, isRegister } = useAuth();
  const router = useRouter();

  if (currentUser) {
    return (
      <div className="max-w-[600px] mx-auto w-full">
        <Button
          dark
          full
          text="Go to dashboard"
          onClick={() => router.push("/dashboard")}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 w-fit mx-auto ">
      <Button
        text="Sign Up"
        onClick={() => {
          setIsRegister(true);
          router.push("/dashboard");
        }}
      />
      <Button
        text="Login"
        dark
        onClick={() => {
          setIsRegister(false);
          router.push("/dashboard");
        }}
      />
    </div>
  );
}
//onClick={() => setIsRegister(false)}
