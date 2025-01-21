import { CodeBlock } from '@/components/ui/code-block';
import Link from 'next/link';
import React, { memo, useMemo, useState } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);

const remarkPlugins = [remarkGfm];

const components: Partial<Components> = {
  //@ts-ignore
  code: ({ node, inline, className, children, ...props }) => {
    // Debugging: Log the inline prop and children
    console.log("Inline code detected:", inline, "Content:", children);
  
    // Convert children to a string
    const content = String(children).replace(/\n$/, "");
  
    // Manually detect inline code
    const isInlineCode =
      inline || // Use the `inline` prop if available
      (content.trim().length > 0 && !content.includes("\n")); // Heuristic: Single-line content is likely inline code
  
    // Handle inline code (codespan)
    if (isInlineCode) {
      return (
        <span className="px-2 py-1 text-[14px] space-y-2 rounded-md dark:text-white bg-zinc-100 text-zinc-800 dark:bg-white/10 font-medium">
          {content}
        </span>
      );
    }
  
    // Handle block code
    const match = /language-(\w+)/.exec(className || "");
  
    // Check if the language is "markdown"
    if (match && match[1] === "markdown") {
      // Render as normal Markdown
      return (
        <div className="w-full overflow-x-auto flex-shrink-0 not-prose">
          <Markdown>{content}</Markdown>
        </div>
      );
    }
  
    // Default behavior for other code blocks
    return (
      <div className="my-4 w-full overflow-x-auto flex-shrink-0 not-prose">
        <CodeBlock
          lang={match ? match[1] : "plaintext"}
          code={content}
        />
      </div>
    );
  },
  pre: ({ children }) => <>{children}</>,
  // Add table components
  p: ({ children }) => <p className="p-1/2 m-0">{children}</p>,
  table: ({ children }) => (
    <table className="border-collapse w-full">{children}</table>
  ),
  thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
  th: ({ children }) => (
    <th className="border border-gray-300 p-2">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border border-gray-300 p-2">{children}</td>
  ),
  ol: ({ node, children, ...props }) => {
    return (
      <ol className="ml-3 text-gray-900" {...props}>
        {children}
      </ol>
    );
  },
  ul: ({ node, children, ...props }) => {
    return (
      <ul className="list-disc list-inside ml-3 text-gray-900 mb-0 p-0" {...props}>
        {children}
      </ul>
    );
  },
  li: ({ node, children, ...props }) => {
    return (
      <li className="" {...props}>
        {children}
      </li>
    );
  },
  strong: ({ node, children, ...props }) => {
    return (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    );
  },
  a: ({ node, children, ...props }) => {
    return (
      // @ts-expect-error
      <Link
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </Link>
    );
  },
  h1: ({ node, children, ...props }) => {
    return (
      <h3 className="font-semibold text-[14px] mt-" {...props}>
        {children}
      </h3>
    );
  },
  h2: ({ node, children, ...props }) => {
    return (
      <h3 className="font-semibold text-[14px] mt-1" {...props}>
        {children}
      </h3>
    );
  },
  h3: ({ node, children, ...props }) => {
    return (
      <h3 className="font-semibold text-[14px]  mt-1" {...props}>
        {children}
      </h3>
    );
  },
  h4: ({ node, children, ...props }) => {
    return (
      <h3 className="font-semibold text-[14px]" {...props}>
        {children}
      </h3>
    );
  },
  h5: ({ node, children, ...props }) => {
    return (
      <h3 className="text-base font-semibold text-[14px]" {...props}>
        {children}
      </h3>
    );
  },
  h6: ({ node, children, ...props }) => {
    return (
      <h3 className="text-sm font-semibold text-[14px]" {...props}>
        {children}
      </h3>
    );
  },
};