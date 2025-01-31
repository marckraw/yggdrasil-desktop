import * as React from "react";
import { cn } from "../../../lib/utils";
import { X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface FilePreview {
  id: string;
  base64: string;
  name: string;
  type: "image" | "pdf" | "markdown";
}

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentPropsWithoutRef<"textarea"> & {
    onFilesDrop?: (files: File[]) => void;
    attachments?: FilePreview[];
    onRemoveAttachment?: (id: string) => void;
  }
>(
  (
    { className, onFilesDrop, attachments = [], onRemoveAttachment, ...props },
    ref
  ) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const dragCounter = React.useRef(0);

    const handleDragOver = React.useCallback(
      (e: React.DragEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        e.stopPropagation();
      },
      []
    );

    const handleDragEnter = React.useCallback(
      (e: React.DragEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        if (dragCounter.current === 1) {
          setIsDragging(true);
        }
      },
      []
    );

    const handleDragLeave = React.useCallback(
      (e: React.DragEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) {
          setIsDragging(false);
        }
      },
      []
    );

    const processFile = React.useCallback(async (file: File) => {
      return new Promise<FilePreview>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            id: crypto.randomUUID(),
            base64: e.target?.result as string,
            name: file.name,
            type: file.type.startsWith("image/")
              ? "image"
              : file.type === "application/pdf"
                ? "pdf"
                : "markdown",
          });
        };
        reader.readAsDataURL(file);
      });
    }, []);

    const handleDrop = React.useCallback(
      async (e: React.DragEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        dragCounter.current = 0;

        const files = Array.from(e.dataTransfer.files);

        if (files.length === 0) return;

        if (onFilesDrop) {
          onFilesDrop(files);
        }
      },
      [onFilesDrop]
    );

    const handlePaste = React.useCallback(
      async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const items = Array.from(e.clipboardData.items);
        const files = items
          .map((item) => item.getAsFile())
          .filter((file): file is File => file !== null);

        if (files.length === 0) return;

        if (onFilesDrop) {
          onFilesDrop(files);
        }
      },
      [onFilesDrop]
    );

    return (
      <div className="relative w-full h-full">
        {isDragging && (
          <div className="absolute inset-0 border-2 border-dashed border-primary/50 bg-primary/5 rounded-md pointer-events-none z-10 flex items-center justify-center">
            <div className="text-primary/50 text-sm font-medium">
              Drop image here
            </div>
          </div>
        )}
        <textarea
          ref={ref}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onPaste={handlePaste}
          className={cn(
            "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
        {attachments.length > 0 && (
          <div className="absolute top-2 right-2 flex flex-wrap gap-1 w-[120px]">
            {attachments.slice(0, 4).map((preview) => (
              <TooltipProvider key={preview.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative group w-[55px] h-[55px]">
                      {preview.type === "image" ? (
                        <img
                          src={preview.base64}
                          alt={preview.name}
                          className="w-full h-full object-cover rounded-md border border-border"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center rounded-md border border-border bg-muted">
                          <span className="text-2xl">
                            {preview.type === "pdf" ? "📄" : "📝"}
                          </span>
                        </div>
                      )}
                      <button
                        onClick={() => onRemoveAttachment?.(preview.id)}
                        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        type="button"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{preview.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            {attachments.length > 4 && (
              <div className="flex items-center justify-center w-[55px] h-[55px] bg-muted rounded-md border border-border">
                +{attachments.length - 4}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
