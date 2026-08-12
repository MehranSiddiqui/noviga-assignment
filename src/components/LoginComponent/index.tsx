import { useState, type SubmitEvent } from "react";
import {
    Box,
    Card,
    CardContent,
    Stack,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { CustomInput } from "../CustomInput";
import { PrimaryButton } from "../Buttons";
import { authAPI } from "../../networkManager";
import { getApiErrorMessage } from "../../networkManager/apiError";

const Login = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const payload = {
            username: userName,
            password: password
        }

        try {
            const response = await authAPI.login(payload);
            if (response?.status_code === 200) {
                await login(response.data.token);
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

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)",
                p: 3,
            }}
        >
            <Card sx={{ width: "100%", maxWidth: 440, borderRadius: 4, boxShadow: 6 }}>
                <CardContent sx={{ p: 4 }}>
                    <Stack spacing={3}>
                        <Box>
                            <Typography
                                variant="h4"
                                color="primary.main"
                                align="center"
                                sx={{ fontWeight: 700 }}
                            >
                                Welcome back
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center">
                                Sign in to continue to your dashboard
                            </Typography>
                        </Box>

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <Stack spacing={2.5}>
                                <CustomInput
                                    label="Username"
                                    type="text"
                                    value={userName}
                                    onChange={(event) => setUserName(event.target.value)}
                                />

                                <CustomInput
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />

                                {errorMessage ? (
                                    <Typography variant="body2" color="error">
                                        {errorMessage}
                                    </Typography>
                                ) : null}

                                <PrimaryButton type="submit" fullWidth>
                                    Sign In
                                </PrimaryButton>

                            </Stack>
                        </Box>


                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;