"use client";

import { IoInformationCircleOutline } from "react-icons/io5";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { MonitoringDataType } from "@/app/services/monitoring/monitoring-service";

export const description = "A simple area chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

interface CurveChartProps {
  title: string;
  data: {
    x_axis: string;
    y_axis: string;
  }[];
  color: string;
  monitoringData: number;
}

export function CurveChart({
  title,
  data,
  color,
  monitoringData,
}: CurveChartProps) {
  // Convert string values to numbers and calculate max
  const numericData = data.map((item) => ({
    ...item,
    y_axis: parseFloat(item.y_axis),
  }));
  console.log("numericData", numericData, data);
  const maxValue = Math.max(...numericData.map((item) => item.y_axis));
  // const padding = maxValue * 0.1; // 10% padding

  const formatMonitoringData = (value: number, title: string) => {
    console.log("value", value);
    let formattedValue = value.toLocaleString();
    if (value >= 1000) {
      formattedValue = (value / 1000).toFixed(3) + " k";
    }
    if (title === "Token Output Speed (tokens/sec)") {
      formattedValue += " /s";
    }
    return formattedValue;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-1">
          {title}
          <IoInformationCircleOutline className="mt-1 text-gray-600" />{" "}
        </CardTitle>
        <CardDescription>last 7 days</CardDescription>
        <div className="mt-1 text-2xl font-semibold text-gray-600">
          {formatMonitoringData(monitoringData, title) || "0"}
        </div>
      </CardHeader>
      <div className="p-6 pl-0 pt-0">
        <ChartContainer config={chartConfig} className="h-[250px] w-[100%]">
          <AreaChart
            accessibilityLayer
            data={numericData}
            height={300}
            margin={{
              left: 0,
              right: 20,
              top: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="x_axis"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              dataKey="y_axis"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, maxValue]}
              allowDataOverflow={false}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Area
              dataKey="y_axis"
              type="monotone"
              fill={color}
              fillOpacity={0.1}
              stroke={color}
              strokeWidth={1.5}
            />
          </AreaChart>
        </ChartContainer>
      </div>
      {/* <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  );
}
