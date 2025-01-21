"use server"

import fs from "fs"

import { S3 } from "@aws-sdk/client-s3"
import { v4 as uuidv4 } from "uuid"

export const s3 = new S3({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
  },
})
export async function downloadFromS3(file_key: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
      }

      const obj = await s3.getObject(params)
      const file_name = `/tmp/elliott${Date.now().toString()}.pdf`

      if (obj.Body instanceof require("stream").Readable) {
        // AWS-SDK v3 has some issues with their typescript definitions, but this works
        // https://github.com/aws/aws-sdk-js-v3/issues/843pnp
        //open the writable stream and write the file
        fs.mkdirSync("/tmp", { recursive: true })
        const file = fs.createWriteStream(file_name)
        if (obj.Body) {
          const stream = require("stream")
          const readableStream = stream.Readable.from(obj.Body)
          readableStream.pipe(file).on("finish", () => resolve(file_name))
        } else {
          reject(new Error("Failed to download file: Body is undefined"))
        }
        //@ts-ignore - the typescript definitions are wrong
        obj.Body?.pipe(file).on("finish", () => {
          return resolve(file_name)
        })
        // obj.Body?.pipe(fs.createWriteStream(file_name));
      }
      console.log("File downloaded successfully", file_name)
    } catch (error) {
      console.error(error)
      reject(error)
      return null
    }
  })
}

// downloadFromS3("uploads/1693568801787chongzhisheng_resume.pdf");
