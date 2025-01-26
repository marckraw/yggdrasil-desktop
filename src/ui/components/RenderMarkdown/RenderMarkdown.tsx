import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

const isImageUrl = (str: string) => {
  // Remove whitespace and check if it's a URL that ends with image extensions
  const trimmed = str.trim();
  return /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i.test(trimmed);
};

export const RenderMarkdown = ({ children }: { children: any }) => {
  // If the content is just an image URL, render it directly as an image
  if (typeof children === "string" && isImageUrl(children)) {
    return (
      <img
        src={children}
        alt="AI Generated"
        className="max-w-full h-auto rounded-lg my-4"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = "fallback-image-url.png";
          e.currentTarget.alt = "Image failed to load";
        }}
      />
    );
  }

  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={dark}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        // Add image handling for markdown image syntax
        img({ node, src, alt, ...props }: any) {
          return (
            <img
              src={src}
              alt={alt || "AI Generated"}
              className="max-w-full h-auto rounded-lg my-4"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = "fallback-image-url.png";
                e.currentTarget.alt = "Image failed to load";
              }}
              {...props}
            />
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
};
