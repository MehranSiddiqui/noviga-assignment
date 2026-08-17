import { Box, Button, Stack, Switch, FormControlLabel } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import type { DropdownOption } from '../../CustomDropdown';
import CustomDropdown from '../../CustomDropdown';
import CustomDatepicker from '../../CustomDatepicker';
import { useFilterBarController } from "./filterbar.controller"
import type { MappedAsset, MappedShift } from '../../../types/Interfaces';
import AppLoader from '../../../components/Apploader/AppLoader';

import type { FilterState } from '../../../types/types';

interface FilterBarProps {
    handleFilterChange?: (filterState: FilterState) => void
}

const FilterBar = ({ handleFilterChange }: FilterBarProps) => {
    const {
        filterState,
        flatAssets,
        filteredAssets, // Make sure your UI uses this array for the Asset dropdown!
        uniqueLevels, // Use this for your new Asset Level dropdown
        dropdownShifts,
        assetsLoading,
        shiftsLoading,
        exactProduces,
        handleFilterChange: handleFilterChangeFromController,
        resetFilters,
        handleExactProducesChange
    } = useFilterBarController(handleFilterChange)

    // Show loader when assets or shifts are loading
    const isLoading = assetsLoading || shiftsLoading;

    // Transform API data to dropdown options
    const assetOptions: DropdownOption[] = Array.isArray(flatAssets)
        ? flatAssets.map((asset: MappedAsset) => ({
            id: asset?.id,
            name: asset?.name,
        }))
        : [];

    const shiftOptions: DropdownOption[] = Array.isArray(dropdownShifts)
        ? dropdownShifts.map((shift: MappedShift) => ({
            id: shift?.shiftId,
            name: shift?.shiftName,
        }))
        : [];
    console.log(assetOptions, shiftOptions)
    return (
        <Box
            sx={{
                p: 2,
                backgroundColor: '#ffffff',
                borderRadius: 1,
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                mb: 3,
            }}
        >
            {isLoading && <AppLoader loading={isLoading} sx={{ mb: 2 }} />}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'stretch', sm: 'center' }}
            >
                {/* Asset Dropdown */}
                <Box sx={{ flex: 1, minWidth: 200 }}>
                    <CustomDropdown
                        id="asset-dropdown"
                        label="Asset"
                        value={filterState.assetLevel ?? ''}
                        onChange={(value) =>
                            handleFilterChangeFromController('assetLevel', value)
                        }
                        options={uniqueLevels}
                        isLoading={assetsLoading}
                    />
                </Box>
                <Box sx={{ flex: 1, minWidth: 200 }}>
                    <CustomDropdown
                        id="asset-dropdown"
                        label="Asset"
                        value={filterState.assetId ?? ''}
                        onChange={(value) =>
                            handleFilterChangeFromController('assetId', value)
                        }
                        options={filteredAssets}
                        isLoading={assetsLoading}
                    />
                </Box>

                {/* Shift Dropdown */}
                <Box sx={{ flex: 1, minWidth: 200 }}>
                    <CustomDropdown
                        id="shift-dropdown"
                        label="Shift"
                        value={filterState.shiftId ?? ''}
                        onChange={(value) =>
                            handleFilterChangeFromController('shiftId', value)
                        }
                        options={shiftOptions}
                        isLoading={shiftsLoading}
                    />
                </Box>

                {/* Date Picker */}
                <Box sx={{ flex: 1, minWidth: 200 }}>
                    <CustomDatepicker
                        id="date-picker"
                        label="Date"
                        value={filterState.date ?? ''}
                        onChange={(value) =>
                            handleFilterChangeFromController('date', value)
                        }
                    />
                </Box>

                {/* Exact Produces Toggle */}
                <FormControlLabel
                    control={
                        <Switch
                            checked={exactProduces}
                            onChange={(e) => handleExactProducesChange(e.target.checked)}
                        />
                    }
                    label="Exact"
                />

                {/* Reset Button */}
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ClearIcon />}
                    onClick={resetFilters}
                    sx={{
                        textTransform: 'none',
                        minWidth: 100,
                    }}
                >
                    Reset
                </Button>
            </Stack>
        </Box>
    )
}

export default FilterBar