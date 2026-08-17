import { useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  useTheme,
  Switch,
  FormControlLabel,
} from "@mui/material";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";

// Helper to map your API state types to the exact colors in your image
const getStateColor = (type: string, isPlanned: boolean) => {
  if (type === "runtime" || type === "production") return "#26a69a";
  if (type === "planned" || isPlanned) return "#7cb342";
  if (type === "unknown") return "#ff7043";
  if (type === "stoppage") return "#5c6bc0";
  return "#e0e0e0";
};

interface ProductionHistoryChartProps {
  timelineData: any;
  shiftStartTime: string;
  shiftEndTime: string;
  isLoading?: boolean;
}

export default function ProductionHistoryChart({
  timelineData,
  shiftStartTime,
  shiftEndTime,
  isLoading,
}: ProductionHistoryChartProps) {
  const theme = useTheme();
  console.log({ timelineData });
  const chartOptions = useMemo(() => {
    if (!timelineData) return {};
    const productionPoints = (timelineData.produce_counts || [])
      .sort(
        (a: any, b: any) =>
          new Date(a.bucket_start).getTime() -
          new Date(b.bucket_start).getTime(),
      )
      .reduce((accumulator: number[][], p: any) => {
        const total = (p.ok_count || 0) + (p.ng_count || 0);

        const previousCumulative =
          accumulator.length > 0 ? accumulator[accumulator.length - 1][1] : 0;

        accumulator.push([
          new Date(p.bucket_start).getTime(), // X: exact timestamp
          previousCumulative + total, // Y: cumulative total
        ]);

        return accumulator;
      }, []);

    if (
      productionPoints.length > 0 &&
      productionPoints[0][0] > new Date(shiftStartTime).getTime()
    ) {
      productionPoints.unshift([new Date(shiftStartTime).getTime(), 0]);
    }

    const markAreaBlocks: any[] = [];

    const allIntervals = [
      ...(timelineData.runtimes || []).map((i: any) => ({
        ...i,
        category: "runtime",
      })),
      ...(timelineData.downtimes || []).map((i: any) => ({
        ...i,
        category: i.type,
      })),
      ...(timelineData.stoppages || []).map((i: any) => ({
        ...i,
        category: "stoppage",
      })),
    ];

    allIntervals.forEach((interval) => {
      const color = getStateColor(
        interval.category,
        interval.type === "planned",
      );
      const labelText = interval.category.toUpperCase();

      markAreaBlocks.push([
        {
          xAxis: new Date(interval.start_at).getTime(),
          itemStyle: { color: color, opacity: 0.8 },
          label: {
            show: true,
            position: "insideTop",
            rotate: 90,
            color: "#fff",
            fontWeight: "bold",
            formatter: labelText,
            padding: [10, 0, 0, 0],
          },
        },
        {
          xAxis: new Date(interval.end_at).getTime(),
        },
      ]);
    });

    return {
      grid: { top: 40, bottom: 40, left: 50, right: 20 },
      tooltip: {
        trigger: "axis",
        formatter: (params: any) => {
          const point = params[0];
          return `Time: ${dayjs(point.value[0]).format("HH:mm")}<br/>Cumulative: ${point.value[1]}`;
        },
      },
      dataZoom: [{ type: "inside", xAxisIndex: 0 }],
      xAxis: {
        type: "time",
        min: new Date(shiftStartTime).getTime(),
        max: new Date(shiftEndTime).getTime(),
        axisLabel: {
          formatter: "{HH}:{mm}",
          color: theme.palette.text.secondary,
        },
        splitLine: { show: false },
      },
      yAxis: {
        type: "value",
        name: "Cumulative production",
        nameLocation: "end",
        nameTextStyle: {
          color: theme.palette.text.secondary,
          padding: [0, 0, 10, 0],
        },
        min: 0,
        splitLine: { lineStyle: { color: theme.palette.divider } },
      },
      series: [
        {
          name: "Cumulative Production",
          type: "line",
          data: productionPoints,
          lineStyle: { color: "#2196f3", width: 2 },
          itemStyle: { color: "#2196f3" },
          symbol: "circle",
          symbolSize: 8,
          label: {
            show: true,
            position: "right",
            formatter: "{@1}",
            color: "#2196f3",
            fontWeight: "bold",
            backgroundColor: "#fff",
            padding: 2,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#2196f3",
          },
          markArea: {
            silent: true,
            data: markAreaBlocks,
          },
        },
      ],
    };
  }, [timelineData, shiftStartTime, shiftEndTime, theme]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <Paper elevation={1} sx={{ p: 2, mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Production History</Typography>

        <Box>
          <FormControlLabel
            control={<Switch defaultChecked size="small" />}
            label="Point labels"
          />
        </Box>
      </Box>

      <Box sx={{ width: "100%", height: 400 }}>
        <ReactECharts
          option={chartOptions}
          style={{ height: "100%", width: "100%" }}
          notMerge={true}
        />
      </Box>
    </Paper>
  );
}
