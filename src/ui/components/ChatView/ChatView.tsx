import React from "react";
import { ChatTokenLimits } from "../ChatTokenLimits";
import { ChatForm } from "../ChatForm";
import { ChatResponse } from "../ChatResponse";

export const ChatView = () => {
  return (
    <div>
      <div className="grid h-screen grid-rows-[auto_200px_40px]">
        <ChatResponse />
        <ChatForm />
        <ChatTokenLimits />
      </div>
    </div>
  );
};
