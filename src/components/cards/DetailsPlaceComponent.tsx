import CarouselPhotos from "../CarouselPhotos";
import { useGetOnePlaceDetails } from "../../hook/useGetOnePlaceDetails";
import { useParams } from "react-router-dom";
import { Box, Divider } from "@mui/material";
import StarIcon from "../../assets/logo/Star.svg";
import testIcon from "../../assets/logo/IconTest.svg";
import LocationIcon from "../../assets/logo/Location.svg";

export const DetailsPlaceComponent = () => {
  const { id } = useParams();
  const { data } = useGetOnePlaceDetails(Number(id));
  const imagesFromApiForPlace = data?.place_images ?? [];
  return (
    <Box sx={{ marginBottom: "10px" }}>
      {imagesFromApiForPlace.length > 0 && (
        <CarouselPhotos data={imagesFromApiForPlace} />
      )}
      <Box sx={{ paddingLeft: "50px", paddingTop: "30px" }}>
        <Box sx={{ fontWeight: "800", fontSize: "40px" }}>{data?.area}</Box>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ fontWeight: "600", fontSize: "30px" }}>
            Starting From {data?.weekday_price}KD
          </Box>
          <Box
            sx={{
              marginRight: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "fit-content",
              padding: "10px",
              borderRadius: "50px",
              fontWeight: "400",
              backgroundColor: "#567ab88c",
              marginX: "20px",
            }}
          >
            {data?.tag}
          </Box>
        </Box>
        <Box sx={{ display: "flex", paddingTop: "10px" }}>
          <Box component="img" src={StarIcon} />
          <Box sx={{ marginX: "20px" }}>{data?.rating.substring(0, 3)}</Box>
        </Box>
        <Divider
          sx={{ my: 4, borderBottomWidth: 1, bgcolor: "primary.main" }}
        />
        <Box sx={{ fontWeight: "600", fontSize: "30px" }}>Amenities</Box>
        <Box
          sx={{
            display: "flex",
            justifyContent:
              data?.amenities.length === 1 ? "flex-start" : "space-evenly",
          }}
        >
          {data?.amenities.map((ele) => {
            return (
              <Box sx={{ width: "30%", display: "flex", paddingTop: "10px" }}>
                <Box
                  sx={{
                    width: "40px",
                    backgroundColor: "#42424221",
                    padding: "10px",
                    borderRadius: "6px",
                  }}
                  component="img"
                  src={testIcon}
                />
                <Box
                  sx={{
                    marginX: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "20px",
                    fontWeight: "400",
                  }}
                >
                  {ele.title}
                </Box>
              </Box>
            );
          })}
        </Box>
        <Divider
          sx={{ my: 4, borderBottomWidth: 1, bgcolor: "primary.main" }}
        />
        <Box>
          <Box sx={{ fontWeight: "600", fontSize: "30px" }}>Address</Box>
          <Box sx={{ display: "flex" }}>
            <Box component="img" src={LocationIcon} />
            <Box sx={{ marginX: "10px" }}>{data?.address}</Box>
          </Box>
        </Box>
        <Divider
          sx={{ my: 4, borderBottomWidth: 1, bgcolor: "primary.main" }}
        />
        <Box>
          <Box sx={{ fontWeight: "600", fontSize: "30px" }}>About Chalet</Box>
          <Box sx={{ marginX: "10px" }}>{data?.description}</Box>
        </Box>
      </Box>
    </Box>
  );
};
