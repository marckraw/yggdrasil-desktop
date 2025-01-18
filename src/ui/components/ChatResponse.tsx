import React from "react";
import { useConversation } from "./modules/conversation/useConversation.hook";
import { useStreamChat } from "../hooks/useStreamChat";
import { RenderMarkdown } from "./RenderMarkdown/RenderMarkdown";

export const ChatResponse = () => {
  const {
    activeConversation,
    activeConversationId,
    createConversation,
    appendMessage,
  } = useConversation();
  const { content, isConnected, error } = useStreamChat({
    appendMessage,
    createConversation,
    activeConversationId,
    activeConversation,
  });

  return (
    <div className="h-full p-4 custom-scrollbar relative">
      {activeConversation ? (
        <>
          <div className="mb-4 mt-4 flex justify-end fixed top-4 right-4 z-10">
            <div className="space-y-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isConnected
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {isConnected ? "Streaming" : "Disconnected"}
              </span>

              {error && (
                <div className="text-red-600 text-sm">Error: {error}</div>
              )}
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {activeConversation?.messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[90%] md:max-w-[80%] rounded-lg p-3 md:p-4 ${
                    message.role === "user"
                      ? "bg-blue-500 text-white ml-2 md:ml-4"
                      : "bg-gray-100 dark:bg-gray-800 mr-2 md:mr-4"
                  }`}
                >
                  <div className="prose dark:prose-invert max-w-none text-sm md:text-base">
                    <RenderMarkdown>{message.content}</RenderMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {isConnected && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 md:p-4 max-w-[90%] md:max-w-[80%] mr-2 md:mr-4">
                  <div className="prose dark:prose-invert max-w-none text-sm md:text-base">
                    <RenderMarkdown>{content}</RenderMarkdown>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 py-4 text-sm">
          No conversations yet
        </div>
      )}
    </div>
  );
};
