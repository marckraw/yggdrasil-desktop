import React from "react";
import { useConversation } from "./modules/conversation/useConversation.hook";
import { useStreamChat } from "../hooks/useStreamChat";
import { RenderMarkdown } from "./RenderMarkdown/RenderMarkdown";
import { format, isToday, isYesterday } from "date-fns";

const formatDuration = (duration?: number) => {
  if (!duration) return "";
  return `${(duration / 1000).toFixed(2)}s`;
};

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

  const formatTimestamp = (timestamp: string | undefined) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);

    if (isToday(date)) {
      return format(date, "'Today at' h:mm a");
    } else if (isYesterday(date)) {
      return format(date, "'Yesterday at' h:mm a");
    } else {
      return format(date, "MMM d 'at' h:mm a");
    }
  };

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
                className={`flex flex-col ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[90%] md:max-w-[80%] rounded-lg p-3 md:p-4 relative group ${
                    message.role === "user"
                      ? "bg-blue-500 text-white ml-2 md:ml-4"
                      : "bg-gray-100 dark:bg-gray-800 mr-2 md:mr-4"
                  }`}
                >
                  {/* Hover card */}
                  {message.role === "assistant" && (
                    <div className="absolute bottom-full left-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white p-2 rounded text-sm pointer-events-none whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div>Role: {message.role}</div>
                        <div>Duration: {formatDuration(message.duration)}</div>
                        <div>
                          Time:{" "}
                          {format(
                            new Date(message.timestamp || ""),
                            "HH:mm:ss"
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="prose dark:prose-invert max-w-none text-sm md:text-base">
                    <RenderMarkdown>{message.content}</RenderMarkdown>
                  </div>
                </div>
                <div
                  className={`text-xs text-gray-500 mt-1 ${
                    message.role === "user" ? "mr-3" : "ml-3"
                  }`}
                >
                  <span>{formatTimestamp(message.timestamp)}</span>
                  {message.duration && (
                    <span className="ml-2">
                      • {formatDuration(message.duration)}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {isConnected && (
              <div className="flex flex-col items-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 md:p-4 max-w-[90%] md:max-w-[80%] mr-2 md:mr-4 relative group">
                  <div className="absolute bottom-full left-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white p-2 rounded text-sm pointer-events-none whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div>Role: assistant (streaming)</div>
                      <div>Status: Active stream</div>
                      <div>Time: {format(new Date(), "HH:mm:ss")}</div>
                    </div>
                  </div>
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
