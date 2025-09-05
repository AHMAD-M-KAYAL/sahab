import { Box } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { baseURL } from "../../services/api-client";

export const MyAccount = () => {
  const userName = localStorage.getItem("userName");
  const userPhone = localStorage.getItem("userPhone");
  const userImage = localStorage.getItem("image");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", padding: "20px" }}>
      <Box
        sx={{
          fontWeight: "700",
          fontSize: "30px",
          color: "black",
          fontFamily: "sans-serif",
        }}
      >
        My Account
      </Box>
      <Box sx={{ display: "flex", marginTop: "20px" }}>
        <Avatar
          alt="Remy Sharp"
          src={baseURL + userImage}
          sx={{ width: 80, height: 80 }}
        />
        <Box sx={{ margin: "3px 40px" }}>
          <Box
            sx={{
              fontWeight: "300",
              fontSize: "26px",
              color: "black",
              marginBottom: "4px",
            }}
          >
            {userName ?? "must register"}
          </Box>
          <Box sx={{ fontWeight: "100", fontSize: "20px" }}>
            +965{userPhone ?? ""}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
