import CarouselPhotos from "../components/CarouselPhotos";
import NavBar from "../components/NavBar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { FeaturedPlacesHome } from "./FeaturedPlaces/FeaturedPlacesHome";
import { CategoriesPlaces } from "./CategoriesPlaces/CategoriesPlaces";
import { CategoriesServices } from "./services proivded/CategoriesServices";

const Home = () => {
  return (
    <Box sx={{ backgroundColor: "#f9fafb" }}>
      <NavBar />
      <Box sx={{ marginTop: "20px", marginBottom: "20px" }}>
        <CarouselPhotos />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Stack spacing={2}>
              <CategoriesPlaces />
              <CategoriesServices />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <FeaturedPlacesHome />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
