import React from "react"
import dayjs from "dayjs"

import { AppFileType, TypeVectorDBData } from "@/lib/db/schema"

type Props = {
  vectorsData: TypeVectorDBData[]
  fileId: string
  fileDetails: AppFileType
}

const FileDetails = (props: Props) => {
  const { fileId, vectorsData, fileDetails } = props
  if (!fileId) return null

  return (
    <div className="pb-6 pr-5 lg:w-[380px] lg:pl-7">
      <div className="">
        <h2 className="mb-2 text-lg font-semibold text-gray-800">Metadata</h2>
        <div className="grid grid-cols-2 gap-1">
          <p className="col-span-1 py-1 text-gray-500">
            <span className="font-semibold text-gray-500">
              Original Filename{" "}
            </span>
          </p>
          <p className="col-span-1 break-words py-1 text-gray-500">
            {fileDetails?.name}
          </p>
          <p className="col-span-1 py-1 text-gray-500">
            <span className="font-semibold text-gray-500">
              Original File Size{" "}
            </span>
          </p>
          <p className="col-span-1 py-1 text-gray-500">
            {" "}
            {fileDetails?.fileSize}MB
          </p>
          <p className="col-span-1 py-1 text-gray-500">
            <span className="font-semibold text-gray-500">Upload Date </span>
          </p>
          <p className="col-span-1 py-1 text-gray-500">
            {fileDetails?.createdAt
              ? dayjs(fileDetails.createdAt).format("MMMM D, YYYY")
              : "N/A"}
          </p>
          <p className="col-span-1 py-1 text-gray-500">
            <span className="font-semibold text-gray-500">
              Last Update Date{" "}
            </span>
          </p>
          <p className="col-span-1 py-1 text-gray-500">
            {fileDetails?.updatedAt
              ? dayjs(fileDetails.updatedAt).format("MMMM D, YYYY")
              : "N/A"}
          </p>
          <p className="col-span-1 py-1 text-gray-500">
            <span className="font-semibold text-gray-500">Source </span>
          </p>
          <p className="col-span-1 py-1 text-gray-500">Upload File</p>
          <div className="col-span-2 py-1 text-gray-500">
            <h2 className="mb-2 mt-2 text-lg font-semibold text-gray-800">
              Technical Parameters
            </h2>
          </div>

          <p className="col-span-1 py-1 text-gray-500">
            <span className="font-semibold text-gray-500">
              Chunks specification{" "}
            </span>
          </p>
          <p className="col-span-1 py-1 text-gray-500">Custom</p>
          <p className="col-span-1 py-1 text-gray-500">
            <span className="font-semibold text-gray-500">Chunks length </span>
          </p>
          <p className="col-span-1 py-1 text-gray-500">
            {fileDetails?.chunkSize ? fileDetails?.chunkSize : 0}
          </p>
          <p className="col-span-1 py-1 text-gray-500">
            <span className="font-semibold text-gray-500">chunk overlap </span>
          </p>
          <p className="col-span-1 py-1 text-gray-500">
            {fileDetails?.chunkOverlap ? fileDetails.chunkOverlap : 0}
          </p>
          <p className="col-span-1 py-1 text-gray-500">
            <span className="font-semibold text-gray-500">
              Avg. character length{" "}
            </span>
          </p>
          <p className="col-span-1 py-1 text-gray-500">
            {vectorsData.length > 0
              ? Math.floor(
                  vectorsData.reduce(
                    (acc, vector) => acc + vector?.charecterLength!,
                    0
                  ) / vectorsData.length
                )
              : "N/A"}
          </p>
          <p className="col-span-1 py-1 text-gray-500">
            <span className="font-semibold text-gray-500">Paragraphs </span>
          </p>
          <p className="col-span-1 py-1 text-gray-500">
            {vectorsData.length} paragraphs
          </p>
          <p className="col-span-1 py-1 text-gray-500">
            <span className="font-semibold text-gray-500">
              Retrieval count{" "}
            </span>
          </p>
          <p className="col-span-1 py-1 text-gray-500">0.00% (0/10)</p>
          <p className="col-span-1 py-1 text-gray-500">
            <span className="font-semibold text-gray-500">Embedding time </span>
          </p>
          <p className="col-span-1 py-1 text-gray-500">2.27 sec</p>
          <p className="col-span-1 py-1 text-gray-500">
            <span className="font-semibold text-gray-500">Embedded spend </span>
          </p>
          <p className="col-span-1 py-1 text-gray-500">1,532 tokens</p>
        </div>
      </div>
    </div>
  )
}

export default FileDetails
