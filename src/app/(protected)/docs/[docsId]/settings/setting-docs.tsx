'use client'
import React, { useState } from "react";
import {
    Settings,
    FileText,
    Lock,
    Database,
    Save,
    Search,
    // Shield,
    Zap
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { AppDocumentType } from "@/lib/db/schema";
import { useUpdateAppDocument } from "@/app/services/app-docs/app-docs-service";
import { useToast } from "@/hooks/use-toast";
import { getAppDocumentById } from "@/actions/documents/app-docs-action";

const DocsSetting: React.FC = () => {
    const [knowledgeName, setKnowledgeName] = useState("");
    const [knowledgeDescription, setKnowledgeDescription] = useState('');
    const [permission, setPermission] = useState("Only me");
    const [topK, setTopK] = useState(2);
    const [appDocument, setAppDocument] = React.useState<
        AppDocumentType | null
    >(null);
    const {toast} = useToast()
    const pathname = usePathname()
    const documentId = pathname?.split("/")[2] || ""

    const fetchDocument = async (documentId: string) => {
        const document = await getAppDocumentById(documentId);
        if (document) {
            setAppDocument(document);
            setKnowledgeName(document.name);
            setKnowledgeDescription(document.description);
        }
    };

    React.useEffect(() => {
        if (documentId) {
            fetchDocument(documentId);
        }
    }, [documentId]);

    const { updateAppDocument, isLoading: updateLoading } = useUpdateAppDocument();

    const handleUpdateDocs = async () => {
        const data = {
            name: knowledgeName,
            description: knowledgeDescription,
            icon: appDocument?.icon,
        }
        try {
            if (appDocument?.id) {
                await updateAppDocument(appDocument.id, {
                    ...data,
                    icon: appDocument?.icon || ''
                });
                toast({
                    title: "Success",
                    description: "Document updated successfully",
                    variant: "success",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update document",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex flex-col gap-8 p-10 pt-4 max-w-4xl mx-auto bg-white rounded-xl">
            <div className="flex items-center gap-2 border-b pb-5">
                <Settings className="w-7 h-7 text-black" />
                <h1 className="text-xl font-bold text-gray-800">Documents Settings</h1>
            </div>

            {/* Knowledge Name */}
            <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2.5 font-semibold text-gray-700">
                    <FileText className="w-5 h-5 text-emerald-500" />
                    Documents Name
                </label>
                <input
                    type="text"
                    value={knowledgeName}
                    onChange={(e) => setKnowledgeName(e.target.value)}
                    className="border-0 bg-gray-50 p-3.5 rounded-lg focus:outline-none text-[13px] placeholder:text-gray-400"
                />
            </div>

            {/* Knowledge Description */}
            <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2.5 font-semibold text-gray-700">
                    <FileText className="w-5 h-5 text-orange-500" />
                    Documents Description
                </label>
                <textarea
                    value={knowledgeDescription}
                    onChange={(e) => setKnowledgeDescription(e.target.value)}
                    className="border-0 bg-gray-50 p-3.5 rounded-lg focus:outline-none text-[13px] placeholder:text-gray-400 min-h-[100px]"
                    rows={3}
                />
            </div>

            {/* Permissions */}
            <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2.5 font-semibold text-gray-700">
                    <Lock className="w-5 h-5 text-purple-500" />
                    Permissions
                </label>
                <select
                    value={permission}
                    onChange={(e) => setPermission(e.target.value)}
                    className="border-0 bg-gray-50 p-3.5 rounded-lg focus:outline-none text-[13px]"
                >
                    <option>Only me</option>
                    <option>Everyone</option>
                </select>
            </div>

            {/* Index Method */}
            <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2.5 font-semibold text-gray-700">
                    <Database className="w-5 h-5 text-blue-500" />
                    Index Method
                </label>
                <div className="w-full">
                    <div className="p-5 border rounded-lg border-blue-500 bg-blue-50/50 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            <h4 className="font-semibold text-gray-800">High Quality</h4>
                        </div>
                        <p className="text-[13px] text-gray-600">
                            Call Embedding model for processing to provide higher accuracy when users query.
                        </p>
                        <p className="text-[13px] text-gray-400 mt-2 italic">
                            No other indexing methods available at the moment
                        </p>
                    </div>
                </div>
            </div>

            {/* Retrieval Setting */}
            <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2.5 font-semibold text-gray-700">
                    <Search className="w-5 h-5 text-rose-500" />
                    Retrieval Setting
                </label>
                <div className="flex flex-col bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">Inverted Index</h4>
                    <p className="text-[13px] text-gray-600 mb-4">
                        Inverted Index is a structure used for efficient retrieval. Organized by terms, each term points to
                        documents or web pages containing it.
                    </p>
                    <div className="flex items-center gap-5">
                        <label className="font-medium text-gray-700 min-w-[50px] text-[13px]">Top K</label>
                        <input
                            type="range"
                            min={1}
                            max={10}
                            value={topK}
                            onChange={(e) => setTopK(Number(e.target.value))}
                            className="flex-1 accent-[#1a55ff] border-none"
                        />
                        <span className="w-8 text-center text-gray-600 font-medium text-[13px]">{topK}</span>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <Button
                onClick={() => handleUpdateDocs()}
                className="gap-2 self-end"
                variant='blue'
                disabled={updateLoading}
            >
                <Save className="w-4 h-4" />
                <span className="text-[13px] font-medium">{updateLoading ? "updating..." : "save changes"}</span>
            </Button>
        </div>
    );
};

export default DocsSetting;
