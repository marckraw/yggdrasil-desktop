import React, { KeyboardEventHandler } from "react";
import { Button } from "./shadcn/ui/button";
import { Textarea } from "./shadcn/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "./shadcn/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./shadcn/ui/select";
import { ArrowRightIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { primeApiService } from "../services/primeapi.service";
import { useStore } from "../hooks/useStore";
import { useConversation } from "./modules/conversation/useConversation.hook";
import { useStreamChat } from "../hooks/useStreamChat";

export const chatFormSchema = z.object({
  message: z.string().min(2),
  model: z.any(),
  imageGenModel: z.any(),
});

export const ChatForm = () => {
  const { setAIResponse } = useStore();
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

  const form = useForm<z.infer<typeof chatFormSchema>>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: {
      message: "",
      model: "gpt-4o",
      imageGenModel: "dalle-3",
    },
  });

  const handleKeyDown: KeyboardEventHandler<HTMLFormElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  const onSubmit = async (values: z.infer<typeof chatFormSchema>) => {
    console.log("This is submission values", values);
    if (values.model === "agi-1") {
      const response = await primeApiService.chatAGI({
        messages: [
          {
            role: "user",
            content: values.message,
          },
        ],
      });
      console.log("This is response", response);
      const data = await response.json();
      console.log("This is data", data);
      setAIResponse(data);
    } else if (values.model === "gpt-4o") {
      try {
        await handleStream(values.message);
        form.reset(); // Clear the form after successful submission
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={handleKeyDown}
        className={"h-full"}
      >
        <div className={"w-full relative p-2 h-full"}>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className={"h-full"}>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Ask whatever you want... (you can add for example #image-gen to help model to understand what you want to do)"
                    disabled={false}
                    className={"pb-10 h-full"}
                  />
                </FormControl>
                <FormMessage className={"absolute left-4 bottom-4"} />
              </FormItem>
            )}
          />
          <div className="absolute inset-x-0 flex justify-between items-center px-2 py-1 left-4 bottom-4">
            <div className="flex space-x-2">
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={"gpt-4o"}
                    >
                      <SelectTrigger className="w-[200px] h-[32px]">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Base models</SelectLabel>
                          <SelectItem value={"gpt-4o"}>GPT-4o</SelectItem>
                          <SelectItem value={"gpt-4o-mini"}>
                            GPT-4o-mini
                          </SelectItem>
                          <SelectItem value={"claude-3-5-sonnet"}>
                            Claude 3.5 Sonnet
                          </SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Yggdrasil</SelectLabel>
                          <SelectItem value="agi-1">AGI 1</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageGenModel"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-[120px] h-[32px]">
                          <SelectValue placeholder="Image gen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={"none"}>none</SelectItem>
                        <SelectItem value="dalle-3">Dalle-3</SelectItem>
                        <SelectItem value="leonardo-ai">Leonardo AI</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button
            type="submit"
            className={`absolute right-4 bottom-4 ${
              isConnected
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
            }`}
            disabled={false}
          >
            <ArrowRightIcon className={"h-4 w-4"} />
          </Button>
        </div>
      </form>
    </Form>
  );
};
