import {
    Box,
    Card,
    CardContent,
    Stack,
    Typography,
} from "@mui/material";

import { CustomInput } from "../CustomInput";
import { PrimaryButton } from "../Buttons";
import { useLoginController } from "./login.controller";

const Login = () => {

    const { userName,
        password,
        setUserName,
        setPassword,
        errorMessage,
        handleSubmit,
    } = useLoginController()

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