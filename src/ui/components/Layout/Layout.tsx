import React from "react";
import { Link } from "@tanstack/react-router";
import { MessageSquare, Home, Info } from "lucide-react";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-background border-r">
        <div className="p-4">
          <h1 className="text-xl font-bold mb-6">Yggdrasil Desktop</h1>
          <nav className="space-y-2">
            <Link
              to="/"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors [&.active]:bg-accent [&.active]:text-accent-foreground"
            >
              <Home size={20} />
              Dashboard
            </Link>
            <Link
              to="/chat-page"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors [&.active]:bg-accent [&.active]:text-accent-foreground"
            >
              <MessageSquare size={20} />
              Chat
            </Link>
            <Link
              to="/about"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors [&.active]:bg-accent [&.active]:text-accent-foreground"
            >
              <Info size={20} />
              About
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
};
