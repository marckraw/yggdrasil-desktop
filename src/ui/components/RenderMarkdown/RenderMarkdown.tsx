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
        // Modify the paragraph component to handle images
        p: ({ children, ...props }) => {
          // Check if the child is an image
          const hasImg = React.Children.toArray(children).some(
            (child: any) =>
              child?.type === "img" ||
              (child?.props?.href && isImageUrl(child?.props?.href))
          );

          // If contains image, render without p wrapper
          if (hasImg) {
            return <>{children}</>;
          }

          // Otherwise render normal paragraph
          return <p {...props}>{children}</p>;
        },
        // Handle both images and links
        a({ node, href, children, ...props }: any) {
          // Check if the href is an image URL
          if (href && isImageUrl(href)) {
            return (
              <div className="relative group">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={href}
                    alt="AI Generated"
                    className="max-w-full h-auto rounded-lg my-4 cursor-zoom-in hover:opacity-90 transition-opacity"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "fallback-image-url.png";
                      e.currentTarget.alt = "Image failed to load";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg pointer-events-none" />
                </a>
              </div>
            );
          }
          // Regular link handling
          return (
            <a href={href} {...props} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          );
        },
        // Handle direct image tags
        img({ node, src, alt, ...props }: any) {
          return (
            <div className="relative group">
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={src}
                  alt={alt || "AI Generated"}
                  className="max-w-full h-auto rounded-lg my-4 cursor-zoom-in hover:opacity-90 transition-opacity"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "fallback-image-url.png";
                    e.currentTarget.alt = "Image failed to load";
                  }}
                  {...props}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg pointer-events-none" />
              </a>
            </div>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
};
