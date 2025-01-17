import React from "react";
import { useStore } from "../hooks/useStore";

export const ChatResponse = () => {
  const { aiResponse } = useStore();
  return (
    <div className="h-full">
      <h1>Response from model</h1>
      <pre>{JSON.stringify(aiResponse, null, 2)}</pre>
    </div>
  );
};
