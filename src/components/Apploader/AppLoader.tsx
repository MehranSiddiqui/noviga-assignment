import { LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";

interface AppLoaderProps {
  /** Whether to show the loader */
  loading: boolean;
  /** Optional height of the linear progress bar */
  height?: number | string;
  /** Optional color of the progress bar */
  color?: "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
  /** Optional sx prop for styling */
  sx?: object;
}

const AppLoader = ({
  loading,
  height = 3,
  color = "primary",
  sx
}: AppLoaderProps) => {
  // We use useState to prevent flashing the loader for very fast requests
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (loading) {
      // Show loader after 100ms to prevent flashing for quick requests
      const timer = setTimeout(() => setShowLoader(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowLoader(false);
    }
  }, [loading]);

  if (!showLoader) return null;

  return (
    <LinearProgress
      variant="determinate"
      sx={{
        height: height,
        color: color,
        ...sx,
      }}
    />
  );
};

export default AppLoader;