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
    <Flex direction={"col"} gap={"lg"} className="p-6 w-full bg-gradient-to-b from-gray-50/50 to-white">
      <Accordion type="single" collapsible className="w-full space-y-3">
        {modelSettingsData.map((model) => (
          <AccordionItem 
            key={model.value} 
            value={model.value}
            className={cn(
              "border border-gray-100 rounded-xl px-3",
              "bg-white/80 backdrop-blur-sm",
              "hover:shadow-md  hover:border-gray-400",
              "transition-all duration-200"
            )}
          >
            <AccordionTrigger className="py-5">
              <Flex gap={"sm"} items="center" className="flex-1">
                <div className={cn(
                  "p-2 rounded-lg",
                  model.connected ? "bg-blue-50/60" : "bg-gray-50/60"
                )}>
                  <ModelIcon type={model.iconType as ModelIconType} size="sm" />
                </div>
                <span className="font-semibold text-gray-700">{model.label}</span>
              </Flex>
              <div
                className={cn(
                  "px-4 py-1.5 rounded-full flex items-center gap-2",
                  "transition-colors duration-200",
                  model.connected 
                    ? "text-emerald-600 bg-emerald-50/70 border border-emerald-100" 
                    : "text-amber-600 bg-amber-50/70 border border-amber-100"
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
            <AccordionContent className="py-6 px-3">
              <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100">
                <model.settingsComponent />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Flex>
  );
};
