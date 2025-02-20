"use server";

import { insertVectorsDataToPG } from "@/actions/vectors/vectordb-action";
import { getWorkspaceDetails } from "@/actions/workspace/workspace-action";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { v4 as uuidv4 } from "uuid";

import { convertToAscii } from "@/lib/utils";

import { getEmbeddings } from "./embedding";
import { getS3Url } from "./s3";

export const getPineconeClient = () => {
  return new Pinecone({
    // environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINACONE_API_KEY!,
  });
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function loadFilesIntoPinecone(
  fileKey: string,
  embeddingModal: string,
  chunkOverlap: number,
  maxChunkLength: number,
  newFileId: string,
  isDocsHub: boolean = false,
) {
  const workspaceDetails = await getWorkspaceDetails();
  const workspaceNamespace = workspaceDetails?.workspaceVectorDB;

  if (!workspaceNamespace) {
    throw new Error("Workspace namespace not found in workspace details");
  }

  const AWS_s3_url = await getS3Url(fileKey);
  console.log(AWS_s3_url);

  const blobData = await fetchFileFromUrl(AWS_s3_url);
  // console.log("blobData : ", blobData)

  const textContent = await extractTextFromBlob(blobData);
  // console.log("textContent : ", textContent)

  const clearslashDeleteContent = textContent.replace(/\n/g, "");
  // console.log("clearslashDeleteContent : ", textContent)

  console.log("textContent length : ", clearslashDeleteContent);

  const splitterList = await splitTextContent(
    clearslashDeleteContent,
    maxChunkLength,
    chunkOverlap,
  );
  console.log("splitterList : ", splitterList);

  const documents = splitterList.map(
    (content, index) =>
      new Document({
        pageContent: content,
        metadata: {
          pageNumber: index + 1,
          text: content,
          file_key: fileKey,
          isDocshub: isDocsHub,
        },
      }),
  );

  console.log("documents : ", documents);

  const vectors = await Promise.all(
    documents.map((doc) => embedDocument(doc, embeddingModal)),
  );

  console.log("vectors : ", vectors);
  await upsertVectorsToPinecone(vectors, workspaceNamespace, newFileId);

  // Return a plain object instead of a Document instance
  return {
    pageContent: documents[0]?.pageContent,
    metadata: documents[0]?.metadata,
  };
}

// New helper functions
async function fetchFileFromUrl(url: string): Promise<Blob> {
  const response = await fetch(url);
  return await response.blob();
}

async function extractTextFromBlob(blobData: Blob): Promise<string> {
  const loader = new WebPDFLoader(blobData);
  const docsPages = await loader.load();
  let textContent = "";
  docsPages.forEach((doc) => {
    textContent += doc.pageContent + " ";
  });
  return textContent;
}

export async function splitTextContent(
  textContent: string,
  chunkSize: number = 300,
  chunkOverlap: number = 20,
): Promise<string[]> {
  // Validate and enforce constraints
  if (chunkSize < 50) chunkSize = 50; // Minimum chunk size
  if (chunkOverlap < 10) chunkOverlap = 10; // Minimum overlap
  if (chunkSize > 5000) chunkSize = 5000; // Maximum chunk size
  if (chunkOverlap > 2000) chunkOverlap = 2000; // Maximum overlap
  if (chunkOverlap >= chunkSize) chunkOverlap = chunkSize - 1; // Ensure overlap is less than chunk size

  console.log("chunkSize:", chunkSize, "chunkOverlap:", chunkOverlap);
  console.log("textContent length:", textContent.length);

  const parts: string[] = []; // Array to store the final chunks
  let start = 0;

  // Iterate through the text and split it into chunks
  while (start < textContent.length) {
    let end = start + chunkSize;

    // Ensure we don't split in the middle of a word
    if (end < textContent.length) {
      // Try to find the nearest space or newline
      let spaceIndex = textContent.lastIndexOf(" ", end);
      let newlineIndex = textContent.lastIndexOf("\n", end);

      // Choose the closest delimiter (space or newline)
      let delimiterIndex = Math.max(spaceIndex, newlineIndex);

      if (delimiterIndex > start) {
        // If a delimiter is found, adjust the end position to the delimiter
        end = delimiterIndex;
      } else {
        // If no delimiter is found, extend the chunk by 20 characters
        let extendedEnd = Math.min(end + 20, textContent.length);

        // Check if a space or newline is found within the extended range
        let extendedSpaceIndex = textContent.indexOf(" ", end);
        let extendedNewlineIndex = textContent.indexOf("\n", end);

        if (extendedSpaceIndex !== -1 && extendedSpaceIndex <= extendedEnd) {
          end = extendedSpaceIndex; // Split at the space
        } else if (
          extendedNewlineIndex !== -1 &&
          extendedNewlineIndex <= extendedEnd
        ) {
          end = extendedNewlineIndex; // Split at the newline
        } else {
          end = extendedEnd; // No delimiter found, extend by 20 characters
        }
      }
    } else {
      // If we're at the end of the text, set end to the text length
      end = textContent.length;
    }

    // Extract the chunk
    const chunk = textContent.slice(start, end);
    parts.push(chunk);

    // Move the start position forward
    if (end < textContent.length) {
      // Calculate the overlap start position
      let overlapStart = Math.max(end - chunkOverlap, start + 1);

      // Check if a delimiter is found within the overlap range
      let overlapSpaceIndex = textContent.indexOf(" ", overlapStart);
      let overlapNewlineIndex = textContent.indexOf("\n", overlapStart);
      let overlapDelimiterIndex = Math.min(
        overlapSpaceIndex === -1 ? Infinity : overlapSpaceIndex,
        overlapNewlineIndex === -1 ? Infinity : overlapNewlineIndex,
      );

      if (overlapDelimiterIndex <= end) {
        start = overlapDelimiterIndex + 1; // Start from the delimiter
      } else {
        start = overlapStart; // No delimiter found, split at exactly the overlap boundary
      }
    } else {
      start = end; // End of text
    }
  }

  console.log("Total parts:", parts.length);
  return parts;
}
//with upsert, we are saving it to PostgresDB
async function upsertVectorsToPinecone(
  vectors: PineconeRecord[],
  workspaceNamespace: string,
  newFileId: string,
) {
  const client = await getPineconeClient();
  const pineconeIndex = await client.index("agentra-app-documents");
  const nameSpaceName = convertToAscii(workspaceNamespace);
  const namespace = pineconeIndex.namespace(nameSpaceName);

  console.log("inserting vectors into pinecone");
  await namespace.upsert(vectors);
  console.log("inserted vectors into pinecone in PG");

  const dataSaveToPG = vectors.map((vector) => {
    return {
      vectorId: vector.id,
      filekey: String(vector.metadata?.file_key ?? ""),
      content: String(vector.metadata?.text ?? ""),
    };
  });

  await insertVectorsDataToPG(dataSaveToPG, newFileId);
  console.log("done");
}

export async function embedDocument(doc: Document, embeddingModal?: string) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent, embeddingModal);
    const upsertId = uuidv4();
    console.log();
    const Metadata = {
      text: doc.metadata.text,
      pageNumber: doc.metadata.pageNumber as number,
      file_key: doc.metadata.file_key as string,
      isActive: true,
      isDocshub: doc.metadata.isDocshub as boolean,
    };
    console.log("metadata", Metadata);
    return {
      id: upsertId,
      values: embeddings,
      metadata: Metadata,
    } as PineconeRecord;
  } catch (error) {
    console.log("error embedding document", error);
    throw error;
  }
}

export const truncateStringByBytes = (str: string, bytes: number): string => {
  const enc = new TextEncoder();
  const text = new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
  return text;
};
