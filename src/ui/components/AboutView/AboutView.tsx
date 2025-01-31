import React from "react";
import { Button } from "../shadcn/ui/button";
import { Github } from "lucide-react";

export const AboutView = () => {
  const handleOpenUrl = async (url: string) => {
    try {
      await window.electron.openUrl(url);
    } catch (error) {
      console.error("Failed to open URL:", error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">About Yggdrasil Desktop</h1>

      <div className="space-y-4">
        <p className="text-lg">
          Yggdrasil Desktop is an Electron-based application that helps you
          manage and interact with AI conversations.
        </p>

        <div className="flex gap-4 mt-8">
          <Button
            onClick={() => handleOpenUrl("http://www.google.pl")}
            variant="outline"
          >
            <Github className="mr-2" />
            View on GitHub
          </Button>
        </div>
      </div>
    </div>
  );
};
