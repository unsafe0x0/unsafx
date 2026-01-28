import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

import ReactMarkdown from "react-markdown";

export function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex flex-col max-w-[90%] sm:max-w-[90%] rounded-2xl px-5 py-4 text-sm leading-relaxed transition-all duration-200",
        role === "user"
          ? "self-end bg-accent text-accent-foreground ml-auto"
          : "self-start bg-card text-card-foreground",
      )}
    >
      <div className="font-normal">
        <ReactMarkdown
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>;
            },
            ul({ children }) {
              return (
                <ul className="list-disc pl-4 mb-2 last:mb-0">{children}</ul>
              );
            },
            ol({ children }) {
              return (
                <ol className="list-decimal pl-4 mb-2 last:mb-0">{children}</ol>
              );
            },
            li({ children }) {
              return <li className="mb-1 last:mb-0">{children}</li>;
            },
            code({ children, className, ...props }: any) {
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <code
                  className={cn(
                    "bg-muted px-1.5 py-0.5 rounded font-mono text-xs",
                    className,
                  )}
                  {...props}
                >
                  {children}
                </code>
              ) : (
                <code
                  className={cn(
                    "bg-muted px-1.5 py-0.5 rounded font-mono text-xs",
                    className,
                  )}
                  {...props}
                >
                  {children}
                </code>
              );
            },
            pre({ children }) {
              return (
                <pre className="bg-muted p-3 rounded-lg overflow-x-auto my-2 text-xs font-mono">
                  {children}
                </pre>
              );
            },
            h1({ children }) {
              return (
                <h1 className="text-xl font-bold mb-2 mt-4 first:mt-0">
                  {children}
                </h1>
              );
            },
            h2({ children }) {
              return (
                <h2 className="text-lg font-bold mb-2 mt-4 first:mt-0">
                  {children}
                </h2>
              );
            },
            h3({ children }) {
              return (
                <h3 className="text-base font-bold mb-2 mt-3 first:mt-0">
                  {children}
                </h3>
              );
            },
            a({ children, href }) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline underline-offset-2 hover:opacity-80"
                >
                  {children}
                </a>
              );
            },
            blockquote({ children }) {
              return (
                <blockquote className="border-l-2 border-primary pl-4 py-1 my-2 bg-muted/30 italic">
                  {children}
                </blockquote>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
