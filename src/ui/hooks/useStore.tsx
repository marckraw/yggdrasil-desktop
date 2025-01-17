import { useAtom } from "jotai";
import { aiResponseAtom } from "../services/store.service";

export const useStore = () => {
  const [aiResponse, setAIResponse] = useAtom(aiResponseAtom);

  return { aiResponse, setAIResponse };
};
