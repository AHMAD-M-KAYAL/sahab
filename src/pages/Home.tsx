import CarouselPhotos from "../components/CarouselPhotos";
import NavBar from "../components/NavBar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton"; // 👈 استدعاء السكلتون
import { FeaturedPlacesHome } from "./FeaturedPlaces/FeaturedPlacesHome";
import { useGetHomePhotos } from "../hook/useGetHomePhotos";
import { CategoriesPlaces } from "./PlaceProvided/CategoriesPlaces";
import { CategoriesServices } from "./ServiceProivded/CategoriesServices";

const Home = () => {
  const { data, isLoading } = useGetHomePhotos(); // 👈 افترض أن الهوك يرجع isLoading

  return (
    <Box sx={{ backgroundColor: "#f9fafb" }}>
      <NavBar />

      <Box sx={{ marginTop: "20px", marginBottom: "20px" }}>
        {isLoading ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={300}
            sx={{ borderRadius: 2 }}
          />
        ) : (
          <CarouselPhotos data={data ?? []} />
        )}
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Stack spacing={2}>
              {isLoading ? (
                <>
                  <Skeleton
                    variant="rectangular"
                    height={200}
                    sx={{ borderRadius: 2 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    height={200}
                    sx={{ borderRadius: 2 }}
                  />
                </>
              ) : (
                <>
                  <CategoriesPlaces />
                  <CategoriesServices />
                </>
              )}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            {isLoading ? (
              <Skeleton
                variant="rectangular"
                height={400}
                sx={{ borderRadius: 2 }}
              />
            ) : (
              <FeaturedPlacesHome />
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
