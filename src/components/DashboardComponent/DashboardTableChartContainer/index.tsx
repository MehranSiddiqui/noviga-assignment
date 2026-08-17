import type { ActiveFilterState } from "../../../types/types";
import ProductionHistoryChart from "../../TimelineChart";
import Wrapper from "../../Wrapper";
import { useTableChartController } from "./dashboardTableChart.controller";
import HourlySummaryTable from "./HourlySummaryTable";

const TimelineTableContainer = ({
  activeFilters,
}: {
  activeFilters: ActiveFilterState | null;
}) => {
  const { ROWS, tableData, timelineData, timelineFetching } =
    useTableChartController(activeFilters as ActiveFilterState);
  return (
    <>
      <Wrapper>
        <ProductionHistoryChart
          timelineData={timelineData}
          shiftEndTime={activeFilters?.shiftEndTime as string}
          shiftStartTime={activeFilters?.shiftStartTime as string}
          isLoading={timelineFetching}
        />
      </Wrapper>
      <Wrapper>
        <HourlySummaryTable rows={ROWS} tableData={tableData} />
      </Wrapper>
    </>
  );
};

export default TimelineTableContainer;
