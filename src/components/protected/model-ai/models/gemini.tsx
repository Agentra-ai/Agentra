import { Button } from "@/components/ui/button";
import { Flex } from "@/components/ui/flex";
import { Input } from "@/components/ui/input";
import { ArrowRight, Info } from "lucide-react";
// import { ArrowRight, Info } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export const GeminiSettings = () => {
  const [key, setKey] = useState<string>("");
  // const { apiKeys, updateApiKey } = usePreferenceContext();
  // const { renderSaveApiKeyButton } = useLLMTest();
  // useEffect(() => {
  //   setKey(apiKeys.gemini || "");
  // }, [apiKeys.gemini]);
  return (
    <Flex direction={"col"} gap={"sm"}>
      <div className="flex flex-row items-end justify-between">
        <p className="text-xs text-zinc-500 md:text-sm">
          Google Gemini API Key
        </p>
      </div>
      <Input
        placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
        type="password"
        autoComplete="off"
        value={key}
        onChange={(e) => {
          setKey(e.target.value);
        }}
      />

      <div className="flex flex-row items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            window.open("https://aistudio.google.com/app/apikey", "_blank");
          }}
        >
          Get your API key here{" "}
          <ArrowRight size={16} className="font-semibold" />
        </Button>
        {/* {key &&
          key !== apiKeys?.gemini &&
          renderSaveApiKeyButton("gemini", key, () => {
            updateApiKey("gemini", key);
          })}
        {apiKeys?.gemini && (
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => {
              setKey("");
              updateApiKey("gemini", "");
            }}
          >
            Remove API Key
          </Button>
        )} */}
      </div>

      <div className="flex flex-row items-center gap-1 py-2 text-zinc-500">
        <Info size={16} className="font-semibold" />
        <p className="text-xs">
          Your API Key is stored locally on your browser and never sent anywhere
          else.
        </p>
      </div>
    </Flex>
  );
};
