"use client";

import React, { useEffect, useState } from "react";
import { redirect, usePathname } from "next/navigation";
import { useAppConfig } from "@/app/services/apps/app-config-service";
import { useAppStore } from "@/store/useAppStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { AiFillLike } from "react-icons/ai";
import { BsFillChatLeftHeartFill } from "react-icons/bs";
import { FaBook, FaEnvelopeOpenText, FaFileAlt } from "react-icons/fa";
import { PiFoldersFill } from "react-icons/pi";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { AppConfig } from "@/drizzle/schema";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import AddDocsModal from "@/components/protected/Modals/add-docs-modal";

// Update the schema to handle the nested fileKey structure
const formSchema = z.object({
  instructions: z.string().min(0, "Instructions are required"),
  contextFiles: z
    .array(
      z.object({
        fileKey: z.union([
          z.string(),
          z.object({
            fileKey: z.string(),
            isActive: z.boolean(),
          }),
        ]),
        docName: z.string(),
      }),
    )
    .optional(),
  opener: z.string().optional(),
  followUp: z.boolean(),
  suggestions: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

// Move this check outside the component
const getAppId = (pathname: string | null) => {
  const id = pathname?.split("/")[2];
  if (!id) {
    redirect("apps/studio");
  }
  return id;
};

const ConfigurationPage = () => {
  const pathname = usePathname();
  const appId = React.useMemo(() => getAppId(pathname), [pathname]);

  const { config, isLoading, updateConfig } = useAppConfig(appId);
  const { toast } = useToast();

  const [selectedFiles, setSelectedFiles] = useState<
    { fileKey: string; docName: string; isActive: boolean }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isOpenerVisible, setIsOpenerVisible] = useState<boolean>(false);

  const {
    appConfigDetails,
    setAppConfig,
    setSelectedFileKeys,
    setOpeningStatement,
  } = useAppStore(
    useShallow((state) => ({
      appConfigDetails: state.appConfigDetails,
      setAppConfig: state.setAppConfig,
      setSelectedFileKeys: state.setSelectedFileKeys,
      setOpeningStatement: state.setOpeningStatement,
    })),
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instructions: appConfigDetails?.instructions || "",
      contextFiles: [],
      opener: appConfigDetails?.openingStatement || undefined,  
      followUp: appConfigDetails?.followUp || true,
      suggestions: Array.isArray(appConfigDetails?.suggestedQuestions)
        ? appConfigDetails.suggestedQuestions
        : [],
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const formData = watch();

  useEffect(() => {
    if (!isLoading && config && !hasLoaded) {
      const configData: AppConfig = config as AppConfig;
      console.log(configData, "-----configData");
      if (configData) {
        setAppConfig(configData);
        setOpeningStatement(configData?.openingStatement ?? "");
      }

      setValue("instructions", configData?.instructions || "");
      setValue("opener", configData?.openingStatement || "");
      setValue("followUp", configData.followUp);
      setValue(
        "suggestions",
        Array.isArray(configData?.suggestedQuestions)
          ? configData.suggestedQuestions
          : [],
      );

      const contextFileKeys = configData.contextFileKeys
        ? typeof configData.contextFileKeys === "string"
          ? JSON.parse(configData.contextFileKeys)
          : configData.contextFileKeys
        : [];

      setSelectedFileKeys(
        Array.isArray(contextFileKeys) ? contextFileKeys : [],
      );
      setSelectedFiles(contextFileKeys);
      setValue("contextFiles", contextFileKeys);

      if (configData?.openingStatement?.trim()) {
        setIsOpenerVisible(true);
      }

      setHasLoaded(true);
    }
  }, [
    config,
    isLoading,
    setValue,
    hasLoaded,
    setAppConfig,
    setOpeningStatement,
    setSelectedFileKeys,
  ]);

  const handleAddSuggestion = () => {
    if (formData.suggestions && formData.suggestions.length < 4) {
      setValue("suggestions", [...formData.suggestions, ""]);
      setAppConfig({
        ...appConfigDetails,
        suggestedQuestions: [...formData.suggestions, ""],
      });
    }
  };

  const handleSuggestionChange = (index: number, value: string) => {
    const newSuggestions = [...(formData.suggestions || [])];
    newSuggestions[index] = value;
    setValue("suggestions", newSuggestions);
    setAppConfig({
      ...appConfigDetails,
      suggestedQuestions: newSuggestions,
    });
  };

  const handleRemoveSuggestion = (index: number) => {
    const newSuggestions = formData.suggestions
      ? formData.suggestions.filter((_, i) => i !== index)
      : [];
    setValue("suggestions", newSuggestions);
    setAppConfig({
      ...appConfigDetails,
      suggestedQuestions: newSuggestions,
    });
  };

  const handleFollowUpToggle = (checked: boolean) => {
    setValue("followUp", checked);
    setAppConfig({
      ...appConfigDetails,
      followUp: checked,
    });
  };

  const onSubmit = async (data: FormData) => {
    console.log("data:", data);
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      const normalizedContextFiles = data.contextFiles?.map((file) => ({
        fileKey:
          typeof file.fileKey === "object"
            ? file.fileKey.fileKey
            : file.fileKey,
        docName: file.docName,
      }));

      const newConfig: AppConfig = {
        ...appConfigDetails,
        id: appConfigDetails.appId,
        appId: appId,
        instructions: data.instructions,
        openingStatement: data.opener || "",
        followUp: data.followUp,  
        suggestedQuestions: data.suggestions || [],
        contextFileKeys: JSON.stringify(normalizedContextFiles || []),
      };

      setAppConfig(newConfig);

      console.log("new Config", newConfig);
      await updateConfig(newConfig);

      if (!data.opener?.trim()) {
        setIsOpenerVisible(false);
        setValue("opener", undefined);
      } else {
        setIsOpenerVisible(true);
      }

      setSubmitSuccess(true);
      toast({
        title: "Success",
        description: "Configuration updated successfully",
        variant: "default",
      });
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating config:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to update configuration",
      );
      toast({
        title: "Error",
        description: "Failed to update configuration",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelection = (
    files: { fileKey: string; docName: string; isActive: boolean }[],
  ) => {
    const updatedFiles = [...selectedFiles, ...files];
    setSelectedFiles(updatedFiles);
    setValue("contextFiles", updatedFiles);
    setSelectedFileKeys(files);
    setAppConfig({
      ...appConfigDetails,
      contextFileKeys: JSON.stringify(updatedFiles),
    });
    setIsModalOpen(false);
  };

  const handleRemoveFile = (fileKeyToRemove: string) => {
    const updatedFiles = selectedFiles.filter(
      (file) => file.fileKey !== fileKeyToRemove,
    );
    setSelectedFiles(updatedFiles);
    setValue("contextFiles", updatedFiles);
    setAppConfig({
      ...appConfigDetails,
      contextFileKeys: JSON.stringify(updatedFiles),
    });
  };

  return (
    <section className="flex min-w-[50%] border-r">
      <div className="flex-1 bg-gradient-to-br from-white to-gray-50 p-4 pr-0 pt-3">
        {/* Header */}
        <h2 className="mb-3 text-lg font-semibold text-gray-800">
          Configuration
        </h2>

        {/* Scrollable Section */}
        <div className="h-[calc(100vh-110px)] overflow-y-auto pr-3">
          {/* Instructions Section (Blue Theme) */}
          <div className="relative mb-4 rounded-xl bg-gray-50 p-[1.5px] shadow-sm">
            {/* Gradient Border */}
            <div className="absolute inset-0 z-0 rounded-[9px] bg-gradient-to-r from-blue-400 to-purple-400"></div>
            {/* Content */}
            <div className="relative rounded-lg bg-gray-50 p-2 pb-1">
              <h2 className="mb-2 flex items-center gap-2 text-[14px] font-semibold text-gray-700">
                <FaFileAlt className="text-blue-600" size={16} /> Instructions
              </h2>
              <textarea
                {...register("instructions")}
                className="h-full w-full resize-y rounded-b-[8px] border-none bg-white p-3 leading-relaxed text-gray-600 outline-none"
                rows={8}
                placeholder="Enter your instructions here..."
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setValue("instructions", e.target.value);
                  setAppConfig({
                    ...appConfigDetails,
                    instructions: e.target.value,
                  });
                }}
              />
              {errors.instructions && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.instructions.message}
                </p>
              )}
            </div>
          </div>

          {/* Context Section (Purple Theme) */}
          <div className="mb-4 rounded-xl border border-purple-100 bg-gray-50 p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[14px] font-semibold text-gray-700">
                <FaBook className="text-purple-600" size={16} /> Context
              </h2>
              <button
                type="button"
                className="rounded-lg bg-purple-100 px-3 py-1 text-sm text-black transition-colors hover:bg-purple-200"
                onClick={() => setIsModalOpen(true)}
                disabled={(formData.contextFiles || []).length >= 4}
              >
                + Add
              </button>
            </div>

            {/* Display selected files */}
            <div className="mt-2">
              {selectedFiles.length > 0 ? (
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-purple-200 bg-[#fdfcff] p-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-purple-200 p-1">
                          <PiFoldersFill
                            className="text-purple-600"
                            size={16}
                          />
                        </span>
                        <span className="text-sm text-gray-700">
                          {file.docName || "Unknown Document"}
                        </span>
                      </div>
                      <Trash2Icon
                        size={16}
                        className="cursor-pointer text-red-500 hover:text-red-600"
                        onClick={() => handleRemoveFile(file.fileKey)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="p-1 text-xs text-gray-500">No files selected.</p>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              You can import Knowledge as context.
            </p>
          </div>

          {/* Opener Section (Pink Theme) */}
          <div className="mb-4 rounded-xl border border-pink-100 bg-gray-50 p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[14px] font-semibold text-gray-700">
                <FaEnvelopeOpenText className="text-pink-600" size={16} />{" "}
                Opener Text
              </h2>
              {!isOpenerVisible && (
                <button
                  type="button"
                  className="rounded-lg bg-pink-50 px-3 py-1 text-sm text-black transition-colors hover:bg-pink-100"
                  onClick={() => setIsOpenerVisible(true)}
                >
                  + Add
                </button>
              )}
            </div>
            {isOpenerVisible && (
              <textarea
                {...register("opener")}
                className="w-full resize-y rounded-lg border bg-pink-100/20 p-3 text-sm text-gray-700 outline-none"
                rows={3}
                placeholder="Enter your opener text here..."
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setValue("opener", e.target.value);
                  setAppConfig({
                    ...appConfigDetails,
                    openingStatement: e.target.value,
                  });
                }}
              />
            )}
            {!isOpenerVisible && (
              <p className="mt-1 text-xs text-gray-500">
                In a chat app, the first sentence that the AI actively speaks to
                the user is usually used as a welcome.
              </p>
            )}
          </div>

          {/* Follow-up Toggle Section (Purple Theme) */}
          <div className="mb-4 rounded-xl border border-purple-100 bg-gray-50 p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[14px] font-semibold text-gray-700">
                <BsFillChatLeftHeartFill
                  className="text-purple-600"
                  size={16}
                />{" "}
                Follow Up
              </h2>
              <Switch
                checked={formData.followUp}
                onCheckedChange={handleFollowUpToggle}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>
            <p className="text-xs text-gray-500">
              This helps users have a human-like conversation and follow-up.
            </p>
          </div>

          {/* Suggestions Section (Blue Theme) */}
          <div className="mb-4 rounded-xl border border-blue-100 bg-gray-50 p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[14px] font-semibold text-gray-700">
                <AiFillLike className="text-blue-600" size={16} /> Suggestions
              </h2>
              <button
                type="button"
                className="rounded-lg bg-blue-100 px-3 py-1 text-sm text-black transition-colors hover:bg-blue-200"
                onClick={handleAddSuggestion}
                disabled={(formData.suggestions || []).length >= 4}
              >
                + Add
              </button>
            </div>

            {/* Display the added suggestions */}
            <div className="mt-2 space-y-2">
              {(formData.suggestions || []).map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-blue-200 bg-white p-2"
                >
                  <input
                    type="text"
                    value={suggestion}
                    placeholder={`Option ${index + 1}`}
                    onChange={(e) =>
                      handleSuggestionChange(index, e.target.value)
                    }
                    className="w-full bg-transparent text-sm text-gray-700 outline-none"
                  />
                  <Trash2Icon
                    size={16}
                    className="cursor-pointer text-red-500 hover:text-red-600"
                    onClick={() => handleRemoveSuggestion(index)}
                  />
                </div>
              ))}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              This helps users select the best option or frequently asked
              topics.
            </p>
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 py-2 text-sm text-white transition-all hover:from-purple-700 hover:to-blue-700"
            >
              {isSubmitting ? "Saving..." : "Submit"}
            </Button>
          </div>
        </div>

        {/* Modal for adding documents */}
        <AddDocsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectFile={handleFileSelection}
        />
      </div>
    </section>
  );
};

export default ConfigurationPage;
