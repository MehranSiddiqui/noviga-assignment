import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authAPI } from "../../networkManager";
import { getApiErrorMessage } from "../../networkManager/apiError";

export const useLoginController = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      username: userName,
      password: password,
    };

    try {
      const response = await authAPI.login(payload);
      if (response?.status_code === 200) {
        console.log({ response });
        await login(response.data.access_token);
        navigate("/dashboard");
        return;
      }
      setErrorMessage("Login failed. Please try again.");
    } catch (err) {
      setErrorMessage(getApiErrorMessage(err));
    }
    // await login("demo-token");
    // navigate("/dashboard");
  };

  return {
    userName,
    password,
    setUserName,
    setPassword,
    errorMessage,
    handleSubmit,
  };
};
