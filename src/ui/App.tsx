import React from "react";
import { useThemeListener } from "./hooks/useTheme";
import { Button } from "./components/shadcn/ui/button";

export default function App() {
  useThemeListener();

  const handleClick = () => {
    console.log("Button clicked");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold underline ">Hello world!</h1>
      <Button onClick={handleClick}>This is button</Button>
    </div>
  );
}
