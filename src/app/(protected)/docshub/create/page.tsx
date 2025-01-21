"use client"

import React, { useState, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { getUserDetails } from "@/actions/user"
import * as PDFJS from "pdfjs-dist/legacy/build/pdf.mjs"
import { FaFileAlt } from "react-icons/fa"
import { HiAdjustmentsHorizontal } from "react-icons/hi2"
import { IoEarth } from "react-icons/io5"
import { v4 as uuidv4 } from "uuid"

import { AppDocuments, Appfile, EmbeddingModal, User } from "@/db/schema" // I

import { loadFilesIntoPinecone } from "@/hooks/api-action/pinacone"
import { getS3Url, uploadToS3 } from "@/hooks/api-action/s3"
import { toast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import LoadingIcon from "@/components/loading"
import FileUpload from "@/components/protected/file-upload"
import { CreateNewDocs } from "@/components/protected/file-upload/create-new-docs"

type Props = {}

const CreateAppDocument = (props: Props) => {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [documentName, setDocumentName] = useState<string>("New documents")
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [uploadComplete, setUploadComplete] = useState<boolean>(false)
  const [embeddingModal, setEmbeddingModal] = useState<EmbeddingModal>(
    EmbeddingModal.TEXT_EMBEDDING_ADA_002
  )
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [customDelimiter, setCustomDelimiter] = useState<string>("\\n\\n")
  const [maxChunkLength, setMaxChunkLength] = useState<number>(500)
  const [chunkOverlap, setChunkOverlap] = useState<number>(50)
  const [fileName, setFileName] = useState<string | null>(null)
  const [uploading, setUploading] = React.useState(false)
  const navigate = useRouter()
 
  const searchParams = useSearchParams()
  // /apps/documents/create?isDocshub=true&_rsc=jigap
  const isDocshub = searchParams?.get('isDocshub') === 'true';

  console.log("isDocsHub", isDocshub)
  
  const docIdRef = useRef<string>(uuidv4())
  const fileIfRef = useRef<string>(uuidv4())
  console.log("newDocumentId", docIdRef.current, )

  const steps = [
    "Choose data source",
    "Text Preprocessing",
    "Execute and finish",
  ]

  const handleFileSelected = (file: File | null) => {
    setSelectedFile(file)
    if (file) {
      setFileName(file.name)
    }
  }

  const handleNextStep = async () => {
    if (currentStep === 2) {
      setCurrentStep(currentStep + 1)
      try {
        await uploadAndEmbedFile()
        setUploadProgress(100)
        setUploadComplete(true)
      } catch (error) {
        console.error(error)
      }
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1)
  }

  // const handleFinish = () => {
  //   console.log("Document Name:", documentName)
  //   console.log("Chunk lenth:",maxChunkLength )
  //   console.log("Chunk overlap:",chunkOverlap )
  // }

  const simulateProgress = () => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          return 90
        }
        return prev + Math.random() * 3
      })
    }, 500)
    return interval
  }

  const uploadAndEmbedFile = async () => {
    if (!selectedFile || selectedFile.size === 0 || selectedFile === null) {
      toast({
        title: "Error",
        description: "No file selected",
        variant: "destructive",
      })
      return
    }

    const AWSS3data = await uploadToS3(selectedFile as File)
    try {
      const user = await getUserDetails()

      setUploading(true)
      const progressInterval = simulateProgress()
      // Clear the progress interval and set to 100%
      clearInterval(progressInterval)
      setUploadProgress(100)
      setUploadComplete(true)

      
      const fileSizeInMB = (selectedFile.size / (1024 * 1024)).toFixed(2)
      await CreateNewDocs(
        user as User,
        AWSS3data,
        toast,
        docIdRef.current,
        fileIfRef.current,
        fileSizeInMB,
        embeddingModal,
        documentName,
        maxChunkLength,
        chunkOverlap,
        isDocshub
      )

      await new Promise((resolve) => setTimeout(resolve, 3000))

      await loadFilesIntoPinecone(
        AWSS3data.file_key,
        embeddingModal,
        chunkOverlap,
        maxChunkLength,
        fileIfRef.current,
        isDocshub
      )

      setUploadProgress(90)
      setTimeout(() => {
        clearInterval(progressInterval)
        setUploadProgress(100)
        setUploadComplete(true)
      }, 5000)

      setUploading(false)
      setUploadComplete(true)
      setUploadProgress(100)
      setSelectedFile(null)
      
      toast({
        title: "Success",
        description: "File uploaded successfully!",
        variant: "default",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "File upload failed",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex size-full bg-white p-6 text-[13px]">
      {/* Sidebar Stepper component */}
      <div className="mr-4 w-1/5 items-center justify-center border-r">
        <div className="flex flex-col">
          {steps.map((stepLabel, index) => (
            <div key={index} className="flex flex-col">
              <div className="mb-8 flex items-center">
                <div className="relative flex items-center">
                  <div
                    className={`z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
                      currentStep > index
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >   
                    {index + 1}
                  </div>
                  {
                    <div
                      className={`absolute left-4 top-4 -z-10 h-12 w-2 transition-all duration-300 ${
                        currentStep > index ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    ></div>
                  }
                </div>
                <span className="ml-4">{stepLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="w-4/5 pl-4">
        {currentStep === 1 && (
          <div>
            <div className="mb-4">
              <label className="mb-2 block text-lg font-medium">
                Document Name
                <Input
                  type="text"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  className="mt-1 block w-full rounded border bg-slate-100 p-2 text-[13px]"
                />
              </label>
            </div>
            <h2 className="mb-4 text-xl font-bold">Choose data source</h2>
            {/* Options for data source selection */}
            <div className="flex gap-3">
              <button className="mb-2 mr-2 flex items-center rounded-lg border border-blue-600 bg-blue-50 p-2 py-3 text-black">
                <FaFileAlt className="text-blue-600" /> Import from file
              </button>
              <button className="mb-2 mr-2 flex items-center rounded-lg border bg-white p-2 text-black">
                <IoEarth /> Sync from website
              </button>
            </div>
            {/* Upload file section */}
            <div className="w-[500px]">
              <FileUpload
                onFileSelected={handleFileSelected || null}
                fileName={fileName}
                setFileName={setFileName}
              />
            </div>
            <Button
              onClick={handleNextStep}
              disabled={!selectedFile}
              className="mt-2"
            >
              Next step
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex h-full py-2">
            {/* Left side: Embedding model selection and custom settings */}
            <div className="w-[60%] pr-4">
              {/* Custom settings interface */}
              <div className="rounded-lg border-[1.5px] border-blue-600 bg-white p-6 pb-8">
                <h3 className="mb-2 flex items-center text-lg font-semibold  text-black">
                  <span className="mr-2 flex items-center justify-center rounded-lg bg-blue-500/10 p-2">
                    <HiAdjustmentsHorizontal className="text-[#1a55ff]" />
                  </span>
                  Custom
                </h3>
                <p className="mb-4 text-gray-500">
                  Customize chunks rules, chunks length, and preprocessing
                  rules, etc.
                </p>
                <hr className="my-4 border-gray-200" />
                <div className="space-y-4">
                  {/* Embedding model selection */}
                  <div>
                    <label className="mb-1 block font-medium text-black">
                      Select Model
                    </label>
                    <Select
                      onValueChange={(value) =>
                        setEmbeddingModal(value as EmbeddingModal)
                      }
                    >
                      <SelectTrigger className="focus:ring- w-full rounded-md border border-gray-300 bg-gray-100 p-[6px] shadow-sm focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue
                          placeholder="Select Model"
                          defaultValue={embeddingModal}
                        />
                      </SelectTrigger>
                      <SelectContent className="text-[13px]">
                        <SelectItem
                          className="border-none"
                          value={EmbeddingModal.TEXT_EMBEDDING_3_LARGE}
                        >
                          {EmbeddingModal.TEXT_EMBEDDING_3_LARGE}
                        </SelectItem>
                        <SelectItem
                          className="border-none"
                          value={EmbeddingModal.TEXT_EMBEDDING_3_SMALL}
                        >
                          {EmbeddingModal.TEXT_EMBEDDING_3_SMALL}
                        </SelectItem>
                        <SelectItem
                          className="border-none"
                          value={EmbeddingModal.TEXT_EMBEDDING_ADA_002}
                        >
                          {EmbeddingModal.TEXT_EMBEDDING_ADA_002}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1 block font-medium text-black">
                      Delimiter
                    </label>
                    <Input
                      type="text"
                      value={customDelimiter}
                      onChange={(e) => setCustomDelimiter(e.target.value)}
                      className="w-full rounded-md border border-gray-300 bg-gray-100 p-2 text-[13px] shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled
                    />
                  </div>

                  {/* Maximum chunk length */}
                  <div>
                    <label className="mb-1 block font-medium  text-black">
                      Maximum chunk length
                    </label>
                    <Input
                      type="number"
                      value={maxChunkLength}
                      onChange={(e) =>
                        setMaxChunkLength(Number(e.target.value))
                      }
                      className="w-full rounded-md border border-gray-300 bg-gray-100 p-2 text-[13px] shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  {/* Chunk overlap */}
                  <div>
                    <label className="mb-1 block font-medium  text-black">
                      Chunk overlap
                    </label>
                    <Input
                      type="number"
                      value={chunkOverlap}
                      onChange={(e) => setChunkOverlap(Number(e.target.value))}
                      className="w-full rounded-md border border-gray-300 bg-gray-100 p-2 text-[13px] shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <Button
                  onClick={handlePreviousStep}
                  className="bg-gray-200 text-black hover:bg-gray-300"
                >
                  Previous step
                </Button>
                <Button onClick={handleNextStep}>Save and continue</Button>
              </div>
            </div>

            {/* Right side: Table */}
            <div className="w-[40%] overflow-auto pl-4">
              <table className="w-full border-collapse overflow-hidden rounded-lg">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">Use Case</th>
                    <th className="border px-4 py-2">Chunk Size</th>
                    <th className="border px-4 py-2">Overlap</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">Semantic Search</td>
                    <td className="border px-4 py-2">200–300 tokens</td>
                    <td className="border px-4 py-2">50-70 tokens</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Question Answering</td>
                    <td className="border px-4 py-2">400–600 tokens</td>
                    <td className="border px-4 py-2">50–100 tokens</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Summarization</td>
                    <td className="border px-4 py-2">500–1,000 tokens</td>
                    <td className="border px-4 py-2">50–100 tokens</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Document Embedding</td>
                    <td className="border px-4 py-2">500-600 tokens</td>
                    <td className="border px-4 py-2">50–70 tokens</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Legal/Technical Docs</td>
                    <td className="border px-4 py-2">800–1,200 tokens</td>
                    <td className="border px-4 py-2">100–200 tokens</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">Note:</span> The
                  minimum chunk size is 150 tokens and the overlap is 50 tokens.
                  it will automatically adjust if the value is less than the
                  minimum.
                </p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="mb-4 text-xl font-bold">
              Uploading and Embedding...
            </h2>
            <div className="mb-4 w-full">
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${Math.round(uploadProgress)}%` }}
                />
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {!uploadComplete
                  ? `processing... ${Math.round(uploadProgress)}%`
                  : "Done 100%"}
              </div>
            </div>
            {uploadComplete && (
              <div className="mt-4">
                <p className="text-green-600">
                  File saved and embedded Successfully.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <Button variant="outline" onClick={handlePreviousStep}>
                    Back
                  </Button>
                  <Button
                    onClick={() => {
                      navigate.push(`/docs/${docIdRef.current}/documents`)
                    }}
                  >
                    Go to File
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateAppDocument
