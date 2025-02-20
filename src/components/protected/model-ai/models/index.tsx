// import { usePreferenceContext } from "@/context";
import { OpenAISettings } from "./openai";
import { AnthropicSettings } from "./anthropic";
import { GeminiSettings } from "./gemini";
import { OllamaSettings } from "./ollama";
import { Flex } from "@/components/ui/flex";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { ModelIcon, ModelIconType } from "../model-icon";
import { AlertCircleIcon, CheckCircleIcon } from "lucide-react";

export const ModelSettings = () => {
  // const { apiKeys } = usePreferenceContext();
  const apiKeys = {
    openai: "openai",
    anthropic: "anthropic",
    gemini: "gemini",
    ollama: "ollama",
  };
  const modelSettingsData = [
    {
      label: "OpenAI",
      value: "openai",
      iconType: "openai",
      connected: !!apiKeys.openai,
      settingsComponent: OpenAISettings,
    },
    {
      label: "Anthropic",
      value: "anthropic",
      iconType: "anthropic",
      connected: !!apiKeys.anthropic,
      settingsComponent: AnthropicSettings,
    },
    {
      label: "Gemini",
      value: "gemini",
      iconType: "gemini",
      connected: !!apiKeys.gemini,
      settingsComponent: GeminiSettings,
    },
    {
      label: "Ollama",
      value: "ollama",
      iconType: "ollama",
      connected: !!apiKeys.ollama,
      settingsComponent: OllamaSettings,
    },
  ];

  return (
    <Flex
      direction={"col"}
      gap={"lg"}
      className="w-full bg-gradient-to-b from-gray-50/50 to-white p-6"
    >
      <Accordion type="single" collapsible className="w-full space-y-3">
        {modelSettingsData.map((model) => (
          <AccordionItem
            key={model.value}
            value={model.value}
            className={cn(
              "rounded-xl border border-gray-100 px-3",
              "bg-white/80 backdrop-blur-sm",
              "hover:border-gray-400 hover:shadow-md",
              "transition-all duration-200",
            )}
          >
            <AccordionTrigger className="py-5">
              <Flex gap={"sm"} items="center" className="flex-1">
                <div
                  className={cn(
                    "rounded-lg p-2",
                    model.connected ? "bg-blue-50/60" : "bg-gray-50/60",
                  )}
                >
                  <ModelIcon type={model.iconType as ModelIconType} size="sm" />
                </div>
                <span className="font-semibold text-gray-700">
                  {model.label}
                </span>
              </Flex>
              <div
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-1.5",
                  "transition-colors duration-200",
                  model.connected
                    ? "border border-emerald-100 bg-emerald-50/70 text-emerald-600"
                    : "border border-amber-100 bg-amber-50/70 text-amber-600",
                )}
              >
                {model.connected ? (
                  <>
                    <CheckCircleIcon size={16} strokeWidth={2.5} />
                    <span className="text-xs font-medium">Connected</span>
                  </>
                ) : (
                  <>
                    <AlertCircleIcon size={16} strokeWidth={2.5} />
                    <span className="text-xs font-medium">Not Connected</span>
                  </>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 py-6">
              <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
                <model.settingsComponent />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Flex>
  );
};
