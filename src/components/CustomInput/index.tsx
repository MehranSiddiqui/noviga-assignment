import { TextField, type TextFieldProps } from "@mui/material";

export const CustomInput = ({ sx, ...props }: TextFieldProps) => (
  <TextField
    fullWidth
    variant="outlined"
    size="medium"
    sx={{
      ...sx,
      "& .MuiOutlinedInput-root": {
        borderRadius: 2,
        backgroundColor: "#fff",
        transition: "all 0.2s ease",
        "& fieldset": {
          borderColor: "#d0d7de",
        },
        "&:hover fieldset": {
          borderColor: "#7c3aed",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#4f46e5",
          borderWidth: 2,
        },
      },
      "& .MuiInputLabel-root.Mui-focused": {
        color: "#4f46e5",
      },
    }}
    {...props}
  />
);
