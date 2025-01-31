import * as React from "react";
import { cn } from "../../../lib/utils";
import { X } from "lucide-react";

interface ImagePreview {
  id: string;
  base64: string;
  name: string;
}

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentPropsWithoutRef<"textarea"> & {
    onFilesDrop?: (files: File[]) => void;
    images?: ImagePreview[];
    onRemoveImage?: (id: string) => void;
  }
>(({ className, onFilesDrop, images = [], onRemoveImage, ...props }, ref) => {
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
    if (!file.type.startsWith("image/")) return;

    return new Promise<ImagePreview>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          id: crypto.randomUUID(),
          base64: e.target?.result as string,
          name: file.name,
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

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (files.length === 0) return;

      const newPreviews = await Promise.all(files.map(processFile));
      if (onFilesDrop) {
        onFilesDrop(files);
      }
    },
    [onFilesDrop, processFile]
  );

  const handlePaste = React.useCallback(
    async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const items = Array.from(e.clipboardData.items);
      const files = items
        .filter((item) => item.type.startsWith("image/"))
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null);

      if (files.length === 0) return;

      const newPreviews = await Promise.all(files.map(processFile));
      if (onFilesDrop) {
        onFilesDrop(files);
      }
    },
    [onFilesDrop, processFile]
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
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors duration-200",
          isDragging && "border-primary/50",
          className
        )}
        {...props}
      />
      {images.length > 0 && (
        <div className="absolute top-2 right-2 flex flex-wrap gap-1 w-[120px]">
          {images.slice(0, 4).map((preview) => (
            <div key={preview.id} className="relative group w-[55px] h-[55px]">
              <img
                src={preview.base64}
                alt={preview.name}
                className="w-full h-full object-cover rounded-md border border-border"
                loading="lazy"
              />
              <button
                onClick={() => onRemoveImage?.(preview.id)}
                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                type="button"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {images.length > 4 && (
            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs px-1.5">
              +{images.length - 4}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
