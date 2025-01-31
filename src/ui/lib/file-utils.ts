import { mimeTypes } from "../../config/mime.config";
import { FileType } from "../../types/upload";

export const getFileType = (file: File): FileType | null => {
  if (file.type.startsWith("image/")) return FileType.IMAGE;
  if (file.type === "application/pdf") return FileType.DOCUMENT;
  if (file.name.endsWith(".md") || file.type === "text/markdown")
    return FileType.TEXT;
  return null;
};

export const getPreviewIcon = (fileType: FileType) => {
  switch (fileType) {
    case FileType.DOCUMENT:
      return "📄";
    case FileType.TEXT:
      return "📝";
    default:
      return "📎";
  }
};

export const isFileTypeSupported = (file: File) => {
  // Add PDF mime type to document types in mime config
  if (!mimeTypes[FileType.DOCUMENT].mimes.includes("application/pdf")) {
    mimeTypes[FileType.DOCUMENT].mimes.push("application/pdf");
    mimeTypes[FileType.DOCUMENT].extensions.push(".pdf");
  }

  const supportedTypes = [
    ...mimeTypes[FileType.IMAGE].mimes,
    ...mimeTypes[FileType.DOCUMENT].mimes,
    ...mimeTypes[FileType.TEXT].mimes,
  ];

  return (
    supportedTypes.includes(file.type) ||
    file.name.toLowerCase().endsWith(".md") ||
    file.name.toLowerCase().endsWith(".pdf")
  );
};
