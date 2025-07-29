// app/dashboard/journal/page.js

import { Suspense } from "react";
import Main from "@/components/Main"; 
import Journal from "@/components/Journal"; 

export const metadata = {
  title: "Feelue • Journal",
};

export default function JournalPage() {
  return (
    <Main>
      <Suspense fallback={<div>Loading journal...</div>}>
        <Journal />
      </Suspense>
    </Main>
  );
}
