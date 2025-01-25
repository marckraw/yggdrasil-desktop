import React from "react";
import { ChatView } from "../ui/components/ChatView/ChatView";
import { createLazyFileRoute } from "@tanstack/react-router";

export const ChatPage = () => {
  return (
    <>
      <ChatView />
    </>
  );
};

export const Route = createLazyFileRoute("/chat-page")({
  component: ChatPage,
});
