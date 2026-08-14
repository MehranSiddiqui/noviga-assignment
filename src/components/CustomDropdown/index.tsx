import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

export interface DropdownOption {
  id: string | number;
  name: string;
  [key: string]: string | number | boolean;
}

interface CustomDropdownProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: DropdownOption[];
  isLoading?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  id?: string;
}

const CustomDropdown = ({
  label,
  value,
  onChange,
  options,
  isLoading = false,
  error = false,
  helperText,
  disabled = false,
  fullWidth = true,
  size = 'small',
  id,
}: CustomDropdownProps) => {
  const handleChange = (event: SelectChangeEvent<string | number>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl
      fullWidth={fullWidth}
      size={size}
      error={error}
      disabled={isLoading || disabled}
    >
      <InputLabel id={id}>{label}</InputLabel>
      <Select
        labelId={id}
        id={id}
        value={value}
        onChange={handleChange}
        label={label}
        disabled={isLoading}
      >
        <MenuItem value="">
          <em>Select an option</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CustomDropdown;
