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
import { ArrowRightIcon, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { primeApiService } from "../services/primeapi.service";
import { useConversation } from "./modules/conversation/useConversation.hook";
import { useStreamChat } from "../hooks/useStreamChat";
import { cn, getTagColor } from "../lib/utils";
import { getFileType, isFileTypeSupported } from "../lib/file-utils";
import { FileType } from "../../types/upload";
import { backpackComponentsService } from "../services/backpackComponents.service";

export const chatFormSchema = z.object({
  message: z.string().min(2),
  model: z.any(),
  imageGenModel: z.enum(["none", "dall-e-3", "leonardo-ai"]),
  attachments: z
    .array(
      z.object({
        id: z.string(),
        base64: z.string(),
        name: z.string(),
        type: z.enum(["image", "pdf", "markdown"]),
      })
    )
    .default([]),
});

export const ChatForm = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [streamDuration, setStreamDuration] = React.useState<number>(0);
  const streamStartTimeRef = React.useRef<number | null>(null);
  const durationIntervalRef = React.useRef<number | null>(null);
  const {
    activeConversation,
    activeConversationId,
    createConversation,
    appendMessage,
  } = useConversation();
  const { setContent, isConnected, handleStream } = useStreamChat({
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
      imageGenModel: "none",
      attachments: [],
    },
  });

  const selectedModel = form.watch("model");

  const handleKeyDown: KeyboardEventHandler<HTMLFormElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isSubmitting) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  const startDurationCounter = () => {
    streamStartTimeRef.current = Date.now();
    durationIntervalRef.current = window.setInterval(() => {
      if (streamStartTimeRef.current) {
        setStreamDuration(Date.now() - streamStartTimeRef.current);
      }
    }, 100);
  };

  const stopDurationCounter = () => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    streamStartTimeRef.current = null;
    setStreamDuration(0);
  };

  React.useEffect(() => {
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  const onSubmit = async (values: z.infer<typeof chatFormSchema>) => {
    // TODO: make sure attachments are being send in proper way to ai, and understood by it.
    // Will also require some work on api.prime.mrck.dev

    if (isSubmitting) return;

    setIsSubmitting(true);
    const startTime = Date.now();
    startDurationCounter();

    try {
      console.log("These are values: ");
      console.log(values);
      if (values.model === "backpack-components") {
        console.log("Backpack components");
        const { data } = await backpackComponentsService.run(values);
        const duration = Date.now() - startTime;
        if (activeConversationId) {
          appendMessage(
            {
              role: "user",
              content: values.message,
            },
            activeConversationId
          );
          appendMessage(
            {
              role: "assistant",
              content: data.messages[0].content,
              duration,
            },
            activeConversationId
          );
        }
      } else if (values.model === "agi-1") {
        const response = await primeApiService.chatAGI({
          messages: [
            {
              role: "user",
              content: values.message,
            },
          ],
        });
        const { data } = await response.json();
        const duration = Date.now() - startTime;

        if (activeConversationId) {
          appendMessage(
            {
              role: "user",
              content: values.message,
            },
            activeConversationId
          );
          appendMessage(
            {
              role: "assistant",
              content: data.messages[0].content,
              duration,
            },
            activeConversationId
          );
        }
      } else if (values.model === "gpt-4o") {
        console.log("Submitted values");
        console.log(values);

        if (values.imageGenModel === "none") {
          await handleStream(values.message, startTime);
        } else if (values.imageGenModel === "dall-e-3") {
          console.log("Geneerate image with dall-e-3");
          const response = await primeApiService.generateImageRequest({
            prompt: values.message,
            model: "dall-e-3",
            debug: true,
            rephrase: true,
          });
          const { data } = await response.json();
          const duration = Date.now() - startTime;

          console.log("This is data maaaaaan");
          console.log(data);

          if (activeConversationId) {
            appendMessage(
              {
                role: "user",
                content: values.message,
              },
              activeConversationId
            );
            appendMessage(
              {
                role: "assistant",
                content: data.messages[0].content,
                duration,
              },
              activeConversationId
            );
          }
        } else if (values.imageGenModel === "leonardo-ai") {
          console.log("Geneerate image with leonardpai");
        }

        form.reset({ imageGenModel: values.imageGenModel, message: "" });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      stopDurationCounter();
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || isConnected;

  const modelOptions = [
    {
      label: "Base models",
      items: [
        {
          value: "gpt-4o",
          label: "GPT-4o",
          tags: ["stream", "text", "vision"],
        },
        {
          value: "gpt-4o-mini",
          label: "GPT-4o-mini",
          tags: ["stream", "text", "vision"],
        },
        {
          value: "claude-3-5-sonnet",
          label: "Claude 3.5 Sonnet",
          tags: ["stream", "text", "vision"],
        },
      ],
    },
    {
      label: "Yggdrasil",
      items: [
        {
          value: "agi-1",
          label: "AGI 1",
          tags: ["thinks", "text", "image_gen"],
        },
        {
          value: "backpack-components",
          label: "Backpack components",
          tags: ["text"],
        },
      ],
    },
  ];

  const handleFilesDrop = async (files: File[]) => {
    const supportedFiles = files.filter(isFileTypeSupported);

    for (const file of supportedFiles) {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64Data = e.target?.result as string;
          const fileType = getFileType(file);
          const currentAttachments = form.getValues("attachments") || [];

          if (fileType) {
            form.setValue("attachments", [
              ...currentAttachments,
              {
                id: crypto.randomUUID(),
                base64: base64Data,
                name: file.name,
                type:
                  fileType === FileType.IMAGE
                    ? "image"
                    : fileType === FileType.DOCUMENT
                      ? "pdf"
                      : "markdown",
              },
            ]);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error processing dropped file:", error);
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
                    placeholder="Ask whatever you want..."
                    disabled={isDisabled}
                    className={"pb-10 h-full"}
                    onFilesDrop={handleFilesDrop}
                    attachments={form.watch("attachments")}
                    onRemoveAttachment={(id) => {
                      const currentAttachments = form.getValues("attachments");
                      form.setValue(
                        "attachments",
                        currentAttachments.filter((att) => att.id !== id)
                      );
                    }}
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
                      disabled={isDisabled}
                    >
                      <SelectTrigger className="w-[200px] h-[32px]">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent>
                        {modelOptions.map((group) => (
                          <SelectGroup key={group.label}>
                            <SelectLabel>{group.label}</SelectLabel>
                            {group.items.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                <div className="flex items-center justify-between w-full gap-4">
                                  <span>{item.label}</span>
                                  <div className="flex gap-2">
                                    {item.tags.map((tag) => (
                                      <span
                                        key={tag}
                                        className={cn(
                                          "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                                          getTagColor(tag).bg,
                                          getTagColor(tag).text
                                        )}
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {selectedModel !== "agi-1" && (
                <FormField
                  control={form.control}
                  name="imageGenModel"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isDisabled}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[120px] h-[32px]">
                            <SelectValue placeholder="Image gen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">none</SelectItem>
                          <SelectItem
                            value="dall-e-3"
                            disabled={selectedModel === "claude-3-5-sonnet"}
                            className={cn(
                              selectedModel === "claude-3-5-sonnet" &&
                                "opacity-50"
                            )}
                          >
                            dall-e-3
                          </SelectItem>
                          <SelectItem value="leonardo-ai">
                            Leonardo AI
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
          <Button
            type="submit"
            className="absolute right-4 bottom-4 min-w-[100px] flex items-center justify-center gap-2"
            disabled={isDisabled}
          >
            {isSubmitting || isConnected ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>
                  {streamDuration > 0
                    ? `${(streamDuration / 1000).toFixed(1)}s`
                    : "Processing..."}
                </span>
              </>
            ) : (
              <ArrowRightIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
