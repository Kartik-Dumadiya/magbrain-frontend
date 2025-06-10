/* eslint-disable no-unused-vars */
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// Custom styles for chat markdown
import "../custom-markdown.css";

export default function CustomMarkdown({ children }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: ({node, ...props}) => <h1 className="mb-3 mt-2 text-2xl font-bold text-indigo-700 border-b border-indigo-200 pb-1" {...props} />,
        h2: ({node, ...props}) => <h2 className="mb-2 mt-2 text-xl font-semibold text-indigo-600 border-b border-indigo-100 pb-1" {...props} />,
        h3: ({node, ...props}) => <h3 className="mb-2 mt-2 text-lg font-semibold text-indigo-500" {...props} />,
        p: ({node, ...props}) => <p className="my-2 text-slate-800" {...props} />,
        ul: ({node, ...props}) => <ul className="list-disc pl-6 my-2" {...props} />,
        ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-2" {...props} />,
        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-orange-400 pl-4 italic bg-orange-50 my-2 py-1" {...props} />,
        code({node, inline, className, children, ...props}) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline ? (
            <div className="relative group my-3">
              <SyntaxHighlighter
                style={oneDark}
                language={match ? match[1] : null}
                PreTag="div"
                className="rounded-lg custom-scrollbar-code text-sm"
                customStyle={{
                  padding: "16px",
                  background: "#22223b",
                  fontSize: "1em",
                  fontFamily: "JetBrains Mono,monospace",
                  overflowX: "auto"
                }}
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
              <button
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-indigo-600 text-white px-2 py-1 text-xs rounded hover:bg-indigo-700 transition"
                onClick={() => navigator.clipboard.writeText(String(children))}
                title="Copy code"
              >Copy</button>
            </div>
          ) : (
            <code className="bg-yellow-100 text-orange-900 px-1 rounded" {...props}>{children}</code>
          );
        },
        table: ({node, ...props}) => (
          <div className="overflow-x-auto my-2">
            <table className="min-w-full border border-slate-200 text-sm" {...props} />
          </div>
        ),
        th: ({node, ...props}) => <th className="bg-indigo-100 px-2 py-1 border border-slate-200 font-semibold" {...props} />,
        td: ({node, ...props}) => <td className="px-2 py-1 border border-slate-200" {...props} />,
        // More custom renderers...
      }}
    >
      {children}
    </ReactMarkdown>
  );
}