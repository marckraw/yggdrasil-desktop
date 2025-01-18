import { atom } from "jotai";
import { atomWithReducer, atomWithStorage } from "jotai/utils";
import { ConversationStore, ConversationAction } from "./conversation.types";
import { conversationReducer } from "./conversation.reducer";

// Initial state
const initialState: ConversationStore = {
  conversations: [],
  activeConversationId: null,
};

// Create the storage atom with reducer
// This combines atomWithStorage for persistence and our reducer pattern
const baseStorageAtom = atomWithStorage<ConversationStore>(
  "conversation-store", // localStorage key
  initialState
);

// Create a writable atom that combines storage with reducer
export const conversationsAtom = atom(
  (get) => get(baseStorageAtom),
  (get, set, action: ConversationAction) => {
    const currentState = get(baseStorageAtom);
    const newState = conversationReducer(currentState, action);
    set(baseStorageAtom, newState);
  }
);

// Derived atoms remain the same
export const activeConversationAtom = atom((get) => {
  const store = get(conversationsAtom);
  return (
    store.conversations.find(
      (conv) => conv.id === store.activeConversationId
    ) || null
  );
});

export const conversationsListAtom = atom((get) => {
  const store = get(conversationsAtom);
  return store.conversations;
});

// Optional: Add some utility atoms for storage management
export const storageUtilsAtom = atom(
  null,
  (
    get,
    set,
    action: {
      type: "CLEAR_STORAGE" | "EXPORT_DATA" | "IMPORT_DATA";
      payload?: any;
    }
  ) => {
    switch (action.type) {
      case "CLEAR_STORAGE":
        set(baseStorageAtom, initialState);
        localStorage.removeItem("conversation-store");
        break;

      case "EXPORT_DATA": {
        const currentState = get(baseStorageAtom);
        const dataStr = JSON.stringify(currentState);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

        // Create and trigger download
        const exportFileDefaultName = `conversations-backup-${new Date().toISOString()}.json`;
        const linkElement = document.createElement("a");
        linkElement.setAttribute("href", dataUri);
        linkElement.setAttribute("download", exportFileDefaultName);
        linkElement.click();
        break;
      }
      case "IMPORT_DATA": {
        if (action.payload) {
          try {
            const importedData = action.payload;
            set(baseStorageAtom, importedData);
          } catch (error) {
            console.error("Failed to import data:", error);
          }
        }
        break;
      }
    }
  }
);
