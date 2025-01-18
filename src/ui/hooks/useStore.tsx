import { useAtom } from "jotai";
import {
  aiResponseAtom,
  contentAtom,
  isConnectedAtom,
} from "../components/modules/conversation/conversation.store";

export const useStore = () => {
  const [aiResponse, setAIResponse] = useAtom(aiResponseAtom);
  const [content, setContent] = useAtom(contentAtom);
  const [isConnected, setIsConnected] = useAtom(isConnectedAtom);

  return {
    aiResponse,
    setAIResponse,
    content,
    setContent,
    isConnected,
    setIsConnected,
  };
};
