export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  duration?: number;
}

export interface Conversation {
  id: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  title?: string;
}

export interface ConversationStore {
  conversations: Conversation[];
  activeConversationId: string | null;
}

// Define action types
export type ConversationAction =
  | { type: "CREATE_CONVERSATION"; payload: { id: string } }
  | { type: "DELETE_CONVERSATION"; payload: { id: string } }
  | { type: "SET_ACTIVE_CONVERSATION"; payload: { id: string } }
  | {
      type: "UPDATE_CONVERSATION";
      payload: { id: string; updates: Partial<Conversation> };
    }
  | {
      type: "APPEND_MESSAGE";
      payload: {
        conversationId: string;
        message: Omit<Message, "timestamp">;
      };
    };
