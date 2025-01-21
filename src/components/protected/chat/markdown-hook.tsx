'use client'

import { motion } from "framer-motion";
import Markdown from "marked-react";

import { CodeBlock } from "@/components/ui/code-block";
import { LinkBlock } from "@/components/ui/link-block";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ReactNode, useState } from "react";
import { ArrowUpRight, Link2 } from "lucide-react";

export const REVEAL_ANIMATION_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1, ease: "easeInOut", delay: 0.1 },
  },
};

export type TLink = {
  href: string;
  text: ReactNode;
};

type MarkdownRendererProps = {
  message: string;
  animate: boolean;
  messageId: string;
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  message,
  animate,
  messageId,
}) => {
  const [links, setLinks] = useState<TLink[]>([]);

  return (
    <Markdown
      renderer={{
        text: (children) => (
          <motion.span
            variants={REVEAL_ANIMATION_VARIANTS}
            animate={"visible"}
            initial={animate ? "hidden" : "visible"}
          >
            {children}
          </motion.span>
        ),
        table: (children) => (
          <div className="relative max-w-[80%] overflow-x-auto my-3 border border-zinc-100 rounded-xl dark:border-white/10">
            <table className="table-auto w-full text-left rtl:text-right text-sm md:text-base break-words text-gray-600 dark:text-gray-200">
              {children}
            </table>
          </div>
        ),
        tableHeader(children) {
          return (
            <thead className="text-sm md:text-base w-full font-medium text-zinc-800 uppercase bg-zinc-50 dark:bg-white/10 dark:text-white/20">
              {children}
            </thead>
          );
        },
        tableRow(children) {
          return (
            <tr className="hover:bg-zinc-50 w-full dark:bg-white/5">{children}</tr>
          );
        },
        tableCell(children) {
          return <td className="p-3 break-words">{children}</td>;
        },
        tableBody(children) {
          return <tbody className="overflow-x-auto w-full">{children}</tbody>;
        },
        paragraph: (children) => <p className="!space-y-3">{children}</p>,
        em: (children) => <em>{children}</em>,
        heading: (children, level) => {
          const Heading = `h${level}` as keyof JSX.IntrinsicElements;
          return <Heading className="space-y-4 font-geist">{children}</Heading>;
        },
        link: (href, text) => {
          if (text && href) {
            return (
              <HoverCard>
                <HoverCardTrigger>
                  <a href={href} data-message-id={messageId}>
                    {text}
                  </a>
                </HoverCardTrigger>
                <HoverCardContent
                  sideOffset={12}
                  className="p-3 rounded-xl flex max-w-[500px] flex-col items-start bg-zinc-700 hover:bg-zinc-800 cursor-pointer"
                  onClick={() => {
                    window.open(href, "_blank");
                  }}
                >
                  <p className="flex flex-row font-normal text-xs items-center gap-2 text-zinc-200 dark:text-zinc-200 leading-7 w-full whitespace-pre-wrap overflow-hidden">
                    <Link2
                      size={16}
                      className="text-white flex-shrink-0 font-semibold"
                    />
                    {href}
                    <ArrowUpRight
                      size={16}
                      className="text-white flex-shrink-0 font-semibold"
                    />
                  </p>
                </HoverCardContent>
              </HoverCard>
            );
          }
          return <></>;
        },
        blockquote: (children) => (
          <blockquote>
            <p>{children}</p>
          </blockquote>
          ),
          list: (children, ordered) =>
            ordered ? (
              <ol className="my-2 space-y-2 list-decimal pl-4">{children}</ol>
            ) : (
              <ul className="my-2 space-y-2 list-disc pl-4">{children}</ul>
            ),
          listItem: (children) => (
          <li>
            <p>{children}</p>
          </li>
        ),
        strong: (children) => <strong className="font-medium">{children}</strong>,
        hr: () => <hr className="space-y-4 border-gray-100 dark:border-white/10" />,
        code: (code, lang) => (
          <div className="my-4 w-full overflow-x-auto flex-shrink-0 not-prose">
            <CodeBlock lang={lang} code={code?.toString()} />
          </div>
        ),
        image: () => {
          return <></>;
        },
        br: () => <br className="space-y-2"/>,
        codespan: (code) => (
          <span className="px-2 py-1 text-md space-y-2 rounded-md dark:text-white bg-zinc-100 text-zinc-800 dark:bg-white/10 font-medium">
            {code}
          </span>
        ),
      }}
    >
      {message}
    </Markdown>
  );
};
