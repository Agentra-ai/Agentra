import { create } from "zustand"
import { AppConfig, AppCustomization } from "@/db/schema"

type State = {
  appConfigDetails: AppConfig
  appCustomization: AppCustomization
  selectedFileKeys: { fileKey: string; docName: string }[]
  setAppConfig: (config: AppConfig) => void
  setCustomization: (customization: AppCustomization) => void
  setSelectedFileKeys: (
    keys: { fileKey: string; docName: string; isActive: boolean }[]
  ) => void
  openingStatement: string | null
  setOpeningStatement: (statement: string) => void
  refresh: boolean // Add refresh state
  setRefresh: (refresh: boolean) => void // Add setRefresh action
}

export const useAppStore = create<State>((set) => ({
  appConfigDetails: {
    id: "",
    instructions: "",
    openingStatement: "",
    followUp: false,
    suggestedQuestions: [],
    suggestedQuestionsEnabled: false,
    speechToTextEnabled: false,
    textToSpeechEnabled: false,
    textToSpeechVoice: "",
    textToSpeechLanguage: "",
    sensitiveWordAvoidanceEnabled: false,
    contextFileKeys: "",
    embedLink: "",
    createdAt: new Date(),
    appId: "",
  },
  appCustomization: {
    id: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    appId: "",
    botLogo: null,
    botName: "DamaAI Bot",
    bgColor: "#eeeeee",
    botTextColor: "#3d3d3d",
    aiChatColor: "#ffffff",
    userChatColor: "#ebf5ff",
    userTextColor: "#3d3d3d",
    botFontSize: 13,
    botFontWeight: 400,
    botFontFamily: "Arial",
  },
  selectedFileKeys: [],
  openingStatement: "",
  refresh: false, // Initialize refresh state
  setAppConfig: (config) => set(() => ({ appConfigDetails: config, refresh: true })), // Set refresh to true
  setCustomization: (customization) =>
    set(() => ({ appCustomization: customization, refresh: true })),
  setSelectedFileKeys: (keys) => set(() => ({ selectedFileKeys: keys, refresh: true })),
  setOpeningStatement: (statement) =>
    set(() => ({ openingStatement: statement, refresh: true })),
  setRefresh: (refresh) => set(() => ({ refresh }))
}))