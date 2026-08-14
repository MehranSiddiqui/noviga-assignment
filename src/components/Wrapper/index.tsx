import { Box } from "@mui/material"

const Wrapper = ({ children }: { children: React.ReactElement }): React.ReactElement => {
    return (
        <Box sx={{
            width: "100%",
            height: "auto",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>{children}</Box>
    )
}

export default Wrapper