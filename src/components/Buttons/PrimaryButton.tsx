import { Button, type ButtonProps } from "@mui/material";

export const PrimaryButton = ({ sx, ...props }: ButtonProps) => (
  <Button
    variant="contained"
    disableElevation
    sx={{
      borderRadius: 2,
      px: 3,
      py: 1.2,
      textTransform: "none",
      fontWeight: 700,
      background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
      boxShadow: "none",
      "&:hover": {
        background: "linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)",
        boxShadow: "none",
      },
      ...sx,
    }}
    {...props}
  />
);
