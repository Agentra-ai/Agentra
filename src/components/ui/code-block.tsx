import hljs from "highlight.js";
import { useEffect, useRef } from "react";

import { useClipboard } from "@/hooks/use-clipboard";
// import { Tooltip } from "@components/ui/tooltip";
import { Button } from "@/components/ui/button"
import { ibmPlex } from "@/app/(protected)/docshub/askme/component/font";
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
    <div className="not-prose bg-zinc-50/40 border overflow-hidden border-zinc-50 dark:border-white/5 text-zinc-600 dark:text-white dark:bg-black/30 rounded-xl w-full flex-shrink-0">
      <div className="p-1 w-full flex justify-between items-center border-b border-zinc-50 dark:border-white/5 bg-gray-100">
        <p className="text-xs px-2 gap-1 text-zinc-500">{language}</p>
          <Button
            className="!text-xs gap-1"
            variant="gray"
            size="sm"
            onClick={() => {
              code && copy(code);
            }}
          >
            {showCopied ? (
              <Check size={14}  strokeWidth="2" />
            ) : (
              <Copy size={14}  strokeWidth="2" />
            )}{" "}
            Copy
          </Button>
      </div>
      <pre className="w-full px-4 py-1">
        <code
          style={ibmPlex.style}
          className={`hljs language-${language} tracking-wide whitespace-pre-wrap break-words overflow-x-auto w-full inline-block pr-[100%] !text-[11px] lg:text-[12px]`}
          ref={ref}
        ></code>
      </pre>
    </div>
  );
};