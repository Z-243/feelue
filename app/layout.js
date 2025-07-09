import { Geist, Geist_Mono, Lobster, Open_Sans } from "next/font/google";
import { Github } from "lucide-react";
import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "@/context/AuthContext";
import Head from "./head";
import Logout from "@/components/Logout";

const openSans = Open_Sans({
  // creates a CSS variable; use it with className={`${openSans.variable}`} in layout
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Inject the font via a class, like className={openSans.className}
const lobster = Lobster({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata = {
  title: "Feelue",
  description: "Visualize how you feel each day with unique hues.",
};

export default function RootLayout({ children }) {
  const header = (
    // same padding/p for header, main, footer
    <header className="p-4 sm:p-8 flex items-center justify-between gap-4 ">
      <Link href={"/"}>
        <h1
          className={
            "text-[1.6rem] sm:text-3xl textGradient inline-flex items-center gap-2 " +
            lobster.className
          }
        >
          <span role="img" aria-label="clover">
            🍀
          </span>
          Feelue
        </h1>
      </Link>
      <Logout />
      {/* <div className=" flex items-center justify-between ">
        PLACEHOLDER- CTA|| Stats
      </div> */}
    </header>
  );

  const footer = (
    <footer className="p-4 sm:p-8 grid place-items-center gap-2 text-sm text-slate-500 ">
      <small>Created by</small>
      <a
        target="_blank"
        href="https://github.com/Z-243"
        className={
          " inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-50 hover:opacity-70 transition-colors " +
          lobster.className
        }
      >
        <Github size={19} className=" " />
        <p>@Z-243</p>
      </a>
    </footer>
  );

  return (
    <html lang="en">
      <Head />
      <AuthProvider>
        <body
          className={
            "w-full max-w-[1000px] mx-auto text-sm sm:text-base min-h-screen flex flex-col text-slate-700 " +
            `${openSans.variable}`
          }
        >
          {header}
          {children}
          {footer}
        </body>
      </AuthProvider>
    </html>
  );
}
