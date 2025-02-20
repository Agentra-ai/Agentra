"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
//icons
import { CopyPlus, FilePenLine, Trash2 } from "lucide-react"
import { HiOutlineDocument, HiOutlineDocumentText } from "react-icons/hi2"

import { App } from "@/lib/db/schema"

import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import LoadingIcon from "@/components/loading"
import CreateAppModal from "@/components/protected/Modals/create-app-modal"
import DeleteAppModal from "@/components/protected/Modals/delete-app-modal"
import { useDeleteApp, useWorkspaceApps } from "@/app/services/apps/app-service"
import { LuEllipsisVertical } from "react-icons/lu"

export default function AppsStudio() {
  //hooks to manage the state of the modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedApp, setSelectedApp] = useState<App | null>(null)
  const [showOptions, setShowOptions] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [appToDelete, setAppToDelete] = useState<App | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const { deleteApp } = useDeleteApp()
  const { workspaceApps, isLoading } = useWorkspaceApps()

  // console.log(workspaceApps)
  if (!workspaceApps) return null

  const sortedWorkspaceApps: App[] = workspaceApps.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const handleDeleteConfirmation = (app: App) => {
    setAppToDelete(app)
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteApp = async () => {
    console.log("deleting....")
    if (appToDelete) {
      try {
        await deleteApp(appToDelete.id)
        toast({
          title: "App Deleted",
          description: `${appToDelete.name} has been deleted successfully.`,
          variant: "default",
        })
        setIsDeleteModalOpen(false)
        setAppToDelete(null)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete app",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="min-h-screen">
      {/* Main Section */}
      <div className="mx-auto flex flex-col py-2">
        {/* Header Section */}
        <div className="mb-4 mt-2 flex items-center justify-between px-6">
          {/* filter */}
          <div className="flex gap-6 text-[14px] text-gray-600">
            <button className="text-blue-700">All</button>
            <button>Agent</button>
            <button>Assistant</button>
            <button>HR</button>
            <button>Programming</button>
            <button>Workflow</button>
            <button>Writing</button>
          </div>
          <div className="flex space-x-4">
            <button className="rounded-[8px] px-4 py-1 text-sm text-gray-700">
              All Tags
            </button>
            <input
              type="text"
              className="rounded-[8px] border border-gray-300 px-4 py-2 text-sm"
              placeholder="Search"
            />
          </div>
        </div>

        {/* Scrollable Cards Section */}
        <div className="grid h-[calc(100vh-125px)] auto-rows-[180px] grid-cols-1 gap-6 overflow-y-auto p-2 px-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Static CREATE APP Card */}
          <div className="flex h-[180px] flex-col rounded-xl border border-gray-300 bg-gray-200 p-2 px-4 shadow-md hover:shadow-lg">
            <h2 className="text-[14px] text-gray-500">CREATE APP</h2>
            <div className="mt-4 flex flex-col items-center gap-4 text-[14px] text-gray-700">
              <Button
                variant={"gray"}
                className="text-md flex w-full gap-2 bg-gray-100 font-geist font-normal text-gray-600 hover:bg-gray-50  hover:text-blue-600"
                onClick={() => setIsModalOpen(true)}
              >
                <HiOutlineDocument size={18} />
                Create from Blank
              </Button>
              <Button
                variant={"gray"}
                className="text-md flex w-full gap-2 bg-gray-100 font-geist font-normal  text-gray-600  hover:bg-gray-50 hover:text-blue-600"
              >
                <HiOutlineDocumentText size={18} /> Create from Template
              </Button>
            </div>
          </div>
          {!isLoading && sortedWorkspaceApps.length === 0 && (
            <div className="col-span-full flex h-full flex-col items-center justify-center py-12">
              <div className="flex items-center justify-center">
                <Image
                  src="/assets/app/no-app-robot.png"
                  alt="no app"
                  width={200}
                  height={200}
                />
              </div>

              <p className="text-center text-gray-600">
                You have not created any app. you can Create from Blank or Use
                pre-build and tested Agents.
                <Link href="#" className="text-blue-600">
                  {" "}
                  Create Now...!
                </Link>
              </p>
            </div>
          )}
          {isLoading && (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <LoadingIcon />
            </div>
          )}

          {/* Mapped Apps (Scrollable) */}
          {!isLoading &&
            sortedWorkspaceApps &&
            sortedWorkspaceApps.length > 0 &&
            sortedWorkspaceApps.map((app: App) => (
              <div
                key={app.id}
                className="relative h-[180px] cursor-pointer rounded-xl border bg-white p-4 shadow-sm hover:shadow-md"
                onClick={(e) => {
                  if (!e.defaultPrevented) {
                    router.push(`/app/${app.id}/configuration`)
                  }
                }}
              >
                <div className="mb-2 flex items-center justify-between text-[12px]">
                  <div className="flex items-center justify-center">
                    {app.icon && app.icon.length > 10 ? (
                      <span className="mr-2 flex h-10 w-10 items-center justify-center rounded-[8px]">
                        <Image
                          src={app.icon ?? ""}
                          alt="🤖"
                          width={42}
                          height={42}
                        />
                      </span>
                    ) : (
                      <span className="mr-2 flex h-10 w-10 items-center justify-center rounded-[8px] bg-green-200">
                        <span className="text-[18px]">{app.icon}</span>
                      </span>
                    )}
                    <h2 className="flex flex-col text-gray-800">
                      <span className="text-[14px] font-semibold">
                        {app.name}
                      </span>
                      <span className="text-[11px] text-gray-600">
                        {app.appType}
                      </span>
                    </h2>
                  </div>
                </div>
                <p className="mt-2 text-[12px] text-gray-600">
                  {app.description}
                </p>
                <div className="absolute bottom-4 left-4 mt-2 flex items-center justify-between text-[12px] text-gray-600">
                  {Array.isArray(app.tags) &&
                    app.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="mr-2 rounded-lg bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
                {/* edit options */}
                <div
                  className="absolute bottom-4 right-4 z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  {" "}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="z-50 text-gray-600 hover:text-gray-800"
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowOptions(app.id)
                        }}
                      >
                        <LuEllipsisVertical size={18} />
                      </button>
                    </PopoverTrigger>
                    {showOptions === app.id && (
                      <PopoverContent className="absolute -right-2 -top-2 z-10 mt-2 w-36 rounded-md bg-white p-0 shadow-lg">
                        <ul className="rounded-[8px] p-1  ">
                          <li>
                            <button
                              className="flex w-full gap-2 px-2 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                setSelectedApp(app)
                                setIsModalOpen(true)
                                setShowOptions(null)
                              }}
                            >
                              <FilePenLine
                                className="h-5 w-5"
                                strokeWidth={1.5}
                              />{" "}
                              Edit info
                            </button>
                          </li>
                          <li>
                            <button className="flex w-full gap-2 px-2 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                              <CopyPlus className="h-5 w-5" strokeWidth={1.5} />
                              Duplicate
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleDeleteConfirmation(app)}
                              className="flex w-full gap-2 px-2 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Trash2
                                className="h-5 w-5 text-red-500"
                                strokeWidth={1.5}
                              />
                              Delete
                            </button>
                          </li>
                        </ul>
                      </PopoverContent>
                    )}
                  </Popover>
                </div>
              </div>
            ))}
        </div>
      </div>
      <CreateAppModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedApp(null)
        }}
        selectedAppDetails={selectedApp}
      />
      <DeleteAppModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={() => setIsDeleteModalOpen(false)}
        confirmDeleteApp={confirmDeleteApp}
        appToDelete={appToDelete as App} // Pass the appToDelete id
      />
    </div>
  )
}
