import { Box, Button, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { t } from "i18next";
import IconBack from "../assets/logo/back.svg";
import { DetailsServiceComponent } from "./ServiceProivded/ServiceForOneCategory/DetailsServiceComponent";
import BookingCardServices from "../components/cards/BookingCardServices";
export const ServicePage = () => {
  const navigate = useNavigate();
  const CategoryType = localStorage.getItem("CategoryType");
  const { id } = useParams();
  
  return (
    <>
      <nav
        className="navbar"
        style={{
          backgroundColor: "white",
          boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)",
        }}
      >
        <Box
          component={Button}
          onClick={() => {
            navigate(-1);
            localStorage.removeItem("CategoryType");
          }}
          sx={{
            width: "10%",
            backgroundColor: "white",
            "&:hover": {
              transform: "translateY(1px) scale(1.201)",
            },
          }}
        >
          <Box component="img" src={IconBack} />
        </Box>
        <Box
          sx={{
            padding: "10px",
            fontWeight: "800",
            fontSize: "30px",
            width: "80%",
          }}
        >
          {t("Popular Categories")}/{CategoryType}
        </Box>
      </nav>
      <Grid
        container
        spacing={1}
        sx={{ paddingTop: "30px", backgroundColor: "#f9fafb" }}
      >
        <Grid size={{ xs: 12, lg: 8 }}>
          <DetailsServiceComponent />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <BookingCardServices />
        </Grid>
      </Grid>
    </>
  );
};
