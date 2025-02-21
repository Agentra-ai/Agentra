import React from "react";

const LoadingIcon = () => {
  return (
    <div className="flex items-center justify-center">
      <div
        className="relative h-6 w-6 animate-spin"
        style={{ animationDuration: "0.9s" }}
      >
        <div className="absolute left-1/2 top-0 h-[8px] w-[8px] -translate-x-1/2 transform rounded-full bg-blue-500"></div>
        <div className="absolute right-0 top-1/2 h-[8px] w-[8px] -translate-y-1/2 transform rounded-full bg-blue-400"></div>
        <div className="absolute bottom-0 left-1/2 h-[8px] w-[8px] -translate-x-1/2 transform rounded-full bg-blue-300"></div>
        <div className="absolute left-0 top-1/2 h-[8px] w-[8px] -translate-y-1/2 transform rounded-full bg-blue-200"></div>
      </div>
    </div>
  );
};

export default LoadingIcon;
