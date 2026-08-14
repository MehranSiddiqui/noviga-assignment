import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

interface CustomDatepickerProps {
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

/**
 * CustomDatepicker Component with MUI DatePicker
 * 
 * Uses @mui/x-date-pickers DatePicker with calendar UI
 * Requires LocalizationProvider to be set up in App.tsx
 */
const CustomDatepicker = ({
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
}: CustomDatepickerProps) => {
  // Convert string value to Dayjs object, handle empty/invalid values
  const dayjsValue = value ? dayjs(value, 'YYYY-MM-DD', true) : null;
  const minDayjs = minDate ? dayjs(minDate, 'YYYY-MM-DD', true) : undefined;
  const maxDayjs = maxDate ? dayjs(maxDate, 'YYYY-MM-DD', true) : undefined;

  const handleChange = (newValue: Dayjs | null) => {
    if (newValue && newValue.isValid()) {
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
          variant: 'outlined',
        },
      }}
    />
  );
};

export default CustomDatepicker;
