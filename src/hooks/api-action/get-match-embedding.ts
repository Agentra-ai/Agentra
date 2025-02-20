"use server";

import { getWorkspaceDetails } from "@/actions/workspace/workspace-action";
import { Pinecone } from "@pinecone-database/pinecone";

import { convertToAscii } from "@/lib/utils";

import { getEmbeddings } from "./embedding";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKeys: { fileKey: string; isActive: boolean }[],
  topKvalue?: number,
) {
  console.log("fileKeys", fileKeys, embeddings);
  const workspaceDetails = await getWorkspaceDetails();
  const workspaceNamespace = workspaceDetails?.workspaceVectorDB;

  if (!workspaceNamespace) {
    throw new Error("Workspacenamespace not found in workspace details");
  }

  const client = new Pinecone({
    apiKey: process.env.PINACONE_API_KEY!,
  });
  const pineconeIndex = await client.index("agentra-app-documents");
  const nameSpaceName = convertToAscii(workspaceNamespace);
  const namespace = pineconeIndex.namespace(nameSpaceName);

  const activeFileKeys = fileKeys
    .filter((file) => file.isActive)
    .map((file) => file.fileKey);

  // console.log("activeFileKeys", activeFileKeys)

  const queryResult = await namespace.query({
    topK: topKvalue || 3,
    vector: embeddings,
    includeMetadata: true,
    filter: {
      file_key: { $in: activeFileKeys },
      isActive: true,
    },
  });
  return queryResult.matches || [];
}

export async function getContext(
  query: string,
  fileKeys: { fileKey: string; isActive: boolean }[],
  topKvalue?: number,
) {
  const queryEmbeddings = await getEmbeddings(query);

  const matches = await getMatchesFromEmbeddings(
    queryEmbeddings,
    fileKeys,
    topKvalue,
  );

  // console.log("matches", matches)

  // if(matches.length === 0) {
  //   return "no document found"}
  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7,
  );

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);

  if (docs.length === 0) {
    return [];
  }
  // 5 vectors
  return docs.join("\n").substring(0, 3000);
}
