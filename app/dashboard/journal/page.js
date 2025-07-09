// app/dashboard/journal/page.js

import Main from "@/components/Main"; // Adjust path as needed
import Journal from "@/components/Journal"; // Replace with your actual component

export const metadata = {
  title: "Feelue • Journal",
};

export default function JournalPage() {
  return (
    <Main>
      <Journal />
    </Main>
  );
}
