import React from "react";
import { useConversation } from "../useConversation.hook";

export const ConversationList = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    deleteConversation,
  } = useConversation();

  return (
    <div className="space-y-2 max-h-[200px] md:max-h-[calc(100vh-200px)] overflow-y-auto border rounded-lg p-2 bg-white dark:bg-gray-900">
      {conversations.length === 0 ? (
        <div className="text-center text-gray-500 py-4 text-sm">
          No conversations yet
        </div>
      ) : (
        conversations.map((conv) => (
          <div
            key={conv.id}
            className={`p-2 md:p-3 cursor-pointer rounded-lg transition-colors ${
              conv.id === activeConversationId
                ? "bg-blue-100 dark:bg-blue-900"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            onClick={() => setActiveConversation(conv.id)}
          >
            <div className="flex justify-between items-center">
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-medium truncate text-sm md:text-base">
                  {conv.title || `Conversation ${conv.id.slice(0, 6)}...`}
                </span>
                <span className="text-xs md:text-sm text-gray-500 truncate">
                  {conv.messages.length} messages •{" "}
                  {new Date(conv.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConversation(conv.id);
                }}
                className="text-red-500 hover:text-red-700 p-1 rounded ml-2 flex-shrink-0"
                title="Delete conversation"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 md:h-5 md:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
