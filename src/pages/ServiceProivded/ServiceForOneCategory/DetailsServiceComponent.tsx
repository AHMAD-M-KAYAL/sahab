import { useParams } from "react-router-dom";
import { Box, Divider } from "@mui/material";
import CarouselPhotos from "../../../components/CarouselPhotos";
import { useGetOneServiceDetails } from "../../../hook/useGetOneServiceDetails";
import StarIcon from "../../../assets/logo/Star.svg";

export const DetailsServiceComponent = () => {
  const { id } = useParams();
  const { data } = useGetOneServiceDetails(Number(id));
  const imagesFromApiForPlace = data?.service_images ?? [];
  return (
    <Box sx={{ marginBottom: "10px" }}>
      {imagesFromApiForPlace.length > 0 && (
        <CarouselPhotos data={imagesFromApiForPlace} />
      )}
      <Box sx={{ paddingLeft: "50px", paddingTop: "30px" }}>
        <Box sx={{ fontWeight: "800", fontSize: "40px" }}>{data?.title}</Box>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ fontWeight: "600", fontSize: "30px" }}>
            {data?.duration}$
          </Box>
        </Box>
        <Box sx={{ display: "flex", paddingTop: "10px" }}>
          <Box component="img" src={StarIcon} />

          <Box sx={{ marginX: "20px" }}>{data?.rating.substring(0, 3)}</Box>
        </Box>
        <Divider
          sx={{ my: 4, borderBottomWidth: 1, bgcolor: "primary.main" }}
        />

        <Box>
          <Box sx={{ fontWeight: "600", fontSize: "30px" }}>
            Service Duration
          </Box>
          <Box sx={{ display: "flex" }}>
            <Box sx={{ marginX: "10px" }}>{data?.duration}</Box>
          </Box>
        </Box>
        <Divider
          sx={{ my: 4, borderBottomWidth: 1, bgcolor: "primary.main" }}
        />

        <Box>
          <Box sx={{ fontWeight: "600", fontSize: "30px" }}>About Service</Box>
          <Box sx={{ marginX: "10px" }}>{data?.description}</Box>
        </Box>
      </Box>
    </Box>
  );
};
