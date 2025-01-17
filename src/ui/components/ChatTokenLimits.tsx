import React from "react";

export const ChatTokenLimits = () => {
  return (
    <div className="h-10 flex items-center justify-end px-4 bg-background border-t">
      <div className="text-sm text-muted-foreground">
        Token limits: 0 / 'unknown'
      </div>
    </div>
  );
};
