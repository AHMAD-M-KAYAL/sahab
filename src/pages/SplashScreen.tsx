import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import GroubIcon from "../assets/Group.png";
import Layer from "../assets/Layer.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function SplashScreen() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            alignContent: "space-between",
          }}
        >
          <Box sx={{ width: { xs: "140px", md: "250px" }, marginTop: "100px" }}>
            <img src={Layer} style={{ width: "inherit" }} />
          </Box>
          <Box sx={{ width: { xs: "200px", md: "300px" }, marginTop: "100px" }}>
            <img src={GroubIcon} style={{ width: "inherit" }} />
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
}
