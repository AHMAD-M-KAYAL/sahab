import { Box, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import IconBack from "../../assets/logo/back.svg";
import { DetailsPlaceComponent } from "./PlacesForOneCategory/DetailsPlaceComponent";
import BookingCardCategory from "../../components/cards/BookingCardCategory";
export const PlacePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <nav
        className="navbar"
        style={{
          backgroundColor: "white",
          direction: "ltr",

          boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)",
        }}
      >
        <Box
          component={Button}
          onClick={() => {
            navigate(-1);
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
        ></Box>
      </nav>
      <Grid
        container
        spacing={1}
        sx={{ paddingTop: "30px", backgroundColor: "#f9fafb" }}
      >
        <Grid size={{ xs: 12, lg: 8 }}>
          <DetailsPlaceComponent />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <BookingCardCategory />
        </Grid>
      </Grid>
    </>
  );
};
