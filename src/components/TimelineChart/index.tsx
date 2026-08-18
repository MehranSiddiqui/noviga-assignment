import { useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Chip,
  Stack,
  useTheme,
} from "@mui/material";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";
import type {
  IndividualSeriesData,
  Interval,
  ProductionHistoryChartProps,
  SymbolCallbackParams,
  TooltipParam,
} from "../../types/Interfaces";

const STATE_COLORS: Record<string, string> = {
  runtime: "#26a69a",
  "planned downtime": "#7cb342",
  "unplanned downtime": "#ff7043",
  "unplanned production": "#cddc39",
  stoppage: "#5c6bc0",
  unknown: "#ff7043",
};

const getBandColor = (interval: Interval) => {
  const cat =
    interval.category?.toLowerCase() || interval.type?.toLowerCase() || "";

  if (cat.includes("runtime")) return STATE_COLORS.runtime;

  if (cat.includes("stoppage")) return STATE_COLORS.stoppage;

  if (interval.planned) return STATE_COLORS["planned downtime"];

  if (cat.includes("unknown") || cat.includes("downtime")) {
    return STATE_COLORS["unplanned downtime"];
  }

  return "#e0e0e0";
};

export default function ProductionHistoryChart({
  timelineData,
  shiftStartTime,
  shiftEndTime,
  isLoading,
  exactProduces,
  showPointLabels,
  togglePointLabels,
}: ProductionHistoryChartProps) {
  const theme = useTheme();

  const chartOptions = useMemo(() => {
    if (!timelineData) return {};

    const allIntervals = [
      ...(timelineData.runtimes?.map((i) => ({
        ...i,
        category: "RUNTIME",
      })) || []),
      ...(timelineData.downtimes || []),
      ...(timelineData.stoppages?.map((i) => ({
        ...i,
        category: "MINOR STOPPAGE",
      })) || []),
    ];

    const markAreaBlocks = allIntervals.map((interval) => {
      const labelText = interval.category || interval.type || "UNKNOWN";

      return [
        {
          xAxis: new Date(interval.start_at).getTime(),
          itemStyle: {
            color: getBandColor(interval),
            opacity: 0.9,
          },
          label: {
            show: true,
            position: "inside",
            rotate: 90,
            color: "#fff",
            fontWeight: "bold",
            formatter: labelText.toUpperCase(),
            padding: [10, 0, 0, 0],
          },
        },
        {
          xAxis: new Date(interval.end_at).getTime(),
        },
      ];
    });

    let currentCumulative = 0;

    const cumulativeSeriesData: [number, number][] = [];

    const individualSeriesData: IndividualSeriesData[] = [];

    if (timelineData.produce_counts) {
      const sortedBuckets = [...timelineData.produce_counts].sort(
        (a, b) =>
          new Date(a.bucket_start).getTime() -
          new Date(b.bucket_start).getTime(),
      );

      if (
        sortedBuckets.length > 0 &&
        new Date(sortedBuckets[0].bucket_start).getTime() >
          new Date(shiftStartTime).getTime()
      ) {
        cumulativeSeriesData.push([new Date(shiftStartTime).getTime(), 0]);
      }

      sortedBuckets.forEach((p) => {
        currentCumulative += (p.ok_count || 0) + (p.ng_count || 0);

        cumulativeSeriesData.push([
          new Date(p.bucket_start).getTime(),
          currentCumulative,
        ]);
      });
    }

    if (timelineData.produces) {
      const sortedProduces = [...timelineData.produces].sort(
        (a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime(),
      );

      let individualCumulative = 0;

      sortedProduces.forEach((p) => {
        individualCumulative += 1;

        individualSeriesData.push({
          value: [new Date(p.ts).getTime(), individualCumulative],
          status: p.status,
        });
      });
    }

    const series = [];

    if (showPointLabels) {
      series.push({
        name: "Cumulative Production",
        type: "line",
        data: cumulativeSeriesData,
        lineStyle: {
          color: "#2962ff",
          width: 2,
        },
        itemStyle: {
          color: "#2962ff",
        },
        symbol: "circle",
        symbolSize: 8,
        label: {
          show: exactProduces,
          position: "top",
          formatter: "{@1}",
          color: "#2962ff",
          fontWeight: "bold",
          backgroundColor: "#fff",
          padding: [2, 6],
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#2962ff",
          distance: 10,
        },
        markArea: {
          silent: true,
          data: markAreaBlocks,
        },
      });
    } else {
      series.push({
        name: "Production Bands",
        type: "line",
        data: [],
        lineStyle: {
          opacity: 0,
        },
        itemStyle: {
          opacity: 0,
        },
        symbol: "none",
        markArea: {
          silent: true,
          data: markAreaBlocks,
        },
      });
    }

    if (exactProduces) {
      series.push({
        name: "Individual Produces",
        type: "scatter",
        data: individualSeriesData,
        itemStyle: {
          color: "#2962ff",
        },
        symbol: (_value: number | number[], params: SymbolCallbackParams) => {
          if (params.data?.status === "FAIL") {
            return "path://M0,0 L10,10 M10,0 L0,10";
          }

          if (params.data?.status === "WIP") {
            return "triangle";
          }

          return "circle";
        },
        symbolSize: 8,
        label: {
          show: exactProduces,
          position: "top",
          formatter: (params: { data?: IndividualSeriesData }) => {
            return params.data?.status || "";
          },
          color: "#2962ff",
          fontWeight: "bold",
          backgroundColor: "#fff",
          padding: [2, 6],
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#2962ff",
          distance: 10,
        },
      });
    }
    return {
      grid: {
        top: 60,
        bottom: 30,
        left: 50,
        right: 20,
      },

      tooltip: {
        trigger: "axis",
        formatter: (params: TooltipParam[]) => {
          const point = params[0];

          if (!point?.value) return "";

          return `Time: ${dayjs(point.value[0]).format(
            "HH:mm:ss",
          )}<br/>Cumulative: ${point.value[1]}`;
        },
      },

      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: "none",
            title: {
              zoom: "Zoom",
              back: "Reset",
            },
          },
        },
        showTitle: false,
      },

      dataZoom: [
        {
          type: "inside",
          xAxisIndex: 0,
        },
      ],

      xAxis: {
        type: "time",
        min: new Date(shiftStartTime).getTime(),
        max: new Date(shiftEndTime).getTime(),
        axisLabel: {
          formatter: "{HH}:{mm}",
          color: theme.palette.text.secondary,
        },
        splitLine: {
          show: false,
        },
      },

      yAxis: {
        type: "value",
        name: "Cumulative production",
        nameLocation: "end",
        nameTextStyle: {
          color: theme.palette.text.secondary,
          align: "left",
          padding: [0, 0, 10, -40],
        },
        splitLine: {
          show: false,
        },
      },

      series,
    };
  }, [
    timelineData,
    shiftStartTime,
    shiftEndTime,
    exactProduces,
    showPointLabels,
    theme,
  ]);

  if (isLoading) {
    return (
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          p: 2,
          height: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="textSecondary">Loading chart data...</Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            Production History
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ mt: 0.5 }}
          >
            <Typography variant="body2" color="textSecondary">
              Part Models:
            </Typography>

            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <span
                style={{
                  color: "#2962ff",
                  fontSize: "1.2em",
                }}
              >
                ●
              </span>
              D22
            </Typography>

            {exactProduces && (
              <>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    ml: 1,
                  }}
                >
                  <span
                    style={{
                      color: "#4caf50",
                      fontSize: "1.2em",
                    }}
                  >
                    ●
                  </span>
                  OK
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <span
                    style={{
                      color: "#f44336",
                      fontSize: "1.2em",
                    }}
                  >
                    ×
                  </span>
                  FAIL
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <span
                    style={{
                      color: "#9e9e9e",
                      fontSize: "1.2em",
                    }}
                  >
                    ▲
                  </span>
                  WIP
                </Typography>
              </>
            )}
          </Stack>

          <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={showPointLabels}
                  onChange={(e) => {
                    if (togglePointLabels) {
                      togglePointLabels("labels");
                      if (!e?.target?.checked) {
                        togglePointLabels("points");
                      }
                    }
                  }}
                />
              }
              label={<Typography variant="body2">Point labels</Typography>}
            />

            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={exactProduces}
                  onChange={() =>
                    togglePointLabels && togglePointLabels("points")
                  }
                  disabled={!showPointLabels}
                />
              }
              label={
                <Typography variant="body2">
                  Show Individual produces
                </Typography>
              }
            />
          </Stack>
        </Box>

        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
          justifyContent="flex-end"
          sx={{ maxWidth: "50%" }}
        >
          {Object.entries(STATE_COLORS).map(([label, color]) => (
            <Box
              key={label}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mb: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: color,
                  borderRadius: 0.5,
                }}
              />

              <Typography
                variant="caption"
                sx={{
                  textTransform: "capitalize",
                  fontWeight: 500,
                }}
              >
                {label}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      <Box
        sx={{
          width: "100%",
          height: 350,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          backgroundColor: "#f9f9f9",
        }}
      >
        <ReactECharts
          option={chartOptions}
          style={{
            height: "100%",
            width: "100%",
          }}
          notMerge={true}
          lazyUpdate={true}
        />
      </Box>

      <Stack
        direction="row"
        spacing={2}
        sx={{ mt: 2 }}
        flexWrap="wrap"
        useFlexGap
      >
        <Chip
          size="small"
          variant="outlined"
          label="Shift + drag to zoom into a time range · double-click to reset"
        />

        <Chip
          size="small"
          variant="outlined"
          label="Colored lines = cumulative production (OK + NG) per part model"
        />

        {exactProduces && (
          <Chip
            size="small"
            variant="outlined"
            label="Circles = FIRST (PASS) · Crosses = FIRST (FAIL) · Triangles = WIP"
          />
        )}
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
        <Chip
          variant="outlined"
          label="Last observed produce at: 15 Jul, 16:37:55"
          sx={{
            borderColor: "#2962ff",
            color: "#2962ff",
            fontWeight: "bold",
          }}
        />

        <Chip
          variant="outlined"
          label="⚠️ 10 unknown segments - 55.0 min — click a segment to classify"
          sx={{
            borderColor: "#ff9800",
            color: "#ff9800",
            fontWeight: "bold",
            backgroundColor: "#fff3e0",
          }}
        />
      </Stack>
    </Paper>
  );
}
