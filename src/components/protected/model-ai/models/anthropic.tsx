import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Info } from "lucide-react";
// import { ArrowRight, Info } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export const AnthropicSettings = () => {
  const [key, setKey] = useState<string>("");
  // const { apiKeys, updateApiKey } = usePreferenceContext();
  // const { renderSaveApiKeyButton } = useLLMTest();
  // useEffect(() => {
  //   setKey(apiKeys.anthropic || "");
  // }, [apiKeys.anthropic]);
  return (
    <div>
      <div className="flex flex-row items-end justify-between">
        <p className="text-xs md:text-sm  text-zinc-500">Anthropic API Key</p>
      </div>
      <Input
        placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
        value={key}
        type="password"
        autoComplete="off"
        onChange={(e) => {
          setKey(e.target.value);
        }}
      />
      <div className="flex flex-row items-center justify-start gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            window.open(
              "https://console.anthropic.com/settings/keys",
              "_blank"
            );
          }}
        >
          Get your API key here <ArrowRight size={16} className="font-semibold" />
        </Button>
        {/* {key &&
          key !== apiKeys?.anthropic &&
          renderSaveApiKeyButton("anthropic", key, () => {
            updateApiKey("anthropic", key);
          })}
        {apiKeys?.anthropic && (
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => {
              setKey("");
              updateApiKey("anthropic", "");
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
    </div>
  );

};
