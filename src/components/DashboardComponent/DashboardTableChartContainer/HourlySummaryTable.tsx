import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography } from '@mui/material';
import type { ProcessedHour, Rows } from '../../../types/Interfaces';
import { formatValue } from '../../../utils/tableProcessor';

const HourlySummaryTable = ({ rows, tableData }: { rows: Rows[], tableData: ProcessedHour[] }) => {

    return (
        <TableContainer component={Paper} elevation={1} sx={{ mt: 2, overflowX: 'auto' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="h6">Hourly Production & Downtime Summary</Typography>
            </Box>
            <Table size="small" aria-label="hourly summary table" sx={{ minWidth: 1000 }}>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', minWidth: 200 }}>Param</TableCell>
                        {tableData.map((col) => (
                            <TableCell key={col.bucket.index} align="center" sx={{ fontWeight: 'bold', minWidth: 100 }}>
                                {col.bucket.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((rowConfig) => (
                        <TableRow key={rowConfig.key} hover>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                {rowConfig.label}
                            </TableCell>
                            {tableData.map((col) => {
                                const value = col[rowConfig.key as keyof ProcessedHour] as number | null;
                                return (
                                    <TableCell key={`${rowConfig.key}-${col.bucket.index}`} align="center">
                                        {formatValue(value, rowConfig.isFloat, rowConfig.suffix, col.bucket.isElapsed)}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default HourlySummaryTable