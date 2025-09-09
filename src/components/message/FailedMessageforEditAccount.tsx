import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router";

export default function FailedPage() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            height: "100px",
            width: "100px",
            backgroundColor: "#ffebee",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
          }}
        >
          <ErrorOutlineIcon color="error" sx={{ fontSize: "50px" }} />
        </Box>
        <Typography sx={{ fontSize: "30px", fontWeight: 600 }}>
          فشلت العملية
        </Typography>
        <Typography sx={{ fontSize: "18px" }}>
          لم يتم تنفيذ طلبك، يرجى المحاولة مرة أخرى
        </Typography>
        <Button
          onClick={() => navigate("/Account")}
          sx={{ width: "300px" }}
          variant="contained"
          color="error"
        >
          حسناً
        </Button>
      </Box>
    </Box>
  );
}
