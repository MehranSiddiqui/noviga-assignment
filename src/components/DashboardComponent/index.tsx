import { Box } from "@mui/material"
import Wrapper from "../Wrapper"
import { useDashboardController } from "./dashboard.controller"
import FilterBar from "./FilterBar"
import TimelineTableContainer from "./DashboardTableChartContainer"

const DashBoardComponent = () => {
    const { activeFilters,
        handleFilterChange, } = useDashboardController()
    return (
        <Box>
            <Wrapper>
                <FilterBar handleFilterChange={handleFilterChange} />
            </Wrapper>
            <TimelineTableContainer activeFilters={activeFilters} />
        </Box>
    )
}

export default DashBoardComponent