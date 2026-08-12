import { Button, type ButtonProps } from "@mui/material";

export const SecondaryButton = ({ sx, ...props }: ButtonProps) => (
  <Button
    variant="outlined"
    sx={{
      borderRadius: 2,
      px: 3,
      py: 1.2,
      textTransform: "none",
      fontWeight: 700,
      borderColor: "#cbd5e1",
      color: "#0f172a",
      "&:hover": {
        borderColor: "#94a3b8",
        backgroundColor: "#f8fafc",
      },
      ...sx,
    }}
    {...props}
  />
);
