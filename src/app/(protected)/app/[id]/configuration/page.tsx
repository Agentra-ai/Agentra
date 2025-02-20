import ConfigChat from "@/components/protected/chat/config-chat"

import ConfigurationPage from "./configuration"

const Configuration = () => {
  return (
    <div className="flex h-full flex-row overflow-hidden pb-0 pr-0 text-[13px]">
      <ConfigurationPage />
      <div className="h-[calc(100vh-110px)] flex-1">
        <ConfigChat />
      </div>
    </div>
  )
}

export default Configuration
