import { Box, Typography, Button } from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useNavigate } from "react-router";

export default function SuccessMessageforEditAccount() {
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
            backgroundColor: "#c0eddfff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
          }}
        >
          <TaskAltIcon color="success" sx={{ fontSize: "50px" }} />
        </Box>
        <Typography sx={{ fontSize: "30px", fontWeight: 600 }}>
          لقد تم تعديل الحساب
        </Typography>
        <Typography sx={{ fontSize: "18px" }}>تم جدولة خدمتك بنجاح</Typography>
        <Button
          onClick={() => navigate("/Account")}
          sx={{ width: "300px" }}
          variant="contained"
        >
          حسناً
        </Button>
      </Box>
    </Box>
  );
}
