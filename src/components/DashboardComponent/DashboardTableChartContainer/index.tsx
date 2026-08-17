import type { ActiveFilterState } from "../../../types/types"
import Wrapper from "../../Wrapper"
import { useTableChartController } from "./dashboardTableChart.controller"
import HourlySummaryTable from "./HourlySummaryTable"

const TimelineTableContainer = ({ activeFilters }: {
    activeFilters: ActiveFilterState | null
}) => {
    const { ROWS, tableData } = useTableChartController(activeFilters as ActiveFilterState)
    return (
        <Wrapper><HourlySummaryTable rows={ROWS} tableData={tableData} /></Wrapper>
    )
}

export default TimelineTableContainer