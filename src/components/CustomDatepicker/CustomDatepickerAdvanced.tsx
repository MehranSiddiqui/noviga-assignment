/**
 * CustomDatepickerAdvanced Component (Optional)
 * 
 * This is an advanced implementation using @mui/x-date-pickers.
 * 
 * To use this component, you need to install:
 * npm install @mui/x-date-pickers dayjs
 * 
 * Then update your root App.tsx to include LocalizationProvider:
 * 
 * import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
 * import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
 * 
 * <LocalizationProvider dateAdapter={AdapterDayjs}>
 *   <App />
 * </LocalizationProvider>
 * 
 * Then uncomment and use the code below.
 */

/*
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

interface CustomDatepickerAdvancedProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  minDate?: string;
  maxDate?: string;
  id?: string;
}

const CustomDatepickerAdvanced = ({
  label,
  value,
  onChange,
  error = false,
  helperText,
  disabled = false,
  fullWidth = true,
  size = 'small',
  minDate,
  maxDate,
  id,
}: CustomDatepickerAdvancedProps) => {
  const dayjsValue = value ? dayjs(value) : null;
  const minDayjs = minDate ? dayjs(minDate) : undefined;
  const maxDayjs = maxDate ? dayjs(maxDate) : undefined;

  const handleChange = (newValue: Dayjs | null) => {
    if (newValue) {
      onChange(newValue.format('YYYY-MM-DD'));
    } else {
      onChange('');
    }
  };

  return (
    <DatePicker
      label={label}
      value={dayjsValue}
      onChange={handleChange}
      disabled={disabled}
      minDate={minDayjs}
      maxDate={maxDayjs}
      slotProps={{
        textField: {
          id,
          fullWidth,
          size,
          error,
          helperText,
        },
      }}
    />
  );
};

export default CustomDatepickerAdvanced;
*/

// Placeholder for now - use the basic CustomDatepicker instead
export const AdvancedDatepickerNote = () => (
  <div>
    To use the advanced datepicker with calendar UI, uncomment the code in this file
    and install: npm install @mui/x-date-pickers dayjs
  </div>
);
