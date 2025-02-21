import { EmbeddingModal } from "@/drizzle/schema";

interface S3Data {
  file_key: string;
  file_name: string;
}

export const CreateNewDocs = async (
  data: S3Data,
  newDocumentId: string,
  newFileId: string,
  fileSizeInMB: string,
  embeddingModal: EmbeddingModal,
  documentName: string,
  maxChunkLength: number,
  chunkOverlap: number,
  isDocsHub: boolean = false,
) => {
  console.log("file size in MB", fileSizeInMB);

  try {
    const response = await fetch("/api/documents/create-docs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // user,
        data,
        newDocumentId,
        newFileId,
        fileSizeInMB,
        embeddingModal,
        documentName,
        maxChunkLength,
        chunkOverlap,
        isDocsHub,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create docs in server.");
    }
  } catch (error) {
    console.error("Error inserting data:", error);
    // toast({
    //   title: "Error",
    //   description: "Failed to Save file.",
    //   variant: "destructive",
    // });
  }
};

// export const LoadDocsInPinacone = async (
//   AWSS3data: S3Data,
//   embeddingModal: string,
//   chunkOverlap: number,
//   maxChunkLength: number,
//   fileId: string,
//   isDocsHub: boolean = false,
// ) => {

//   await loadFilesIntoPinecone(
//     AWSS3data.file_key,
//     embeddingModal,
//     chunkOverlap,
//     maxChunkLength,
//     fileId,
//     isDocsHub,
//   );
// };
