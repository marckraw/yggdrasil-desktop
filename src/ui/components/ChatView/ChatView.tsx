import React from "react";
import { ChatTokenLimits } from "../ChatTokenLimits";
import { ChatForm } from "../ChatForm";

export const ChatView = () => {
  return (
    <div>
      <div className="grid h-screen grid-rows-[auto_200px_40px]">
        <div>asdas</div>
        {/* <ChatAnswer /> */}

        <ChatForm />
        <ChatTokenLimits />
      </div>
    </div>
  );
};
