import type { ActiveFilterState } from "../../../types/types";
import ProductionHistoryChart from "../../TimelineChart";
import Wrapper from "../../Wrapper";
import { useTableChartController } from "./dashboardTableChart.controller";
import HourlySummaryTable from "./HourlySummaryTable";
import { Box, Typography } from "@mui/material";

const TimelineTableContainer = ({
  activeFilters,
}: {
  activeFilters: ActiveFilterState | null;
}) => {
  const {
    ROWS,
    tableData,
    timelineData,
    timelineFetching,
    cycleData,
    cycleFetching,
    timeRange,
    handlePoints,
    exactPoint,
    pointLabels,
  } = useTableChartController(activeFilters as ActiveFilterState);

  return (
    <>
      <Wrapper>
        <ProductionHistoryChart
          timelineData={timelineData}
          shiftEndTime={timeRange?.to_ts as string}
          shiftStartTime={timeRange?.from_ts as string}
          isLoading={timelineFetching}
          exactProduces={exactPoint}
          showPointLabels={pointLabels}
          togglePointLabels={handlePoints}
        />
      </Wrapper>
      <Wrapper>
        <Box sx={{ p: 2 }}>
          {cycleData || tableData.length > 0 ? (
            <HourlySummaryTable rows={ROWS} tableData={tableData} />
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              {!cycleFetching && (
                <Typography variant="body2">No data available</Typography>
              )}
              {cycleFetching && <div>Loading cycle time data...</div>}
            </Box>
          )}
        </Box>
      </Wrapper>
    </>
  );
};

export default TimelineTableContainer;
