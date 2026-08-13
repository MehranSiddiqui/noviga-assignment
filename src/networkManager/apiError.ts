import axios from "axios";

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as { message?: string } | undefined;

    if (payload?.message) {
      return String(payload.message);
    }

    return error.message || "An unexpected API error occurred.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
};
