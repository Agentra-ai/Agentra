import React from "react";
import { IoClose } from "react-icons/io5";

import { MonitoringDataType } from "@/app/services/monitoring/monitoring-service";

import { CurveChart } from "../charts/curve-chart";

const chartColors = [
  "hsl(var(--chart-2))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-4))",
];

interface MonitoringChartProps {
  monitoringData: MonitoringDataType;
}

const MonitoringChart: React.FC<MonitoringChartProps> = ({
  monitoringData,
}) => {
  const chartDataArray = [];
  if (monitoringData.chartData) {
    const {
      conversations,
      messages,
      totalTokens,
      completionTokens,
      promptTokens,
      tokenSpeed,
    } = monitoringData.chartData;
    chartDataArray.push(
      conversations,
      messages,
      totalTokens,
      tokenSpeed,
      completionTokens,
      promptTokens,
    );
  }
  console.log("chartDataArray", chartDataArray);
  return (
    <div className="mb-4 mt-8">
      {/* Analysis Header */}
      <div className="mb-2 flex items-center p-2 text-base text-gray-900">
        <span className="mr-3 text-lg font-medium">Analysis</span>
        <div className="relative h-9">
          <button
            className="h-full w-40 cursor-pointer rounded-[8px] border-0 bg-gray-100 py-1.5 pl-3 pr-10 focus-visible:bg-gray-200 focus-visible:outline-none sm:text-sm sm:leading-6"
            type="button"
          >
            <span className="block truncate text-left">Last 7 Days</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
              <IoClose />
            </span>
          </button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mb-6 grid w-full grid-cols-1 gap-6 xl:grid-cols-2">
        {chartDataArray.map((chart, index) => (
          <CurveChart
            key={index}
            title={chart.title}
            data={chart.values}
            color={chartColors[index] || "yellow"}
            monitoringData={chart.totalValue}
          />
        ))}
      </div>
    </div>
  );
};

export default MonitoringChart;
