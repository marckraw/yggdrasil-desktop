import React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ChatView } from "../ui/components/ChatView/ChatView";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <ChatView />
    </>
  );
}
