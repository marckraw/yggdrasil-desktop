import React from "react";
import { useThemeListener } from "./hooks/useTheme";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { CommandMenu } from "./components/CommandMenu/CommandMenu";

export default function App() {
  useThemeListener();

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
