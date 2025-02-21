import React from "react";

import AppCustomizationPanel from "@/components/protected/customization/customization-panel";
import CustomizedChat from "@/components/protected/customization/customized-chat";

type Props = {};

const Customization = (props: Props) => {
  return (
    <div className="flex h-full flex-row justify-between overflow-hidden pb-0 pr-0 text-[13px]">
      <AppCustomizationPanel />
      <CustomizedChat />
    </div>
  );
};

export default Customization;
