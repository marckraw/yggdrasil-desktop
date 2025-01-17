import React, { KeyboardEventHandler } from "react";
import { useThemeListener } from "./hooks/useTheme";
import { Button } from "./components/shadcn/ui/button";
import { Textarea } from "./components/shadcn/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "./components/shadcn/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./components/shadcn/ui/select";
import { ArrowRightIcon } from "lucide-react";

export const chatFormSchema = z.object({
  message: z.string().min(2),
  model: z.any(),
  imageGenModel: z.any(),
});

export default function App() {
  useThemeListener();

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
  };

  return (
    <>
      <Form {...form}>
        <div className="grid h-screen grid-rows-[auto_1fr_160px_40px]">
          <div className="flex items-center justify-center border-b px-4 py-2 h-20"></div>
          <div className="p-4 overflow-y-auto text-center">
            <div className="space-y-2 mt-4"></div>
          </div>

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
                        className={"pb-10"}
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
                    name="imageGenModel"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-[120px] h-[32px]">
                              <SelectValue placeholder="Image gen" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={"none"}>none</SelectItem>
                            <SelectItem value="dalle-3">Dalle-3</SelectItem>
                            <SelectItem value="leonardo-ai">
                              Leonardo AI
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

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
                              <SelectLabel>Claude</SelectLabel>
                              <SelectItem
                                key={1}
                                value={"claude-3-5-sonnet-20240620"}
                              >
                                Claude 3.5 Sonnet
                              </SelectItem>
                              <SelectItem
                                key={2}
                                value={"claude-3-5-sonnet-20240620-2"}
                              >
                                Claude 3.5 Sonnet 2
                              </SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                              <SelectLabel>Anton API</SelectLabel>
                              <SelectItem key={1} value="anton-v1">
                                Anton v1
                              </SelectItem>
                              <SelectItem key={2} value="anton-v2">
                                Anton v2
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button className={"absolute right-4 bottom-4"} disabled={false}>
                <ArrowRightIcon className={"h-4 w-4"} />
              </Button>
            </div>
          </form>

          <div className="h-10 flex items-center justify-end px-4 bg-background border-t">
            <div className="text-sm text-muted-foreground">
              Token limits: 0 / 'unknown'
            </div>
          </div>
        </div>
      </Form>
    </>
  );
}
