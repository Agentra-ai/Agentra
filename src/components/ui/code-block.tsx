import hljs from "highlight.js";
import { useEffect, useRef } from "react";

import { useClipboard } from "@/hooks/use-clipboard";
import { fontIbemPlex } from "@/lib/fonts";
// import { Tooltip } from "@components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

export type codeBlockProps = {
  lang?: string;
  code?: string;
};

export const CodeBlock = ({ lang, code }: codeBlockProps) => {
  const ref = useRef<HTMLElement>(null);
  const { copiedText, copy, showCopied } = useClipboard();
  const safeLang = typeof lang === "string" ? lang : "plaintext";
  const language = hljs.getLanguage(safeLang) ? safeLang : "plaintext";

  useEffect(() => {
    if (ref?.current && code) {
      const highlightedCode = hljs.highlight(language, code).value;
      ref.current.innerHTML = highlightedCode;
    }
  }, [code, language]);

  return (
    <div className="not-prose w-full flex-shrink-0 overflow-hidden rounded-xl border border-zinc-50 bg-zinc-50/40 text-zinc-600 dark:border-white/5 dark:bg-black/30 dark:text-white">
      <div className="flex w-full items-center justify-between border-b border-zinc-50 bg-gray-100 p-1 dark:border-white/5">
        <p className="gap-1 px-2 text-xs text-zinc-500">{language}</p>
        <Button
          className="gap-1 !text-xs"
          variant="gray"
          size="sm"
          onClick={() => {
            code && copy(code);
          }}
        >
          {showCopied ? (
            <Check size={14} strokeWidth="2" />
          ) : (
            <Copy size={14} strokeWidth="2" />
          )}{" "}
          Copy
        </Button>
      </div>
      <pre className="w-full px-4 py-1">
        <code
          style={fontIbemPlex.style}
          className={`hljs language-${language} inline-block w-full overflow-x-auto whitespace-pre-wrap break-words pr-[100%] !text-[11px] tracking-wide lg:text-[12px]`}
          ref={ref}
        ></code>
      </pre>
    </div>
  );
};
