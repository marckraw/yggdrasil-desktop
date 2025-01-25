import {
  CommandDialog,
  CommandGroup,
  CommandEmpty,
  CommandItem,
  CommandList,
  CommandInput,
} from "../shadcn/ui/command";
import { useNavigate } from "@tanstack/react-router";

import React from "react";

export function CommandMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem
            onSelect={(currentValue) => {
              setOpen(false);
              navigate({
                to: "/chat-page",
              });
            }}
          >
            Chat
          </CommandItem>
          <CommandItem
            onSelect={(currentValue) => {
              setOpen(false);
              navigate({
                to: "/about",
              });
            }}
          >
            About
          </CommandItem>
          <CommandItem
            onSelect={(currentValue) => {
              setOpen(false);
              navigate({
                to: "/",
              });
            }}
          >
            Index
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
