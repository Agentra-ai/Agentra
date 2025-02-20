"use client"

import React from "react"
import { redirect, usePathname } from "next/navigation"
import { Settings } from "lucide-react"
import { FaLaptopCode } from "react-icons/fa"
import { SlRocket } from "react-icons/sl"

import { EmbeddingAppModal } from "@/components/protected/Modals/embedding-app-modal"
import MonitoringChart from "@/components/protected/monitoring/monitoring-chart"
import useGetAppMonitering, {
  MonitoringDataType,
} from "@/app/services/monitoring/monitoring-service"

const getAppId = (pathname: string | null) => {
  const id = pathname?.split("/")[2]
  if (!id) {
    redirect("apps/studio")
  }
  return id
}

const Monitoring = () => {
  const pathname = usePathname()
  const appId = React.useMemo(() => getAppId(pathname), [pathname])

  const { appMonitoringData, error, isLoading } = useGetAppMonitering(appId)

  const [isEmbeddingModalOpen, setIsEmbeddingModalOpen] = React.useState(false)

  const handleOpenEmbeddingModal = () => {
    setIsEmbeddingModalOpen(true)
  }

  const handleCloseEmbeddingModal = () => {
    setIsEmbeddingModalOpen(false)
  }

  return (
    <div className="flex h-full w-full flex-col px-14 py-6 text-sm">
      {/* OpenAI Trial Quota Notification */}
      <div className="mb-6 flex flex-col gap-2 rounded-2xl border border-blue-200 bg-[#eaf1ff] p-6 shadow-sm">
        <p className="flex items-center">
          <span className="mr-2 text-2xl">😄</span>
          <span className="text-xl font-semibold">
            You are currently on Free Plan.
          </span>
        </p>
        <span className="text-gray-700">
          for start your exiciting Journey, you can checkout out pricing or
          purchase additional quota. we have Plan for Start-ups to Enterprises
          level all business.
        </span>
        <button className="mt-2 w-[160px] rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-600">
          See Pricing
        </button>
      </div>

      {/* Monitoring Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* AI Front-end Interviewer Card */}
        <div className="rounded-[8px] border bg-[#f7f9ff] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">
              AI Front-end interviewer
            </h3>
            <span className="font-medium text-green-600">In Service</span>
          </div>
          <p className="mb-2 text-sm text-gray-600">Ready-to-use AI WebApp</p>
          <div className="mb-4 p-2 text-sm">
            <p>Public URL</p>
            <div className="flex items-center justify-between rounded-[8px] bg-gray-100 p-2">
              <input
                type="text"
                value="https://dama.app/chat/qBLFbE6xtJiTqEYn"
                className="w-full border-none bg-transparent text-[13px] text-gray-700 outline-none"
                readOnly
              />
              <button className="ml-2 text-gray-600 hover:text-gray-800">
                <i className="fas fa-copy"></i>
              </button>
            </div>
          </div>
          <div className="flex space-x-4">
            <button className="flex items-center gap-1 rounded-md border bg-white px-4 py-2 text-gray-600 hover:bg-gray-50">
              {" "}
              <SlRocket size={18} /> Preview
            </button>
            <button
              className="flex items-center gap-1 rounded-md border bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
              onClick={handleOpenEmbeddingModal}
            >
              <FaLaptopCode size={18} /> Embedded
            </button>
            <button className="flex items-center gap-1 rounded-md border bg-white px-4 py-2 text-gray-700 hover:bg-gray-50">
              <Settings size={18} /> Setting
            </button>
          </div>
        </div>

        {/* Backend Service API Card */}
        <div className="relative rounded-[8px] border bg-white p-6 shadow">
          {/* Blur Layer */}
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
            <span className="text-xl font-semibold text-gray-700">
              Coming Soon...
            </span>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Backend Service API</h3>
            <span className="font-medium text-green-600">In Service</span>
          </div>
          <p className="mb-2 text-sm text-gray-600">
            Easily integrated into your application
          </p>
          <div className="mb-4 rounded bg-gray-100 p-2 text-sm">
            <p>Service API Endpoint</p>
            <div className="flex items-center justify-between">
              <input
                type="text"
                value="https://api.daama.ai/v1"
                className="w-full border-none bg-transparent text-blue-600 outline-none"
                readOnly
              />
              <button className="ml-2 text-gray-600 hover:text-gray-800">
                <i className="fas fa-copy"></i>
              </button>
            </div>
          </div>
          <div className="flex space-x-4">
            <button className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300">
              API Key
            </button>
            <button className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300">
              API Reference
            </button>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center p-4">
          Loading monitoring data...
        </div>
      ) : error ? (
        <div className="flex justify-center p-4 text-red-500">
          Error loading monitoring data. Please try again.
        </div>
      ) : (
        <MonitoringChart
          monitoringData={appMonitoringData as MonitoringDataType}
        />
        // <MonitoringChart />
      )}
      <EmbeddingAppModal
        isOpen={isEmbeddingModalOpen}
        onClose={handleCloseEmbeddingModal}
      />
    </div>
  )
}

export default Monitoring
