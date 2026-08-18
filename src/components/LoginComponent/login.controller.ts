import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../networkManager/apiError";
import { useLoginMutation } from "../../hooks/Queries/useAuthQueries";

export const useLoginController = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { mutateAsync: loginApiCall, isPending } = useLoginMutation();
  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      username: userName,
      password: password,
    };

    try {
      try {
        const response = await loginApiCall(payload);

        if (response.status_code === 200) {
          await login(response.data.access_token);
          navigate("/dashboard");
          return;
        }

        setErrorMessage("Login failed. Please try again.");
      } catch (err) {
        setErrorMessage(getApiErrorMessage(err));
      }
    } catch (err) {
      setErrorMessage(getApiErrorMessage(err));
    }
  };

  return {
    userName,
    password,
    setUserName,
    setPassword,
    errorMessage,
    handleSubmit,
    isPending,
  };
};
