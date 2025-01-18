import { Conversation, ConversationStore, ConversationAction } from './conversation.types'

export const conversationReducer = (
  state: ConversationStore,
  action: ConversationAction
): ConversationStore => {
  switch (action.type) {
    case 'CREATE_CONVERSATION': {
      const newConversation: Conversation = {
        id: action.payload.id, // Use the provided ID
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      return {
        ...state,
        conversations: [...state.conversations, newConversation],
        activeConversationId: newConversation.id
      }
    }

    case 'DELETE_CONVERSATION': {
      const filteredConversations = state.conversations.filter(
        conv => conv.id !== action.payload.id
      )
      
      return {
        conversations: filteredConversations,
        activeConversationId: 
          state.activeConversationId === action.payload.id
            ? filteredConversations[0]?.id || null
            : state.activeConversationId
      }
    }

    case 'SET_ACTIVE_CONVERSATION': {
      return {
        ...state,
        activeConversationId: action.payload.id
      }
    }

    case 'UPDATE_CONVERSATION': {
      const { id, updates } = action.payload
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === id
            ? { ...conv, ...updates, updatedAt: new Date().toISOString() }
            : conv
        )
      }
    }

    case 'APPEND_MESSAGE': {
      const { conversationId, message } = action.payload
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [
                  ...conv.messages,
                  { ...message, timestamp: new Date().toISOString() }
                ],
                updatedAt: new Date().toISOString()
              }
            : conv
        )
      }
    }

    default:
      return state
  }
}