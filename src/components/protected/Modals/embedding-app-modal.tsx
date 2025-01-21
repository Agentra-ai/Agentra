import React, { useState } from "react"

import Modal from "@/components/modal"

interface EmbeddingAppModalProps {
  isOpen: boolean
  onClose: () => void
}

export const EmbeddingAppModal: React.FC<EmbeddingAppModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedOption, setSelectedOption] = useState(0)

  const options = [
    {
      title: "Option 1",
      iframeCode: `<iframe src="https://your-app-link-1.com" style="width: 100%; height: 100%; min-height: 700px;" frameborder="0" allow="microphone"></iframe>`,
    },
    {
      title: "Option 2",
      iframeCode: `<iframe src="https://your-app-link-2.com" style="width: 100%; height: 100%; min-height: 700px;" frameborder="0" allow="microphone"></iframe>`,
    },
    {
      title: "Option 3",
      iframeCode: `<iframe src="https://your-app-link-3.com" style="width: 100%; height: 100%; min-height: 700px;" frameborder="0" allow="microphone"></iframe>`,
    },
  ]

  return (
    <Modal isShow={isOpen} onClose={onClose} className="w-2/3 bg-gray-50 p-6">
      <h1 className="mb-4 text-xl font-bold">Embed on Website</h1>
      <p className="mb-6 text-gray-600">
        Choose the way to embed the chat app to your website.
      </p>

      <div className="mb-8 flex space-x-4">
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => setSelectedOption(index)}
            className={`w-1/3 cursor-pointer rounded-lg border p-4 ${
              selectedOption === index
                ? "border-blue-500 bg-blue-100"
                : "border-gray-300 bg-white"
            }`}
          >
            <img
              src="/images/embed-placeholder.png"
              alt={`Embed ${option.title}`}
              className="mb-4 w-full rounded-lg"
            />
            <p className="text-center font-medium">{option.title}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-gray-300 bg-white p-4 shadow">
        <h2 className="mb-4 text-lg font-medium">Embed Code</h2>
        <div className="overflow-x-auto rounded-lg bg-gray-100 p-3 font-mono text-sm">
          <code>{options[selectedOption]?.iframeCode}</code>
        </div>
        <button
          className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={() =>
            navigator.clipboard.writeText(
              options[selectedOption]?.iframeCode ?? ""
            )
          }
        >
          Copy to Clipboard
        </button>
      </div>
    </Modal>
  )
}
