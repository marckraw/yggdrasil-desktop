import React, { useEffect } from "react";
import { useThemeListener } from "./hooks/useTheme";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { CommandMenu } from "./components/CommandMenu/CommandMenu";

export default function App() {
  useThemeListener();

  useEffect(() => {
    window.electron.onSelectedText((selectedText) => {
      console.log("Selected text:", selectedText);
      // Handle the selected text here
      // You could open your command menu, start a new chat, etc.
    });
  }, []);

  return (
    <div className="h-screen w-screen">
      {/* <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{" "}
      <Link to="/about" className="[&.active]:font-bold">
        About
      </Link> */}
      <Outlet />
      <TanStackRouterDevtools />
      <CommandMenu />
    </div>
  );
}
