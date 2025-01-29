import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import { AzureChatOpenAI } from "@langchain/openai";

export type TBaseModel = "openai" | "anthropic" | "gemini" | "ollama" | "groq" | "fireworksAI" | "AzureOpenAI";

export type TModelKey = string;

export type TModel = {
  name: string;
  key: TModelKey;
  baseModel: TBaseModel;
  tokens: number;
  maxOutputTokens: number;
};

export const models: TModel[] = [
  // OpenAI Models
  {
    name: "GPT-4o mini",
    key: "gpt-4o-mini",
    baseModel: "openai",
    tokens: 128000,
    maxOutputTokens: 4096,
  },
  {
    name: "GPT-4o",
    key: "gpt-4o",
    baseModel: "openai",
    tokens: 128000,
    maxOutputTokens: 4096,
  },
  {
    name: "GPT-4 Turbo",
    key: "gpt-4-turbo",
    baseModel: "openai",
    tokens: 128000,
    maxOutputTokens: 4096,
  },
  {
    name: "GPT-3.5 Turbo",
    key: "gpt-3.5-turbo-0125",
    baseModel: "openai",
    tokens: 16385,
    maxOutputTokens: 4096,
  },

  // Anthropic Models
  {
    name: "Claude 3 Opus",
    key: "claude-3-opus-20240229",
    baseModel: "anthropic",
    tokens: 200000,
    maxOutputTokens: 4096,
  },
  {
    name: "Claude 3 Sonnet",
    key: "claude-3-sonnet-20240229",
    baseModel: "anthropic",
    tokens: 200000,
    maxOutputTokens: 4096,
  },
  {
    name: "Claude 3 Haiku",
    key: "claude-3-haiku-20240307",
    baseModel: "anthropic",
    tokens: 200000,
    maxOutputTokens: 4096,
  },

  // Gemini Models
  {
    name: "Gemini 1.5 Pro",
    key: "gemini-1.5-pro-latest",
    baseModel: "gemini",
    tokens: 1048576,
    maxOutputTokens: 8192,
  },
  {
    name: "Gemini 1.5 Flash",
    key: "gemini-1.5-flash-latest",
    baseModel: "gemini",
    tokens: 1048576,
    maxOutputTokens: 8192,
  },
  {
    name: "Gemini Pro",
    key: "gemini-pro",
    baseModel: "gemini",
    tokens: 32768,
    maxOutputTokens: 8192,
  },

  // Groq Models
  {
    name: "Llama 3 70B",
    key: "llama3-70b-8192",
    baseModel: "groq",
    tokens: 8192,
    maxOutputTokens: 8192,
  },
  {
    name: "Llama 3 8B",
    key: "llama3-8b-8192",
    baseModel: "groq",
    tokens: 8192,
    maxOutputTokens: 8192,
  },
  {
    name: "Mixtral 8x7B",
    key: "mixtral-8x7b-32768",
    baseModel: "groq",
    tokens: 32768,
    maxOutputTokens: 4096,
  },
];

export const createInstance = async (model: TModel, apiKey: string) => {
  const temperature = 0.4;
  const topP = 1.0;
  const topK = 40;
  const maxTokens = model.maxOutputTokens;

  switch (model.baseModel) {
    case "openai":
      return new ChatOpenAI({
        model: model.key,
        streaming: true,
        apiKey,
        temperature,
        maxTokens,
        topP,
        maxRetries: 2,
      });
    case "anthropic":
      return new ChatAnthropic({
        model: model.key,
        streaming: true,
        apiKey,
        maxTokens,
        temperature,
        topP,
        topK,
        maxRetries: 2,
      });
    case "gemini":
      return new ChatGoogleGenerativeAI({
        model: model.key,
        apiKey,
        maxOutputTokens: maxTokens,
        streaming: true,
        temperature,
        maxRetries: 1,
        topP,
        topK,
      });
    case "groq":
      return new ChatGroq({
        model: model.key,
        apiKey,
        maxTokens,
        temperature,
        streaming: true,
        maxRetries: 2,
      });
    case "fireworksAI":
      return new ChatFireworks({
        model: model.key,
        apiKey,
        maxTokens,
        temperature,
        topP,
        streaming: true,
        maxRetries: 2,
      });
    default:
      throw new Error("Invalid model");
  }
};


export const getModelByKey = (key: TModelKey) => {
  return models.find((model) => model.key === key);
};

export const getTestModelKey = (key: TBaseModel): TModelKey => {
  switch (key) {
    case "openai":
      return "gpt-3.5-turbo";
    case "anthropic":
      return "claude-3-haiku-20240307";
    case "gemini":
      return "gemini-pro";
    case "ollama":
      return "phi3:latest";
    case "groq":
      return "groq:latest";
    case "fireworksAI":
      return "fireworks:latest";
    case "AzureOpenAI":
      return "azure-openai:latest";
  }
};