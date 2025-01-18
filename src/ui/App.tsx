import React from "react";
import { useThemeListener } from "./hooks/useTheme";
import { ChatView } from "./components/ChatView/ChatView";

export default function App() {
  useThemeListener();

  return (
    <div className="h-screen w-screen">
      <ChatView />
    </div>
  );
}
