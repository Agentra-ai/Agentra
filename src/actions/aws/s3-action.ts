import {
  GetObjectCommand,
  PutObjectCommandOutput,
  S3,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

export async function uploadImageToS3(
  file: File
): Promise<{ file_key: string; file_name: string }> {
  return new Promise(async (resolve, reject) => {
    try {
      const s3 = new S3({
        region: "eu-north-1",
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
        },
      })

      const file_key =
        "images/" + Date.now().toString() + file.name.replace(" ", "-")

      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
        Body: file,
      }
      s3.putObject(
        params,
        async (err: any, data: PutObjectCommandOutput | undefined) => {
          if (err) {
            return reject(err)
          }
          return resolve({
            file_key,
            file_name: file.name,
          })
        }
      )
    } catch (error) {
      reject(error)
    }
  })
}

export async function getS3Url(file_key: string) {
  const s3 = new S3({
    region: "eu-north-1",
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
    },
  })
  const command = new GetObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
    Key: file_key,
  })
  //@ts-ignore
  return await getSignedUrl(s3, command, { expiresIn: 3600 })
}

export async function deleteFileFromS3(fileKey: string) {
  const s3 = new S3({
    region: "eu-north-1",
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
    },
  })
  const params = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
    Key: fileKey,
  }

  try {
    await s3.deleteObject(params) ///.promise();
    console.log(`File deleted successfully: ${fileKey}`)
  } catch (error) {
    console.error(`Error deleting file: ${fileKey}`, error)
    throw error // Optional: throw the error to handle it upstream
  }
}

export async function deleteMultipleFilesFromS3(fileKeys: string[]) {
  console.log("deleting files from S3", fileKeys)
  const s3 = new S3({
    region: "eu-north-1",
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
    },
  })

  const params = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
    Delete: {
      Objects: fileKeys.map((key) => ({ Key: key })),
      Quiet: false,
    },
  }

  try {
    await s3.deleteObjects(params) ///.promise();
    console.log(`Files deleted successfully from S3: ${fileKeys}`)
  } catch (error) {
    console.error(`Error deleting files: ${fileKeys}`, error)
    throw error // Optional: throw the error to handle it upstream
  }
}
