import React from "react";
import { useStore } from "../hooks/useStore";

export const ChatResponse = () => {
  const { aiResponse } = useStore();
  return (
    <div className="h-full p-4 custom-scrollbar">
      <h1>Response from model</h1>
      <pre>{JSON.stringify(aiResponse, null, 2)}</pre>
    </div>
  );
};
