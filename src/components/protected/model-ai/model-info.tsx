import { formatNumber } from "@/lib/helpers";

export type TBaseModel = "openai" | "anthropic" | "gemini" | "ollama";

export const models = [
  "gpt-4o",
  "gpt-4",
  "gpt-4-turbo",
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-0125",
  "gpt-3.5-turbo-instruct",
  "claude-3-opus-20240229",
  "claude-3-sonnet-20240229",
  "claude-3-haiku-20240307",
  "gemini-pro",
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro-latest",
  "phi3:latest",
];

export type TModelKey = (typeof models)[number] | string;

export type TModel = {
  name: string;
  key: TModelKey;
  isNew?: boolean;
  icon: (size: "sm" | "md" | "lg") => JSX.Element;
  inputPrice?: number;
  outputPrice?: number;
  tokens: number;
  plugins: any;
  baseModel: TBaseModel;
  maxOutputTokens: number;
};


export type TModelInfo = {
  model: TModel;
  showDetails?: boolean;
};

export const ModelInfo = ({ model, showDetails }: TModelInfo) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 text-xs md:text-sm items-center">
        {model.icon("sm")} {model.name}
      </div>
      {showDetails && (
        <>
          <div className="flex flex-row justify-between text-xs md:text-sm text-zinc-600 dark:text-zinc-400">
            <p>Tokens</p>
            <p>{formatNumber(model.tokens)} tokens</p>
          </div>
          <div className="flex flex-row justify-between text-xs md:text-sm text-zinc-600 dark:text-zinc-400">
            <p>Model</p>
            <p>{model.key}</p>
          </div>
          {model.inputPrice && (
            <div className="flex flex-row justify-between text-xs md:text-sm text-zinc-600 dark:text-zinc-400">
              <p>Input Price</p>
              <p>{model.inputPrice} USD / 1M tokens</p>
            </div>
          )}
          {model.outputPrice && (
            <div className="flex flex-row justify-between text-xs md:text-sm text-zinc-600 dark:text-zinc-400">
              <p>Output Price</p>
              <p>{model.outputPrice} USD / 1M tokens</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};