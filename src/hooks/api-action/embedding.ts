"use server"

import OpenAI from "openai"
import { Configuration, OpenAIApi } from "openai-edge"

import { env } from "@/env.mjs"
import { EmbeddingModal } from "@/db/schema"

const config = new Configuration({
  apiKey: env.OPENAI_API_KEY!,
})

const openai = new OpenAI()

// const openai = new OpenAIApi(config)

export async function getEmbeddings(text: string, selectedModel?: string) {
  console.log("text for embedding", text)
  const textPlace = text.replace(/\n/g, " ")
  const modal = selectedModel
    ? selectedModel
    : EmbeddingModal.TEXT_EMBEDDING_ADA_002
  try {
    const response = await openai.embeddings.create({
      model: modal,
      input: textPlace,
      ...(modal === EmbeddingModal.TEXT_EMBEDDING_3_LARGE && {
        dimensions: 1536,
      }),
    })
    console.log("response from openai embeddings api", response)
    const result = await response.data[0]?.embedding
    console.log("result from openai embeddings api", result)
    return result as number[]
  } catch (error) {
    console.log("error calling openai embeddings api", error)
    throw error
  }
}
