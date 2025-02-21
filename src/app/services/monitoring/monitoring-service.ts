import useSWR from "swr";

type MonitoringChartValuesType = {
  title: string;
  values: {
    x_axis: string;
    y_axis: string;
  }[];
  totalValue: number;
};

export type MonitoringDataType = {
  chartData: {
    conversations: MonitoringChartValuesType;
    messages: MonitoringChartValuesType;
    totalTokens: MonitoringChartValuesType;
    completionTokens: MonitoringChartValuesType;
    promptTokens: MonitoringChartValuesType;
    tokenSpeed: MonitoringChartValuesType;
  };
};

const useGetAppMonitering = (appId: string) => {
  const { data, error, isValidating } = useSWR<{ data: MonitoringDataType }>(
    `/api/monitoring/get-app-monitoring?appId=${appId}`,
  );

  console.log("data in monitoring service", data?.data);
  return {
    appMonitoringData: data?.data || [],
    error,
    isLoading: isValidating && !data,
  };
};

export default useGetAppMonitering;
