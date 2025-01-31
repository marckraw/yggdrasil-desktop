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
  }
>(({ className, onFilesDrop, ...props }, ref) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [previews, setPreviews] = React.useState<ImagePreview[]>([]);
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
      setPreviews((prev) => [
        ...prev,
        ...(newPreviews.filter(Boolean) as ImagePreview[]),
      ]);

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
      setPreviews((prev) => [
        ...prev,
        ...(newPreviews.filter(Boolean) as ImagePreview[]),
      ]);

      if (onFilesDrop) {
        onFilesDrop(files);
      }
    },
    [onFilesDrop, processFile]
  );

  const removePreview = React.useCallback((id: string) => {
    setPreviews((prev) => prev.filter((p) => p.id !== id));
  }, []);

  React.useEffect(() => {
    return () => {
      // Cleanup any remaining previews on unmount
      setPreviews([]);
    };
  }, []);

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
      {previews.length > 0 && (
        <div className="absolute top-2 right-2 flex flex-wrap gap-2 max-w-[200px]">
          {previews.map((preview) => (
            <div key={preview.id} className="relative group">
              <img
                src={preview.base64}
                alt={preview.name}
                className="w-[180px] h-[180px] object-cover rounded-md border border-border"
                loading="lazy"
              />
              <button
                onClick={() => removePreview(preview.id)}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
