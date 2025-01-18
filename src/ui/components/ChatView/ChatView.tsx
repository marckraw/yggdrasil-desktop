import React, { useState } from "react";
import { ChatTokenLimits } from "../ChatTokenLimits";
import { ChatForm } from "../ChatForm";
import { ChatResponse } from "../ChatResponse";
import { useConversation } from "../modules/conversation/useConversation.hook";
import { useStreamChat } from "../../hooks/useStreamChat";
import { ConversationList } from "../modules/conversation/components/ConversationList";
import { Button } from "../shadcn/ui/button";
import { Menu } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const ChatView = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    activeConversation,
    activeConversationId,
    createConversation,
    appendMessage,
  } = useConversation();

  const { content, isConnected, error, handleStream, cancelStream } =
    useStreamChat({
      appendMessage,
      createConversation,
      activeConversationId,
      activeConversation,
    });

  return (
    <div className="h-screen">
      <div className="grid h-full grid-rows-[80px_1fr_150px_auto]">
        <div>
          {/* Sidebar Toggle Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="fixed left-4 top-4 z-50"
          >
            <Menu className="h-4 w-4" />
          </Button>
          {/* Sliding Sidebar Panel */}
          <div
            className={`fixed top-0 left-0 h-full w-64 bg-background border-r p-4 transform transition-transform duration-300 ease-in-out z-40 
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <Button
              className="w-full mb-4"
              onClick={() => createConversation()}
            >
              New Conversation
            </Button>

            <ConversationList />
          </div>
          {/* Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </div>

        <ChatResponse />
        <ChatForm />
        <ChatTokenLimits />
      </div>
    </div>
  );
};
