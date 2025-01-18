import { useAtom } from 'jotai'
import { 
  conversationsAtom, 
  activeConversationAtom, 
  conversationsListAtom, 
  storageUtilsAtom
} from './conversation.store'
import { Message, Conversation, ConversationStore } from './conversation.types'

export const useConversation = () => {
  const [store, dispatch] = useAtom(conversationsAtom)
  const [activeConversation] = useAtom(activeConversationAtom)
  const [conversationsList] = useAtom(conversationsListAtom)
  const [, dispatchStorageAction] = useAtom(storageUtilsAtom)

  return {
    // Selectors
    conversations: conversationsList,
    activeConversation,
    activeConversationId: store.activeConversationId,
    
    // Actions
    createConversation: () => {
      const newId = crypto.randomUUID() // or however you generate IDs
      dispatch({ type: 'CREATE_CONVERSATION', payload: { id: newId } })
      return newId // Return the new ID
    },
    
    deleteConversation: (id: string) => {
      dispatch({ type: 'DELETE_CONVERSATION', payload: { id } })
    },
    
    setActiveConversation: (id: string) => {
      dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: { id } })
    },
    
    updateConversation: (id: string, updates: Partial<Conversation>) => {
      dispatch({ 
        type: 'UPDATE_CONVERSATION', 
        payload: { id, updates } 
      })
    },
    
    appendMessage: (
      message: Omit<Message, 'timestamp'>,
      conversationId: string
    ) => {
      dispatch({ 
        type: 'APPEND_MESSAGE', 
        payload: { message, conversationId }
      })
    },
    // Storage utilities
    clearStorage: () => {
      dispatchStorageAction({ type: 'CLEAR_STORAGE' })
    },
      
    exportConversations: () => {
      dispatchStorageAction({ type: 'EXPORT_DATA' })
    },
      
    importConversations: (data: ConversationStore) => {
      dispatchStorageAction({ type: 'IMPORT_DATA', payload: data })
    },
    updateConversationTitle: (id: string, title: string) => {
      dispatch({ 
        type: 'UPDATE_CONVERSATION', 
        payload: { 
          id, 
          updates: { title } 
        } 
      })
    }
  }
}
